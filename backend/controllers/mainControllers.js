const asyncHandler = require("express-async-handler");
const connection = require("../config/dbConfig");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

async function queryDatabase(query, values = []) {
  return new Promise((resolve, reject) => {
    connection.query(query, values, function (error, results) {
      if (error) {
        reject(error);
      } else {
        resolve(results);
      }
    });
  });
}

const verifyEventOrganizer = async (req, res, next) => {
  const organizer_id = req.tokenData.id;
  const { event_id } = req.query;

  let query = "SELECT * FROM `events` WHERE organizer_id = ? AND id = ?";
  const result = await queryDatabase(query, [organizer_id, event_id]);
  if (result.length === 0) {
    return res.sendStatus(401);
  }
  req.event = result[0];
  next();
};

const verifyToken = async (req, res, next) => {
  const { auth } = req.cookies;
  let query = "SELECT * FROM `blacklist` WHERE token = ?";
  const result = await queryDatabase(query, [auth]);
  if (result.length > 0) {
    return res.status(401).send("Invalid token");
  }

  jwt.verify(auth, process.env.JWT_SECRET, {}, (err, decodedToken) => {
    if (err) {
      return res.status(401).json({ message: "Invalid token" });
    }

    req.tokenData = decodedToken;
    next();
  });
};

const verifyOrganizerToken = async (req, res, next) => {
  const { auth } = req.cookies;
  let query = "SELECT * FROM `blacklist` WHERE token = ?";

  const result = await queryDatabase(query, [auth]);
  if (result.length > 0) {
    return res.status(401).send("Invalid token");
  }

  jwt.verify(auth, process.env.JWT_SECRET, {}, (err, decodedToken) => {
    if (err) {
      return res.status(401).json({ message: "Invalid token" });
    }
    if (decodedToken.isOrganizer) {
      req.tokenData = decodedToken;
      next();
    } else {
      return res.status(401).json({ message: "Invalid token" });
    }
  });
};

const verifyAdminToken = (req, res, next) => {
  const { auth } = req.cookies;
  jwt.verify(auth, process.env.ADMIN_SECRET, {}, (err, decodedToken) => {
    if (err) {
      return res.status(401).json({ message: "Invalid token" });
    }
    req.tokenData = decodedToken;
    next();
  });
};

function checkForXSS(input) {
  const xssPattern = /<script|<\/script|javascript:|onerror|onload|<img(.*?)>/i;

  for (let i = 0; i < input.length; i++) {
    if (xssPattern.test(input[i])) {
      return true;
    }
  }

  return false;
}

const register = asyncHandler(async (req, res) => {
  let { username, password, firstName, lastName } = req.body;
  if (
    !username ||
    !password ||
    !firstName ||
    !lastName ||
    username.trim().length === 0 ||
    password.trim().length === 0 ||
    firstName.trim().length === 0 ||
    lastName.trim().length === 0
  )
    return res.status(400).send("Please provide a username and password");

  if (checkForXSS([username, password, firstName, lastName]))
    return res.sendStatus(400);
  const result = await queryDatabase(
    "SELECT * FROM `users` where username = ?",
    [username]
  );
  if (result.length > 0) return res.status(409).send("Username already taken");

  const salt = bcrypt.genSaltSync(10);
  password = bcrypt.hashSync(password, salt);
  const date = new Date();

  const newUser = await queryDatabase(
    "INSERT INTO `users` (firstname, lastName, username, password, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?)",
    [firstName, lastName, username, password, date, date]
  );
  return res.status(200).send("User successfully created");
});

