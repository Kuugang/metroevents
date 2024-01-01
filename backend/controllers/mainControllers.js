const asyncHandler = require("express-async-handler");
const { queryDatabase, initializeDB } = require("../config/dbConfig");
const fs = require("fs");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

let cachedUsers = [];
let cachedNotifications = [];
let cachedEvents = [];
let cachedEventParticipants = [];
let cachedReviews = [];

function deleteFromCache(array, ids, identifier = "id") {
  let updated = array.filter((e) => {
    return !ids.includes(e[identifier]);
  });
  return updated;
}

function filterCache(array, ids, type = 1, identifier = "id") {
  let updated;

  if (type == 1) {
    updated = array.filter((e) => {
      return !ids.includes(e[identifier]);
    });
  }

  if (type == 2) {
    updated = array.filter((e) => {
      return ids.includes(e[identifier]);
    });
  }

  return updated;
}

async function getUsers() {
  try {
    if (cachedUsers.length === 0) {
      let query =
        "SELECT id, firstname, lastname, username, privilege FROM users";
      const result = await queryDatabase(query);
      cachedUsers = result.rows;
    }
    return cachedUsers;
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
}

async function getCachedEvents() {
  try {
    if (cachedEvents.length === 0) {
      let query = "SELECT * FROM events";
      const result = await queryDatabase(query);
      cachedEvents = result.rows;
    }
    return cachedEvents;
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
}

async function getCachedReviews() {
  try {
    if (cachedReviews.length === 0) {
      let query = "SELECT * FROM reviews";
      const result = await queryDatabase(query);
      cachedReviews = result.rows;
    }
    return cachedReviews;
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
}

async function getCachedEventParticipants() {
  try {
    if (cachedEventParticipants.length === 0) {
      let query = "SELECT * FROM event_participants";
      const result = await queryDatabase(query);
      cachedEventParticipants = result.rows;
    }
    return cachedEventParticipants;
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
}

async function getCachedNotifications() {
  try {
    if (cachedNotifications.length === 0) {
      let query = "SELECT * FROM notifications";
      const result = await queryDatabase(query);
      cachedNotifications = result.rows;
    }
    return cachedNotifications;
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
}

initializeDB()
  .then((message) => {
    getUsers();
    getCachedEvents();
    getCachedEventParticipants();
    getCachedNotifications();
  })
  .catch((error) => {
    console.error("Failed to initialize database", error);
  });

async function getUserNotifications(user_id, type = undefined) {
  try {
    let notifications = await getCachedNotifications();
    let userNotifications;

    if (type !== undefined) {
      userNotifications = notifications.filter((n) => {
        return n.user_id == user_id && n.type == type;
      });
    } else {
      userNotifications = notifications.filter((n) => {
        return n.user_id == user_id;
      });
    }

    return userNotifications;
  } catch (error) {}
}

async function findUser(user_id = undefined, username = undefined) {
  try {
    let user;
    let users = await getUsers();

    if (user_id) {
      user = users.find((u) => u.id == user_id);
    }

    if (username) {
      user = users.find((u) => u.username == username);
    }

    return user;
  } catch (error) {}
}

function setUserPrivilege(id, privilege) {
  try {
    if (cachedUsers.length > 0) {
      cachedUsers = cachedUsers.map((u) => {
        if (u.id == id) {
          return {
            ...u,
            privilege: privilege,
          };
        }
        return u;
      });
    }
  } catch (error) {
    return new Error(error);
  }
}

const verifyEventOrganizer = async (req, res, next) => {
  const organizer_id = req.tokenData.id;
  const { event_id } = req.query;

  let query = "SELECT * FROM events WHERE organizer_id = $1 AND id = $2";
  const result = await queryDatabase(query, [organizer_id, event_id]);
  if (result.length === 0) {
    return res.sendStatus(401);
  }
  req.event = result[0];
  next();
};

const verifyToken = async (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization) {
    return res.status(401).send("Unauthorized");
  }
  const token = authorization.split(" ")[1];
  try {
    const results = await queryDatabase(
      "SELECT * FROM blacklist WHERE token = $1",
      [token]
    );
    if (results.length > 0) {
      return res.status(401).send("Token is blacklisted");
    }
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.tokenData = payload;
    next();
  } catch (eror) {
    return res.status(401).send("Unauthorized");
  }
};

const verifyOrganizerToken = async (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization) {
    return res.status(401).send("Unauthorized");
  }
  const token = authorization.split(" ")[1];
  try {
    const results = await queryDatabase(
      "SELECT * FROM blacklist WHERE token = $1",
      [token]
    );
    if (results.length > 0) {
      return res.status(401).send("Token is blacklisted");
    }
    const payload = jwt.verify(token, process.env.JWT_SECRET);

    if (payload.privilege == "user") {
      return res.status(401).send("Unauthorized");
    }
    req.tokenData = payload;
    next();
  } catch (eror) {
    return res.status(401).send("Unauthorized");
  }
};

const verifyAdminToken = async (req, res, next) => {
  const { authorization } = req.headers;
  
  if (!authorization) {
    return res.status(401).send("Unauthorized");
  }
  const token = authorization.split(" ")[1];
  try {
    const results = await queryDatabase(
      "SELECT * FROM blacklist WHERE token = $1",
      [token]
    );
    if (results.length > 0) {
      return res.status(401).send("Token is blacklisted");
    }

    const payload = jwt.verify(token, process.env.JWT_SECRET);

    if (payload.privilege != "admin") {
      return res.status(401).send("Unauthorized");
    }
    req.tokenData = payload;
    next();
  } catch (eror) {
    return res.status(401).send("Unauthorized");
  }
};

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

  const result = await queryDatabase(
    "SELECT * FROM users where username = $1",
    [username]
  );
  if (result.length > 0) return res.status(409).send("Username already taken");

  const salt = bcrypt.genSaltSync(10);
  password = bcrypt.hashSync(password, salt);

  const newUser = (
    await queryDatabase(
      "INSERT INTO users (firstname, lastName, username, password, privilege) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [firstName, lastName, username, password, "user"]
    )
  ).rows[0];
  cachedUsers.unshift(newUser);
  return res.status(200).send("User successfully created");
});

const login = asyncHandler(async (req, res) => {
  try {
    let { username, password } = req.body;

    if (
      !username ||
      !password ||
      username.trim().length == 0 ||
      password.trim().length == 0
    ) {
      return res.status(400).send("Please enter a username and password");
    }

    let user = (
      await queryDatabase("SELECT * FROM users WHERE username = $1", [username])
    ).rows[0];

    if (!user === 0) {
      return res.status(400).send("Invalid username or password");
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch)
      return res.status(400).send("Invalid username or password");

    let {
      id,
      username: fetchedUsername,
      firstname,
      lastname,
      privilege,
    } = user;

    const requests = (
      await queryDatabase("SELECT * FROM requests WHERE user_id = $1", [
        user.id,
      ])
    ).rows;

    const notifications = await getUserNotifications(id);

    let token = jwt.sign(
      { id, username, firstname, lastname, privilege },
      process.env.JWT_SECRET,
      { expiresIn: 86400 }
    );

    res.set(
      "Set-Cookie",
      `boang=${token};Path=/; Domain=metroevents-api.vercel.app;SameSite=None;Secure;`
    );
    res.status(200).json({
      user: {
        id,
        username,
        firstname,
        lastname,
        privilege,
        requests,
        notifications,
        token,
      },
    });
    return;
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).send("Internal Server Error");
  }
});