const login = asyncHandler(async (req, res) => {
  const { username, password } = req.body;

  if (
    !username ||
    !password ||
    username.trim().length == 0 ||
    password.trim().length == 0
  ) {
    return res.status(400).send("Please enter a username and password");
  }

  if (checkForXSS([username, password])) return res.sendStatus(400);

  try {
    const results = await queryDatabase(
      "SELECT * FROM `users` WHERE username = ?",
      [username]
    );

    if (results.length === 0) {
      return res.status(401).send("Invalid username or password");
    }

    const passwordMatch = await bcrypt.compare(password, results[0].password);

    if (passwordMatch) {
      const { id, username, firstName, lastName } = results[0];
      const organizer = await queryDatabase(
        "SELECT * FROM `organizers` WHERE user_id = ? AND accepted = ?",
        [id, 1]
      );

      const expirationDate = new Date();
      expirationDate.setDate(expirationDate.getDate() + 1);
      let token;
      if (organizer.length === 1) {
        let query = "SELECT * FROM `events` WHERE organizer_id = ?";
        const hostedEvents = await queryDatabase(query, [id]);
        token = jwt.sign(
          { id, username, firstName, lastName, isOrganizer: true },
          process.env.JWT_SECRET,
          { expiresIn: 86400 }
        );
        res
          .cookie("auth", token, {
            expires: expirationDate,
            sameSite: "None",
            secure: true,
          })
          .json({ id, username, firstName, lastName, token, hostedEvents });
      } else {
        token = jwt.sign(
          { id, username, firstName, lastName, isOrganizer: false },
          process.env.JWT_SECRET,
          {
            expiresIn: 86400,
          }
        );
        res.set("Set-Cookie", `auth=${token};Path=/`);
        res.status(200).json({ id, username, firstName, lastName, token });
      }
    } else {
      res.status(401).send("Invalid username or password");
    }
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).send("Internal Server Error");
  }
});

const getEvents = asyncHandler(async (req, res) => {
  try {
    let { page, userId, event_id } = req.query;
    const pageSize = 20;

    let query = "SELECT * FROM `votes`";
    const votes = await queryDatabase(query);
    const upvotes = votes.filter((vote) => vote.vote == 1);
    const downvotes = votes.filter((vote) => vote.vote == 0);

    if (page) {
      const offset = (page - 1) * pageSize;
      query = "SELECT * FROM `events` ORDER BY id DESC LIMIT ? OFFSET ?";
      const values = [pageSize, offset];
      const events = await queryDatabase(query, values);

      events.forEach((e) => {
        e.upvote = 0;
        e.downvote = 0;
        e.votes = votes.filter((v) => v.event_id == e.id);
        const upvote = upvotes.filter((up) => e.id === up.event_id);
        if (upvote) {
          e.upvote += upvote.length;
        }
        const downvote = downvotes.filter((down) => e.id === down.event_id);
        if (downvote) {
          e.downvote += downvote.length;
        }
      });

      return res.status(200).json({ events });
    }

    if (event_id) {
      query = "SELECT * FROM `events` WHERE id = ?";
      const event = await queryDatabase(query, [event_id]);

      query = "SELECT * FROM `event_participants` WHERE event_id = ?";

      const participants = await queryDatabase(query, [event_id]);
      const participantIds = participants.map(({ user_id }) => user_id);
      const placeholders = participantIds.map(() => "?").join(", ");
      query = `SELECT * FROM users WHERE id IN (${placeholders})`;
      const event_participants = await queryDatabase(query, participantIds);

      query = "SELECT * FROM `users`";
      let users = await queryDatabase(query);

      query = "SELECT * FROM `reviews` WHERE event_id = ?";
      const reviews = await queryDatabase(query, [event_id]);

      reviews.forEach((review) => {
        const matchedUser = users.find((user) => user.id === review.user_id);
        review.firstName = matchedUser.firstName;
        review.lastName = matchedUser.lastName;
        review.username = matchedUser.username;
      });

      const filteredEventParticipants = Object.values(event_participants).map(
        ({ createdAt, updatedAt, password, ...event_participants }) =>
          event_participants
      );
      event[0].upvote = upvotes.filter(
        (up) => up.event_id === event[0].id
      ).length;
      event[0].downvote = downvotes.filter(
        (down) => down.event_id === event[0].id
      ).length;

      filteredEventParticipants.forEach((p) => {
        const matchedParticipant = participants.find(
          (participant) => p.id === participant.user_id
        );
        if (matchedParticipant) {
          p.status = matchedParticipant.status;
        }
      });

      return res.status(200).json({
        event,
        participants: filteredEventParticipants,
        votes: votes.filter((vote) => vote.event_id == event_id),
        reviews: reviews,
      });
    }

    if (userId) {
      let query = "SELECT * FROM `event_participants` WHERE user_id = ?";
      const participatedEvents = await queryDatabase(query, [userId]);
      const event_ids = participatedEvents.map(({ event_id }) => event_id);

      const placeholders = event_ids.map(() => "?").join(", ");
      query = `SELECT * FROM events WHERE id IN (${placeholders})`;

      const events = await queryDatabase(query, event_ids);

      events.forEach((e) => {
        const match = participatedEvents.find((pe) => pe.event_id === e.id);
        e.status = match.status;
      });

      return res.status(200).json(events);
    }

    query = "SELECT * FROM `events` ORDER BY id DESC";
    const results = await queryDatabase(query);
    return res.status(200).send(results);
  } catch (error) {
    console.log(error.name, error.message);
    return res.status(500).send("Internal Server Error");
  }
});

const getEventRegistrants = asyncHandler(async (req, res) => {
  let query = "SELECT * FROM `event_participants` WHERE event_id = ?";
  const participants = await queryDatabase(query, [event_id]);
  return participants;
});

const readNotification = asyncHandler(async (req, res) => {
  try {
    const { notification_id } = req.query;
    let query = "UPDATE `notifications` SET status = ? WHERE id = ?";
    await queryDatabase(query, [1, notification_id]);
    return res.sendStatus(200);
  } catch (error) {
    console.log(error);
    return res.status(500);
  }
});

const userJoinEvent = asyncHandler(async (req, res) => {
  try {
    const event_id = req.query.event_id;
    if (!event_id) return res.status(400).send("Please select a valid event");

    const query =
      "INSERT INTO `event_participants` (event_id, user_id, status) VALUES (?, ?, ?)";
    await queryDatabase(query, [event_id, req.tokenData.id, "pending"]);

    return res.status(200).send("Success");
  } catch (error) {
    if (error.code === "ER_DUP_ENTRY") {
      return res.status(400).send("You have already joined this event");
    }
    return res.status(500).send("Server error");
  }
});

const userLeaveEvent = asyncHandler(async (req, res) => {
  const event_id = req.query.event_id;
  if (!event_id) return res.status(400).send("Please select a valid event");
  let query =
    "DELETE FROM `event_participants` WHERE event_id = ? AND user_id = ?";
  const result = await queryDatabase(query, [event_id, req.tokenData.id]);
  return res.status(200).send("Left event");
});

const getNotifications = asyncHandler(async (req, res) => {
  try {
    const user_id = req.tokenData.id;

    let query = "SELECT * FROM `notifications` WHERE user_id = ?";
    const notifications = await queryDatabase(query, [user_id]);
    res.status(200).json(notifications);
  } catch (error) {
    console.log(error);
  }
});

const approveEventRegistration = asyncHandler(async (req, res) => {
  try {
    const { event_id, user_id } = req.query;

    let query = "SELECT * FROM `events` WHERE id = ? AND organizer_id = ?";
    let result = await queryDatabase(query, [event_id, req.tokenData.id]);
    if (result.length === 0) return res.status(400);

    query =
      "SELECT * FROM `event_participants` WHERE user_id = ? AND event_id = ?";
    result = await queryDatabase(query, [user_id, event_id]);
    if (result.length === 0) return res.status(400);
    if (result[0].status === "accepted") {
      return res.status(400).send("User is already accepted");
    }

    query = "SELECT * FROM `events` WHERE id = ?";
    const event = await queryDatabase(query, [event_id]);
    const event_title = event[0].title;

    query =
      "UPDATE `event_participants` SET status = ? WHERE user_id = ? AND event_id = ?";
    await queryDatabase(query, ["accepted", user_id, event_id]);

    query =
      "SELECT * FROM `notifications` WHERE event_id = ? AND user_id = ? AND notification_type = ?";
    let notification = await queryDatabase(query, [event_id, user_id, 1]);
    if (notification.length === 0) {
      query =
        "INSERT INTO `notifications` (user_id, notification, event_id, notification_type) VALUES (?, ?, ?, ?)";
      await queryDatabase(query, [
        user_id,
        `Your registration request for ${event_title} was accepted`,
        event_id,
        1,
      ]);
    } else {
      query =
        "UPDATE `notifications` SET notification = ? where user_id = ? AND event_id = ? AND notification_type = ?";
      await queryDatabase(query, [
        `Your registration request for ${event_title} was accepted`,
        user_id,
        event_id,
        1,
      ]);
    }
    return res.status(200).json({ status: "accepted" });
  } catch (error) {
    return res.status(500).send("Something went wrong");
  }
});