const getUser = asyncHandler(async (req, res) => {
  try {
    const { username } = req.query;

    const user = await findUser(undefined, username);

    const requests = (
      await queryDatabase("SELECT * FROM requests WHERE user_id = $1", [
        user.id,
      ])
    ).rows;

    const notifications = await getUserNotifications(user.id);

    let reviews = await getCachedReviews();
    reviews = reviews.filter((r) => {
      return r.user_id == user.id;
    });

    user.reviews = reviews;
    user.requests = requests;
    user.notifications = notifications;
    if (user.privilege == "organizer" || user.privilege == "admin") {
      let events = await getCachedEvents();
      events = events.filter((e) => {
        return e.organizer_id == user.id;
      });
      user.hostedEvents = events;
    }

    res.status(200).send(user);
  } catch (error) {
    console.log(error);
    return res.status(500).send(error);
  }
});

const logout = asyncHandler(async (req, res) => {
  let { token } = req.cookies;

  const query = "INSERT INTO blacklist (token) VALUES ($1)";

  const result = await queryDatabase(query, [token]);
  return res.status(200).send("Loggged out successfully");
});

const getEvents = asyncHandler(async (req, res) => {
  try {
    let { page, user_id, event_id } = req.query;
    const pageSize = 20;

    let query = "SELECT * FROM votes";
    const votes = (await queryDatabase(query)).rows;
    const upvotes = votes.filter((vote) => vote.vote == 1);
    const downvotes = votes.filter((vote) => vote.vote == 0);

    const users = await getUsers();
    const reviews = await getCachedReviews();

    if (page) {
      const offset = (page - 1) * pageSize;
      query = "SELECT * FROM events ORDER BY id DESC LIMIT $1 OFFSET $2";
      const values = [pageSize, offset];
      const events = (await queryDatabase(query, values)).rows;

      query = "SELECT id, user_id, event_id, status FROM event_participants";
      const participants = (await queryDatabase(query)).rows;

      events.forEach((e) => {
        const utcDate = new Date(e.datetime);
        const localTimezoneOffset = utcDate.getTimezoneOffset();
        const localDateTime = new Date(
          utcDate.getTime() - localTimezoneOffset * 60 * 1000
        ).toLocaleString();
        e.datetime = localDateTime;
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
        e.host = users.find((h) => h.id === e.organizer_id);

        e.participants = participants
          .filter((p) => p.event_id === e.id && p.user_id !== e.organizer_id)
          .map((participant) => ({
            ...participant,
            firstname: users.find((u) => u.id == participant.user_id).firstname,
            lastname: users.find((u) => u.id == participant.user_id).lastname,
            username: users.find((u) => u.id == participant.user_id).username,
          }));

        e.reviews = [];

        if (reviews.length > 0) {
          let matchedReviews = reviews.filter(
            (review) => review.event_id == e.id
          );
          matchedReviews = matchedReviews.map((r) => {
            const matchedUser = users.find((u) => u.id == r.user_id);
            return {
              ...r,
              firstname: matchedUser.firstname,
              lastname: matchedUser.lastname,
              username: matchedUser.username,
            };
          });

          e.reviews = matchedReviews;
        }
      });

      return res.status(200).json({ events });
    }

    if (event_id) {
      query = "SELECT * FROM events WHERE id = $1";
      const event = (await queryDatabase(query, [event_id])).rows[0];

      const utcDate = new Date(event.datetime);
      const localTimezoneOffset = utcDate.getTimezoneOffset();
      const localDateTime = new Date(
        utcDate.getTime() - localTimezoneOffset * 60 * 1000
      ).toLocaleString();

      event.datetime = localDateTime;
      query = "SELECT * FROM users WHERE id = $1";
      let host = (await queryDatabase(query, [event.organizer_id])).rows[0];

      event.host = (({ id, username, firstname, lastname }) => ({
        id,
        username,
        firstname,
        lastname,
      }))(host);

      query = "SELECT * FROM votes WHERE event_id = $1";
      const votes = (await queryDatabase(query, [event_id])).rows;
      event.votes = votes;

      query =
        "SELECT id, user_id, status FROM event_participants WHERE event_id = $1";

      let participants = (await queryDatabase(query, [event_id])).rows;
      const participantIds = participants.map(({ user_id }) => user_id);
      const placeholders = participantIds
        .map((_, index) => `$${index + 1}`)
        .join(", ");

      participants = participants.filter(
        (p) => p.user_id !== event.organizer_id
      );

      participants.forEach((p) => {
        const matchedUser = users.find(
          (u) => u.id === p.user_id && event.organizer_id !== u.id
        );
        if (matchedUser) {
          p.user_id = matchedUser.id;
          p.firstname = matchedUser.firstname;
          p.lastname = matchedUser.lastname;
          p.username = matchedUser.username;
        }
      });

      query = "SELECT * FROM reviews WHERE event_id = $1";
      const reviews = (await queryDatabase(query, [event_id])).rows;

      reviews.forEach((review) => {
        const matchedUser = users.find((user) => user.id === review.user_id);
        review.firstname = matchedUser.firstname;
        review.lastname = matchedUser.lastname;
        review.username = matchedUser.username;
      });

      return res.status(200).json({
        event,
        participants: participants,
        reviews: reviews,
      });
    }

    if (user_id) {
      const queryParticipants =
        "SELECT * FROM event_participants WHERE user_id = $1";
      const participatedEvents =
        (await queryDatabase(queryParticipants, [user_id])).rows || [];

      const event_ids = participatedEvents
        .map(({ event_id }) => event_id)
        .filter(Boolean);

      if (event_ids.length === 0) {
        return res.status(200).json([]);
      }

      const placeholders = event_ids
        .map((_, index) => `$${index + 1}`)
        .join(", ");

      const queryEvents = `SELECT * FROM events WHERE id IN (${placeholders})`;

      const events = (await queryDatabase(queryEvents, event_ids)).rows;

      events.forEach((e) => {
        const match = participatedEvents.find((pe) => pe.event_id === e.id);
        e.status = match ? match.status : null;
      });

      return res.status(200).json(events);
    }

    // query = "SELECT * FROM `events` ORDER BY id DESC";
    // const results = await queryDatabase(query);
    // return res.status(200).send(results);
  } catch (error) {
    console.log(error.name, error.message);
    return res.status(500).send("Internal Server Error");
  }
});

const getEventRegistrants = asyncHandler(async (req, res) => {
  let query = "SELECT * FROM event_participants WHERE event_id = ?";
  const participants = await queryDatabase(query, [event_id]);
  return participants;
});

const readNotification = asyncHandler(async (req, res) => {
  try {
    const { notification_id } = req.query;
    let query = "UPDATE notifications SET read = $1 WHERE id = $2";
    await queryDatabase(query, [true, notification_id]);

    const notifications = await getCachedNotifications();

    const updatedNotifications = notifications.map((n) => {
      if (n.id == notification_id) {
        return {
          ...n,
          read: true,
        };
      }
      return n;
    });

    cachedNotifications = updatedNotifications;
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
      "INSERT INTO event_participants (event_id, user_id, status) VALUES ($1, $2, $3) RETURNING *";
    const result = (
      await queryDatabase(query, [event_id, req.tokenData.id, "pending"])
    ).rows[0];

    cachedEventParticipants.unshift(result);

    return res.status(200).send(result);
  } catch (error) {
    console.log(error);
    return res.status(500).send(error);
  }
});

const userLeaveEvent = asyncHandler(async (req, res) => {
  try {
    const event_id = req.query.event_id;
    if (!event_id) return res.status(400).send("Please select a valid event");
    let query =
      "DELETE FROM event_participants WHERE event_id = $1 AND user_id = $2";
    await queryDatabase(query, [event_id, req.tokenData.id]);

    deleteFromCache(cachedEventParticipants, [req.tokenData.id]);

    return res.status(200).send("Left event");
  } catch (error) {
    return res.status(500).send(error);
  }
});