const rejectEventRegistration = asyncHandler(async (req, res) => {
  try {
    const { event_id, user_id } = req.query;

    let query = "SELECT * FROM `events` WHERE id = ? AND organizer_id = ?";
    let result = await queryDatabase(query, [event_id, req.tokenData.id]);
    if (result.length === 0) return res.status(400);

    query =
      "SELECT * FROM `event_participants` WHERE user_id = ? AND event_id = ?";
    result = await queryDatabase(query, [user_id, event_id]);
    if (result.length === 0) return res.status(400);
    if (result[0].status === "rejected") {
      return res.status(400).send("User is already rejected");
    }

    query = "SELECT * FROM `events` WHERE id = ?";
    const event = await queryDatabase(query, [event_id]);
    const event_title = event[0].title;

    query =
      "UPDATE `event_participants` SET status = ? WHERE user_id = ? AND event_id = ?";
    await queryDatabase(query, ["rejected", user_id, event_id]);

    query =
      "SELECT * FROM `notifications` WHERE event_id = ? AND user_id = ? AND notification_type = ?";
    let notification = await queryDatabase(query, [event_id, user_id, 1]);
    if (notification.length === 0) {
      query =
        "INSERT INTO `notifications` (user_id, notification, event_id, notification_type) VALUES (?, ?, ?, ?)";
      await queryDatabase(query, [
        user_id,
        `Your registration request for ${event_title} was rejected`,
        event_id,
        1,
      ]);
    } else {
      query =
        "UPDATE `notifications` SET notification = ? where user_id = ? AND event_id = ? AND notification_type = ?";
      await queryDatabase(query, [
        `Your registration request for ${event_title} was rejected`,
        user_id,
        event_id,
        1,
      ]);
    }
    return res.status(200).json({ status: "rejected" });
  } catch (error) {
    console.log(error);
    return res.status(500).send("Something went wrong");
  }
});