const userGetNotifications = asyncHandler(async (req, res) => {
  try {
    const user_id = req.tokenData.id;

    let query = "SELECT * FROM `notifications` WHERE user_id = ?";
    const notifications = await queryDatabase(query, [user_id]);
    res.status(200).json(notifications);
  } catch (error) {
    console.log(error);
  }
});

//socket
const approveEventRegistration = asyncHandler(async (req, res) => {
  try {
    const { event_id, user_id } = req.query;
    let query = "SELECT * FROM events WHERE id = $1 AND organizer_id = $2";
    let result = (await queryDatabase(query, [event_id, req.tokenData.id]))
      .rows;
    if (result.length === 0) return res.status(400);

    query =
      "SELECT * FROM event_participants WHERE user_id = $1 AND event_id = $2";
    result = (await queryDatabase(query, [user_id, event_id])).rows;
    if (result.length === 0) return res.status(400);

    if (result[0].status === "accepted") {
      return res.status(400).send("User is already accepted");
    }

    query = "SELECT * FROM events WHERE id = $1";
    const event = (await queryDatabase(query, [event_id])).rows;
    const event_title = event[0].title;

    query =
      "UPDATE event_participants SET status = $1 WHERE user_id = $2 AND event_id = $3";
    await queryDatabase(query, ["accepted", user_id, event_id]);

    let message = `Your registration request for ${event_title} was accepted`;
    let notification = (await getUserNotifications(user_id, 1))[0];

    console.log(notification);

    if (!notification) {
      query =
        "INSERT INTO notifications (user_id, notification, event_id, type) VALUES ($1, $2, $3, $4) RETURNING *";
      const result = (
        await queryDatabase(query, [user_id, message, event_id, 1])
      ).rows[0];

      cachedNotifications.unshift(result);
    } else {
      query =
        "UPDATE notifications SET notification = $1, read = $2 where user_id = $3 AND event_id = $4 AND type = $5 RETURNING *";
      const result = (
        await queryDatabase(query, [message, false, user_id, event_id, 1])
      ).rows[0];

      const notifications = await getCachedNotifications();
      const updatedNotifications = notifications.map((n) => {
        if (n.id == result.id) {
          return {
            ...n,
            notification: message,
            read: false,
          };
        }
        return n;
      });
      cachedNotifications = updatedNotifications;
    }

    return res.status(200).json({ status: "accepted" });
  } catch (error) {
    console.log(error);
    return res.status(500).send(error);
  }
});

const rejectEventRegistration = asyncHandler(async (req, res) => {
  try {
    const { event_id, user_id } = req.query;

    let query = "SELECT * FROM events WHERE id = $1 AND organizer_id = $2";
    let result = (await queryDatabase(query, [event_id, req.tokenData.id]))
      .rows;
    if (result.length === 0) return res.status(400);

    query =
      "SELECT * FROM event_participants WHERE user_id = $1 AND event_id = $2";
    result = (await queryDatabase(query, [user_id, event_id])).rows;
    if (result.length === 0) return res.status(400);
    if (result[0].status === "rejected") {
      return res.status(400).send("User is already rejected");
    }

    query = "SELECT * FROM events WHERE id = $1";
    const event = (await queryDatabase(query, [event_id])).rows;
    const event_title = event[0].title;

    query =
      "UPDATE event_participants SET status = $1 WHERE user_id = $2 AND event_id = $3";
    await queryDatabase(query, ["rejected", user_id, event_id]);

    let message = `Your registration request for ${event_title} was rejected`;
    let notification = (await getUserNotifications(user_id, 1))[0];

    if (!notification) {
      query =
        "INSERT INTO notifications (user_id, notification, event_id, type) VALUES ($1, $2, $3, $4) RETURNING *";
      const result = (
        await queryDatabase(query, [user_id, message, event_id, 1])
      ).rows[0];

      cachedNotifications.unshift(result);
    } else {
      console.log(message, user_id, event_id);
      query =
        "UPDATE notifications SET notification = $1, read = $2 WHERE user_id = $3 AND event_id = $4 AND type = $5 RETURNING *";
      const result = (
        await queryDatabase(query, [message, false, user_id, event_id, 1])
      ).rows[0];

      const notifications = await getCachedNotifications();

      const updatedNotifications = notifications.map((n) => {
        if (n.id == result.id) {
          return {
            ...n,
            notification: message,
            read: false,
          };
        }
        return n;
      });
      cachedNotifications = updatedNotifications;
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
      "UPDATE events SET is_cancelled = $1, cancellation_reason = $2 WHERE id = $3";
    await queryDatabase(query, [1, cancel_reason, event_id]);

    let events = await getCachedEvents();
    let event = events.find((e) => e.id == event_id);

    console.log(event_id);
    let participants = await getCachedEventParticipants();
    participants = participants.filter((p) => {
      return p.event_id == event_id;
    });

    let participantIds = participants.map(({ user_id }) => user_id);

    participantIds = participantIds.filter((p) => {
      return p != event.organizer_id;
    });

    query =
      "INSERT INTO notifications (user_id, notification, type, event_id) VALUES ($1, $2, $3, $4) RETURNING *";

    for (let i = 0; i < participantIds.length; i++) {
      const result = (
        await queryDatabase(query, [
          participantIds[i],
          `${event.title} has been cancelled`,
          3,
          event.id,
        ])
      ).rows[0];
      cachedNotifications.unshift(result);
    }

    event.is_cancelled = true;
    event.cancellation_reason = cancel_reason;
    events = events.map((e) => {
      if (e.id == event_id) {
        return event;
      }
      return e;
    });

    cachedEvents = events;

    res.status(200).send("Successfully cancelled event");
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
});

const joinOrganizers = asyncHandler(async (req, res) => {
  try {
    const userToken = req.tokenData;
    const { message } = req.body;
    const check = await queryDatabase(
      "SELECT * FROM users WHERE id = $1 AND privilege = $2",
      [userToken.id, "organizer"]
    );

    const user = check.rows[0];
    console.log(cachedUsers);

    if (user != undefined && user.privilege === "organizer")
      return res.status(200).send("You are already an organizer");
    else {
      await queryDatabase(
        "INSERT INTO requests (user_id, type, message) VALUES ($1, $2, $3)",
        [userToken.id, 1, message]
      );
      return res.status(200).send("Organizer request pending");
    }
  } catch (error) {
    return res.status(500).send("Something went wrong" + error);
  }
});

const upvoteEvent = asyncHandler(async (req, res) => {
  const { event_id } = req.query;
  const user_id = req.tokenData.id;
  let query = "SELECT * FROM votes WHERE event_id = $1 AND user_id = $2";
  let result = (await queryDatabase(query, [event_id, user_id])).rows;
  if (result.length == 0) {
    query = "INSERT INTO votes (user_id, event_id, vote) VALUES ($1, $2, $3)";
    await queryDatabase(query, [user_id, event_id, 1]);
  } else {
    query = "UPDATE votes SET vote = $1 WHERE user_id = $2 AND event_id = $3";
    await queryDatabase(query, [1, user_id, event_id]);
  }
  query = "SELECT * FROM votes WHERE event_id = $1";
  const votes = (await queryDatabase(query, [event_id])).rows;
  return res.status(200).json(votes);
});

const downvoteEvent = asyncHandler(async (req, res) => {
  try {
    const { event_id } = req.query;
    const user_id = req.tokenData.id;

    let query = "SELECT * FROM votes WHERE event_id = $1 AND user_id = $2";
    let result = (await queryDatabase(query, [event_id, user_id])).rows;
    if (result.length == 0) {
      query = "INSERT INTO votes (user_id, event_id, vote) VALUES ($1, $2, $3)";
      await queryDatabase(query, [user_id, event_id, false]);
    } else {
      query = "UPDATE votes SET vote = $1 WHERE user_id = $2 AND event_id = $3";
      await queryDatabase(query, [0, user_id, event_id]);
    }

    query = "SELECT * FROM votes WHERE event_id = $1";
    const votes = (await queryDatabase(query, [event_id])).rows;
    return res.status(200).json(votes);
  } catch (error) {
    console.log(error.message);
  }
});

const removeEventVote = asyncHandler(async (req, res) => {
  const { event_id } = req.query;
  const user_id = req.tokenData.id;

  let query = "DELETE FROM votes WHERE event_id = $1 AND user_id = $2";
  await queryDatabase(query, [event_id, user_id]);

  query = "SELECT * FROM votes WHERE event_id = $1";
  const votes = (await queryDatabase(query, [event_id])).rows;
  return res.status(200).json(votes);
});

const reviewEvent = asyncHandler(async (req, res) => {
  const { event_id } = req.query;
  const user_id = req.tokenData.id;

  const { review } = req.body;

  let query =
    "INSERT INTO reviews (user_id, event_id, review) VALUES ($1, $2, $3) RETURNING *";
  const result = (await queryDatabase(query, [user_id, event_id, review]))
    .rows[0];

  const user = await findUser(user_id);
  result.firstname = user.firstname;
  result.lastname = user.lastname;
  result.username = user.username;
  cachedReviews.unshift(result);
  return res.status(200).send(result);
});

const deleteReview = asyncHandler(async (req, res) => {
  const { review_id } = req.query;

  let query = "DELETE FROM reviews WHERE id = $1";
  await queryDatabase(query, [parseInt(review_id)]);

  const reviews = await getCachedReviews();
  const updatedReviews = reviews.filter((r) => {
    return r.id != review_id;
  });
  cachedReviews = updatedReviews;
  return res.status(200).json({ message: "Deleted event review" });
});

const updateReview = asyncHandler(async (req, res) => {
  try {
    const { review_id } = req.query;
    const { review } = req.body;

    let query = "UPDATE reviews SET review = $1 WHERE id = $2 RETURNING *";
    const data = (await queryDatabase(query, [review, review_id])).rows[0];

    const reviews = await getCachedReviews();
    const updatedReviews = reviews.map((r) => {
      if (r.id == review_id) {
        return {
          ...r,
          review: data.review,
        };
      }
      return r;
    });

    cachedReviews = updatedReviews;

    return res.status(200).send("Updated Review");
  } catch (error) {
    console.log(error);
    return res.status(500).send(error);
  }
});

//organizer routes
const createEvent = asyncHandler(async (req, res) => {
  try {
    const { title, description, venue, type, datetime, image } = req.body;
    if (!title || !description || !venue || !type || !datetime || !image)
      return res.status(400).send("Please enter all fields");

    const eventType = (
      await queryDatabase("SELECT * FROM event_types WHERE event_name = $1", [
        type,
      ])
    ).rows[0];

    if (!eventType) {
      return res.status(400).send("Invalid event type");
    }

    let query =
      "INSERT INTO events (organizer_id, title, description, venue, type, event_type_id, datetime, createdAt, image) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *";
    const insertEventValues = [
      req.tokenData.id,
      title,
      description,
      venue,
      type,
      eventType.id,
      datetime,
      new Date(),
      image,
    ];

    const result = (await queryDatabase(query, insertEventValues)).rows[0];

    query =
      "INSERT INTO event_participants (event_id, user_id, status) VALUES ($1, $2, $3)";
    await queryDatabase(query, [result.id, req.tokenData.id, "accepted"]);
    return res.status(200).json({ result });
  } catch (error) {
    console.log(error);
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

const updateEvent = asyncHandler(async (req, res) => {
  try {
    const { title, description, venue, type, datetime, image } = req.body;
    const { event_id } = req.query;

    if (!event_id)
      return res.status(400).send("Please provide a valid event_id");

    let query;
    let result;

    if (image) {
      query =
        "UPDATE events SET title = $1, description = $2, venue = $3, type = $4, datetime = $5, image = $6, updatedAt =$7 WHERE id = $8 RETURNING *";
      result = (
        await queryDatabase(query, [
          title,
          description,
          venue,
          type,
          datetime,
          image,
          new Date(),
          event_id,
        ])
      ).rows[0];
    } else {
      query =
        "UPDATE events SET title = $1, description = $2, venue = $3, type = $4, datetime = $5, updatedAt = $6 WHERE id = $7 RETURNING *";
      result = (
        await queryDatabase(query, [
          title,
          description,
          venue,
          type,
          datetime,
          new Date(),
          event_id,
        ])
      ).rows[0];
    }

    return res.status(200).send(result);
  } catch (error) {
    console.log(error);
    return res.status(500).send(error);
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

//admin route
const createEventType = asyncHandler(async (req, res) => {
  try {
    const { event_type } = req.body;
    if (event_type.length == 0) return res.status(400).send("Invalid input");
    const result = (
      await queryDatabase(
        "INSERT INTO event_types (event_name) VALUES ($1) RETURNING *",
        [event_type]
      )
    ).rows[0];

    return res.status(200).send(result);
  } catch (error) {
    return res.status(400).send(error);
  }
});

const getEventTypes = asyncHandler(async (req, res) => {
  const result = (await queryDatabase("SELECT * FROM event_types")).rows;
  return res.status(200).send(result);
});

const deleteEventType = asyncHandler(async (req, res) => {
  try {
    const { event_type_id } = req.query;
    let query = "DELETE FROM event_types where id = $1";

    const result = await queryDatabase(query, [event_type_id]);

    if (result.affectedRows == 0) return res.status(400).json({});
    else return res.status(200).send("Sucessfully deleted event type");
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
      "UPDATE event_types SET event_name = $1 WHERE id = $2",
      [new_event_type, event_type_id]
    );

    if (result) res.status(200).send("Successfully updated event type");
  } catch (error) {
    return res.status(500).send("Something went wrong");
  }
});

const adminGetUsers = asyncHandler(async (req, res) => {
  try {
    let users = await getUsers();
    users = users.filter((u) => u.privilege != "admin");
    return res.status(200).send(users);
  } catch (error) {
    console.log(error);
  }
});

const adminSetUserPrivilege = asyncHandler(async (req, res) => {
  let { user_id } = req.query;
  let { privilege } = req.body;

  try {
    let query = "UPDATE users SET privilege = $1 WHERE id = $2";
    await queryDatabase(query, [privilege, user_id]);

    setUserPrivilege(user_id, privilege);

    return res.status(200).send("Updated user privilege");
  } catch (error) {
    console.log(error);
  }
});

const getUserRequests = asyncHandler(async (req, res) => {
  try {
    let query = "SELECT * FROM requests";
    const userRequests = (await queryDatabase(query)).rows;
    return res.status(200).send(userRequests);
  } catch (error) {
    return res.status(500).send(error);
  }
});

//notification
const acceptOrganizerRequest = asyncHandler(async (req, res) => {
  try {
    let { user_id, request_id } = req.body;

    let query = "UPDATE users SET privilege = $1 WHERE id = $2";
    await queryDatabase(query, ["organizer", user_id]);

    query = "DELETE FROM requests WHERE id = $1";
    await queryDatabase(query, [request_id]);

    setUserPrivilege(user_id, "organizer");

    let message = `Your request to be an organizer was accepted`;
    let notification = (await getUserNotifications(user_id, 2))[0];

    if (!notification) {
      query =
        "INSERT INTO notifications (user_id, notification, type) VALUES ($1, $2, $3) RETURNING *";
      const result = (await queryDatabase(query, [user_id, message, 2]))
        .rows[0];

      cachedNotifications.unshift(result);
    } else {
      query =
        "UPDATE notifications SET notification = $1 where user_id = $2 AND type = $3 RETURNING *";
      const result = (await queryDatabase(query, [message, user_id, 2]))
        .rows[0];

      const updatedNotifications = cachedNotifications.map((n) => {
        if (n.id == result.id) {
          return {
            ...n,
            notification: message,
          };
        }
        return n;
      });
      cachedNotifications = updatedNotifications;
    }

    return res.status(200).send("Accepted Organizer Request");
  } catch (error) {
    console.log(error);
    return res.status(500).send(error);
  }
});

//notification
const rejectOrganizerRequest = asyncHandler(async (req, res) => {
  try {
    let { user_id, request_id } = req.body;

    let query = "UPDATE users SET privilege = $1 WHERE id = $2";
    await queryDatabase(query, ["user", user_id]);

    query = "DELETE FROM requests WHERE id = $1";
    await queryDatabase(query, [request_id]);

    setUserPrivilege(user_id, "user");

    let message = `Your request to be an organizer was rejected`;
    let notification = (await getUserNotifications(user_id, 2))[0];

    if (!notification) {
      query =
        "INSERT INTO notifications (user_id, notification, type) VALUES ($1, $2, $3) RETURNING *";
      const result = (await queryDatabase(query, [user_id, message, 2]))
        .rows[0];

      cachedNotifications.unshift(result);
    } else {
      query =
        "UPDATE notifications SET notification = $1 where user_id = $2 AND type = $3 RETURNING *";
      const result = (await queryDatabase(query, [message, user_id, 2]))
        .rows[0];

      const updatedNotifications = cachedNotifications.map((n) => {
        if (n.id == result.id) {
          return {
            ...n,
            notification: message,
          };
        }
        return n;
      });
      cachedNotifications = updatedNotifications;
    }

    return res.status(200).send("Rejected Organizer Request");
  } catch (error) {
    return res.status(500).send(error);
  }
});

module.exports = {
  getEvents,
  getUser,
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
  userGetNotifications,
  readNotification,

  //organizer routes
  approveEventRegistration,
  rejectEventRegistration,
  createEvent,
  deleteEvent,
  updateEvent,
  cancelEvent,

  //admin routes
  getOrganizers,
  createEventType,
  getEventTypes,
  deleteEventType,
  updateEventType,
  adminGetUsers,
  adminSetUserPrivilege,
  getUserRequests,
  acceptOrganizerRequest,
  rejectOrganizerRequest,

  verifyToken,
  verifyOrganizerToken,
  verifyAdminToken,
  verifyEventOrganizer,
};