const cancelEvent = asyncHandler(async (req, res) => {
  try {
    const { event_id } = req.query;
    const { cancel_reason } = req.body;
    let query =
      "UPDATE `events` SET is_cancelled = ?, cancellation_reason = ? WHERE id = ?";
    await queryDatabase(query, [1, cancel_reason, event_id]);

    query =
      "SELECT * FROM `event_participants` WHERE event_id = ? AND status = ?";
    let participants = await queryDatabase(query, [event_id, "accepted"]);
    let participantIds = participants.map(({ user_id }) => user_id);
    participantIds = participantIds.filter((p) => p != req.event.organizer_id);

    query =
      "INSERT INTO `notifications` (user_id, notification, notification_type, event_id) VALUES (?, ?, ?, ?)";
    for (let i = 0; i < participantIds.length; i++) {
      await queryDatabase(query, [
        participantIds[i],
        `${req.event.title} has been cancelled`,
        3,
        req.event.id,
      ]);
    }

    res.status(200).send("Successfully cancelled event");
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
});

const joinOrganizers = asyncHandler(async (req, res) => {
  try {
    const userToken = req.tokenData;
    const check = await queryDatabase(
      "SELECT * FROM `organizers` WHERE user_id = ?",
      [userToken.id]
    );

    if (check.length == 1 && check[0].accepted == true)
      return res.status(200).send("You are already an organizer");

    if (check.length == 0 || check[0].accepted == false) {
      const deleteQuery = await queryDatabase(
        "DELETE FROM `organizers` WHERE user_id = ?",
        [userToken.id]
      );
      await queryDatabase("INSERT INTO `organizers` (user_id) VALUES (?)", [
        userToken.id,
      ]);
      return res.status(200).send("Organizer request pending");
    }
  } catch (error) {
    return res.status(500).send("Something went wrong");
  }
});

const upvoteEvent = asyncHandler(async (req, res) => {
  const { event_id } = req.query;
  const user_id = req.tokenData.id;
  let query = "SELECT * FROM `votes` WHERE event_id = ? AND user_id = ?";
  let result = await queryDatabase(query, [event_id, user_id]);
  if (result.length == 0) {
    query = "INSERT INTO `votes` (user_id, event_id, vote) VALUES (?, ?, ?)";
    await queryDatabase(query, [user_id, event_id, 1]);
  } else {
    query = "UPDATE `votes` SET vote = ? WHERE user_id = ? AND event_id = ?";
    await queryDatabase(query, [1, user_id, event_id]);
  }
  return res.status(200).send("Upvoted event");
});

const downvoteEvent = asyncHandler(async (req, res) => {
  const { event_id } = req.query;
  const user_id = req.tokenData.id;

  let query = "SELECT * FROM `votes` WHERE event_id = ? AND user_id = ?";
  let result = await queryDatabase(query, [event_id, user_id]);
  if (result.length == 0) {
    query = "INSERT INTO `votes` (user_id, event_id, vote) VALUES (?, ?, ?)";
    await queryDatabase(query, [user_id, event_id, 0]);
  } else {
    query = "UPDATE `votes` SET vote = ? WHERE user_id = ? AND event_id = ?";
    await queryDatabase(query, [0, user_id, event_id]);
  }
  return res.status(200).send("Downvoted event");
});

const removeEventVote = asyncHandler(async (req, res) => {
  const { event_id } = req.query;
  const user_id = req.tokenData.id;

  let query = "DELETE FROM `votes` WHERE event_id = ? AND user_id = ?";
  await queryDatabase(query, [event_id, user_id]);

  return res.status(200).send("Removed vote");
});

const reviewEvent = asyncHandler(async (req, res) => {
  const { event_id } = req.query;
  const user_id = req.tokenData.id;

  const { review } = req.body;

  let query =
    "INSERT INTO `reviews` (user_id, event_id, review) VALUES (?, ?, ?)";

  await queryDatabase(query, [user_id, event_id, review]);

  return res.status(200).json({ message: "Reviewed Event" });
});

const deleteReview = asyncHandler(async (req, res) => {
  const { review_id } = req.query;

  let query = "DELETE FROM `reviews` WHERE id = ?";
  await queryDatabase(query, [review_id]);
  return res.status(200).json({ message: "Deleted event review" });
});

const updateReview = asyncHandler(async (req, res) => {
  const { review_id } = req.query;
  const { review } = req.body;

  let query = "UPDATE `reviews` SET review = ? WHERE id = ?";
  await queryDatabase(query, [review, review_id]);
  return res.status(200).send("Updated event review");
});

//organizer routes
const createEvent = asyncHandler(async (req, res) => {
  try {
    const { title, description, event_venue, event_type, event_date } =
      req.body;

    if (!title || !description || !event_type || !event_date)
      return res.status(400).send("Please enter all fields");

    const eventTypeInfo = await queryDatabase(
      "SELECT * FROM `event_types` WHERE event_name = ?",
      [event_type]
    );

    if (eventTypeInfo.length === 0) {
      return res.status(400).send("Invalid event type");
    }

    let filepath = req.file.path;
    filepath = filepath.replace("\\", "/");
    let query =
      "INSERT INTO `events` (organizer_id, title, description, venue, event_type, event_type_id, event_date, createdAt, image) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
    const insertEventValues = [
      req.tokenData.id,
      title,
      description,
      event_venue,
      event_type,
      eventTypeInfo[0].id,
      event_date,
      new Date(),
      filepath,
    ];

    const result = await queryDatabase(query, insertEventValues);

    query =
      "INSERT INTO `event_participants` (user_id, event_id, status) VALUES (?, ?, ?)";
    await queryDatabase(query, [req.tokenData.id, result.insertId, "accepted"]);

    return res.status(200).send("Event created successfully");
  } catch (error) {
    console.log(error);
    // return res.status(500)
  }
});

const deleteEvent = asyncHandler(async (req, res) => {
  try {
    const event_id = req.query.event_id;

    if (!event_id)
      return res.status(400).send("Please provide a valid event_id");

    let { authorization } = req.headers;

    if (!authorization) return res.status(401).send("Unauthorized");

    authorization = authorization.slice(7);

    const organizer = await verifyToken(authorization);

    if (!organizer) return res.status(401).send("Unauthorized");
    if (organizer.isOrganizer === false)
      return res.status(401).send("Unauthorized");

    const results = await queryDatabase(
      "DELETE FROM `events` WHERE id = ? AND organizer_id = ?",
      [event_id, organizer.id]
    );

    if (results.affectedRows == 0) return res.status(401).send("Unauthorized");
    else return res.status(200).send("Successfully deleted event");
  } catch (error) {
    console.log(error.name, error.message);
    return res.status(500).send("Internal Server Error");
  }
});

//admin route
const getOrganizers = asyncHandler(async (req, res) => {
  try {
    let query = "SELECT * FROM `organizers`";
    const organizers = await queryDatabase(query);
    const organizerIds = organizers.map(({ user_id }) => user_id);
    const placeholders = organizerIds.map(() => "?").join(", ");
    query = `SELECT * FROM users WHERE id IN (${placeholders})`;
    const organizerInfo = await queryDatabase(query, organizerIds);
    organizers.forEach((organizer) => {
      const info = organizerInfo.find((o) => o.id == organizer.user_id);
      organizer.username = info.username;
      organizer.firstName = info.firstName;
      organizer.lastName = info.lastName;
    });

    return res.status(200).send(organizers);
  } catch (error) {
    console.log(error);
    return res.status(500).send(error.name);
  }
});

//admin route
const toggleOrganizerStatus = asyncHandler(async (req, res) => {
  try {
    const { organizer_id } = req.query;

    const organizer = await queryDatabase(
      "SELECT * FROM `organizers` WHERE user_id = ?",
      [organizer_id]
    );
    let query = "UPDATE `organizers` SET accepted = ? WHERE user_id = ?";
    let status = Boolean(organizer[0].accepted);

    if (status) {
      await queryDatabase(query, [0, organizer_id]);
    } else {
      await queryDatabase(query, [1, organizer_id]);
    }
    status = !status;
    res.status(200).json({ status });
  } catch (error) {
    console.log(error.name, error.message);
    return res.status(500).send("Internal Server Error");
  }
});

//admin route
const adminLogin = asyncHandler(async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password)
    return res.status(400).send("Please provide a username and password");

  connection.query(
    "SELECT * from `admin` where username = ?",
    [username],
    function (error, results) {
      if (error) return res.status(500);
      if (results.length == 0) {
        return res.status(401).send("Invalid username or password");
      } else {
        bcrypt.compare(password, results[0].password, function (err, result) {
          if (err) res.status(401);
          if (result) {
            const token = jwt.sign(
              {
                username: results[0].username,
                id: results[0].id,
                isAdmin: true,
              },
              process.env.ADMIN_SECRET,
              {
                expiresIn: 86400,
              }
            );

            res.cookie("auth", token, { sameSite: "None", secure: true }).json({
              id: results[0].id,
              username: results[0].username,
              token: token,
            });
          } else {
            res.status(401).send("Invalid username or password");
          }
        });
      }
    }
  );
});

const createEventType = asyncHandler(async (req, res) => {
  try {
    const { event_type } = req.body;
    if (event_type.length == 0) return res.status(400).send("Invalid input");
    const result = await queryDatabase(
      "INSERT INTO `event_types` (event_name) VALUES (?)",
      [event_type]
    );
    if (result) return res.status(200).json({ result });
  } catch (error) {
    return res.status(400).send(error);
  }
});

const getEventTypes = asyncHandler(async (req, res) => {
  const result = await queryDatabase("SELECT * FROM `event_types`");
  return res.status(200).send(result);
});

const deleteEventType = asyncHandler(async (req, res) => {
  try {
    const { event_type_id } = req.query;
    let query = "DELETE FROM `event_types` where id = ?";
    const result = await queryDatabase(query, [event_type_id]);
    if (result.affectedRows == 0) return res.status(400).json({});
    else
      return res
        .status(200)
        .json({ message: "Sucessfully deleted event type" });
  } catch (error) {
    return res.sendStatus(500);
  }
});

const updateEventType = asyncHandler(async (req, res) => {
  try {
    let { event_type_id } = req.query;
    let { new_event_type } = req.body;

    if (!event_type_id || !new_event_type)
      return res.status(400).send("Please enter all fields");

    const result = await queryDatabase(
      "UPDATE `event_types` SET event_name = ? WHERE id = ?",
      [new_event_type, event_type_id]
    );

    if (result)
      res.status(200).json({ message: "Successfully updated event type" });
  } catch (error) {
    return res.status(500).send("Something went wrong");
  }
});

const logout = asyncHandler(async (req, res) => {
  let { auth } = req.cookies;

  const query = "INSERT INTO `blacklist` (token) VALUES (?)";

  await queryDatabase(query, [auth]);

  return res.status(200).send("Loggged out successfully");
});

module.exports = {
  getEvents,
  getEventRegistrants,
  register,
  login,
  logout,
  userJoinEvent,
  userLeaveEvent,
  joinOrganizers,
  upvoteEvent,
  downvoteEvent,
  removeEventVote,
  reviewEvent,
  deleteReview,
  updateReview,
  getNotifications,
  readNotification,

  //organizer routes
  approveEventRegistration,
  rejectEventRegistration,
  createEvent,
  deleteEvent,
  cancelEvent,

  //admin routes
  getOrganizers,
  toggleOrganizerStatus,
  adminLogin,
  createEventType,
  getEventTypes,
  deleteEventType,
  updateEventType,

  verifyToken,
  verifyOrganizerToken,
  verifyAdminToken,
  verifyEventOrganizer,
};
