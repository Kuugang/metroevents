function parseJwt(token) {
  var base64Url = token.split(".")[1];
  var base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  var jsonPayload = decodeURIComponent(
    window
      .atob(base64)
      .split("")
      .map(function (c) {
        return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join("")
  );
  return JSON.parse(jsonPayload);
}

const login = async function () {
  const username = document.getElementById("loginUsername").value;
  const password = document.getElementById("loginPassword").value;
  try {
    const response = await fetch(`http://localhost:6969/user/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        username: username,
        password: password,
      }),
    });
    if (response.ok) {
      const data = await response.json();
      return data;
    } else {
      throw new Error("Network response was not ok.");
    }
  } catch (error) {
    console.error("An error occurred:", error);
  }
};

async function getEvents(
  page = undefined,
  event_id = undefined,
  userId = undefined
) {
  let url;

  url = `http://localhost:6969/getEvents`;

  if (userId) {
    url = `http://localhost:6969/getEvents?userId=${userId}`;
  }

  if (event_id) {
    url = `http://localhost:6969/getEvents?event_id=${event_id}`;
  }

  if (page) {
    url = `http://localhost:6969/getEvents?page=${page}`;
  }

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    if (response.ok) {
      const events = await response.json();
      return events;
    } else {
      throw new Error("Network response was not ok.");
    }
  } catch (error) {
    console.error("An error occurred:", error);
  }
}

async function register() {
  const username = document.getElementById("registerUsername").value;
  const password = document.getElementById("registerPassword").value;
  const firstName = document.getElementById("registerFirstName").value;
  const lastName = document.getElementById("registerLastName").value;

  try {
    const response = await fetch(`http://localhost:6969/user/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        username: username,
        password: password,
        firstName: firstName,
        lastName: lastName,
      }),
    });
    if (response.ok) {
      return response;
    }
  } catch (error) {
    console.log(error);
  }
}

async function joinOrganizers() {
  try {
    const response = await fetch(`http://localhost:6969/user/joinOrganizers`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    if (response.statusCode === 200) {
      const data = await response.json();
      return data;
    }
  } catch (error) {
    console.log(error);
  }
}

async function getEventRegistrants(event_id) {
  try {
    const response = await fetch(
      `http://localhost:6969/getEventRegistrants?=${event_id}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      }
    );
    if (response.statusCode === 200) {
      const data = await response.json();
      return data;
    }
  } catch (error) {
    console.log(error);
    throw new Error("Something went wrong");
  }
}

async function createEvent(title, description, event_venue, event_type, imageFile, event_date) {
  try {
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("event_venue", event_venue);
    formData.append("event_type", event_type);
    formData.append("event_date", event_date);
    formData.append("imgfile", imageFile);

    const response = await fetch(
      `http://localhost:6969/organizer/createEvent`,
      {
        method: "POST",
        body: formData,
        credentials: "include",
      }
    );

    if (response.ok) {
      return true;
    } else {
      throw new Error("Failed to create event");
    }
  } catch (error) {
    throw new Error("Something went wrong");
  }
}

async function joinEvent(event_id) {
  try {
    const response = await fetch(
      `http://localhost:6969/event/joinEvent?event_id=${event_id}`,
      {
        method: "POST",
        credentials: "include",
      }
    );

    if (response.ok) {
      return response;
    } else {
      throw new Error("Failed to join event");
    }
  } catch (error) {
    throw new Error("Something went wrong");
  }
}

async function leaveEvent(event_id) {
  try {
    const response = await fetch(
      `http://localhost:6969/event/leaveEvent?event_id=${event_id}`,
      {
        method: "POST",
        credentials: "include",
      }
    );

    if (response.ok) {
      return response;
    } else {
      throw new Error("Failed to leave event");
    }
  } catch (error) {
    throw new Error("Something went wrong");
  }
}

async function upvoteEvent(event_id) {
  let url = `http://localhost:6969/event/upvote?event_id=${event_id}`;
  try {
    const response = await fetch(url, {
      method: "POST",
      credentials: "include",
    });

    if (response.ok) {
      return response;
    } else {
      throw new Error("Failed to upvote event");
    }
  } catch (error) {
    throw new Error("Something went wrong");
  }
}

async function downvoteEvent(event_id) {
  let url = `http://localhost:6969/event/downvote?event_id=${event_id}`;
  try {
    const response = await fetch(url, {
      method: "POST",
      credentials: "include",
    });

    if (response.ok) {
      return response;
    } else {
      throw new Error("Failed to downvote event");
    }
  } catch (error) {
    throw new Error("Something went wrong");
  }
}

async function removeEventVote(event_id) {
  let url = `http://localhost:6969/event/removeVote?event_id=${event_id}`;
  try {
    const response = await fetch(url, {
      method: "POST",
      credentials: "include",
    });

    if (response.ok) {
      return response;
    } else {
      throw new Error("Failed to downvote event");
    }
  } catch (error) {
    throw new Error("Something went wrong");
  }
}

async function approveEventRegistration(event_id, user_id) {
  try {
    let url = `http://localhost:6969/organizer/event/approve?event_id=${event_id}&user_id=${user_id}`;

    const response = await fetch(url, {
      method: "PUT",
      credentials: "include",
    });

    if (response.ok) {
      const status = await response.json();
      return status;
    } else {
      throw new Error("Failed to accept user event registration");
    }
  } catch (error) {
    throw new Error("Something went wrong");
  }
}

async function rejectEventRegistration(event_id, user_id) {
  try {
    let url = `http://localhost:6969/organizer/event/reject?event_id=${event_id}&user_id=${user_id}`;

    const response = await fetch(url, {
      method: "PUT",
      credentials: "include",
    });

    if (response.ok) {
      const status = await response.json();
      return status;
    } else {
      throw new Error("Failed to reject user event registration");
    }
  } catch (error) {
    throw new Error("Something went wrong");
  }
}

const adminLogin = async function () {
  const username = document.getElementById("loginUsername").value;
  const password = document.getElementById("loginPassword").value;
  try {
    const response = await fetch(`http://localhost:6969/admin/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        username: username,
        password: password,
      }),
    });
    if (response.ok) {
      const data = await response.json();
      return data;
    } else {
      throw new Error("Network response was not ok.");
    }
  } catch (error) {
    console.error("An error occurred:", error);
  }
};

async function getOrganizers() {
  try {
    let url = "http://localhost:6969/admin/organizers";
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });
    if (response.ok) {
      const data = await response.json();
      return data;
    } else {
      throw new Error("Network response was not ok.");
    }
  } catch (error) {
    console.error("An error occurred:", error);
  }
}

async function toggleOrganizerStatus(organizer_id) {
  try {
    let url = `http://localhost:6969/admin/organizer/status?organizer_id=${organizer_id}`;
    const response = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });
    if (response.ok) {
      const data = await response.json();
      return data;
    } else {
      throw new Error("Network response was not ok.");
    }
  } catch (error) {
    console.error("An error occurred:", error);
  }
}

async function getEventTypes() {
  try {
    let url;

    if(parseJwt(document.cookie).isOrganizer){
        url = `http://localhost:6969/organizer/event`
    }

    if(parseJwt(document.cookie).isAdmin){
        url = `http://localhost:6969/admin/event`
    }
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });
    if (response.ok) {
      const data = await response.json();
      return data;
    } else {
      throw new Error("Network response was not ok.");
    }
  } catch (error) {
    console.error("An error occurred:", error);
  }
}


async function newEventType(event_type) {
  try {
    let url = `http://localhost:6969/admin/event`
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body : JSON.stringify({
        event_type : event_type,
      }),
      credentials: "include",
    });
    if (response.ok) {
      const data = await response.json();
      return data;
    } else {
      throw new Error("Network response was not ok.");
    }
  } catch (error) {
    console.error("An error occurred:", error);
  }
}

async function deleteEventType(event_type_id) {
  try {
    let url = `http://localhost:6969/admin/event?event_type_id=${event_type_id}`
    const response = await fetch(url, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });
    if (response.ok) {
      const data = await response.json();
      return data;
    } else {
      throw new Error("Network response was not ok.");
    }
  } catch (error) {
    console.error("An error occurred:", error);
  }
}


async function editEventType(event_type_id, new_event_type) {
  try {
    let url = `http://localhost:6969/admin/event?event_type_id=${event_type_id}`
    const response = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body : JSON.stringify({
        new_event_type : new_event_type,
      }),
      credentials: "include",
    });
    if (response.ok) {
      const data = await response.json();
      return data;
    } else {
      throw new Error("Network response was not ok.");
    }
  } catch (error) {
    console.error("An error occurred:", error);
  }
}

async function newReview(event_id, review) {
  try {
    let url = `http://localhost:6969/event/review?event_id=${event_id}`
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body : JSON.stringify({
        review : review,
      }),
      credentials: "include",
    });
    if (response.ok) {
      const data = await response.json();
      return data;
    } else {
      throw new Error("Network response was not ok.");
    }
  } catch (error) {
    console.error("An error occurred:", error);
  }
}

async function deleteReview(review_id) {
  try {
    let url = `http://localhost:6969/event/review?review_id=${review_id}`
    const response = await fetch(url, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });
    if (response.ok) {
      const data = await response.json();
      return data;
    } else {
      throw new Error("Network response was not ok.");
    }
  } catch (error) {
    console.error("An error occurred:", error);
  }
}

async function getNotifications() {
  try {
    let url = `http://localhost:6969/user/notifications`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });
    if (response.ok) {
      const data = await response.json();
      return data;
    } else {
      throw new Error("Network response was not ok.");
    }
  } catch (error) {
    console.error("An error occurred:", error);
  }
}

async function readNotification(notification_id) {
  try {
    let url = `http://localhost:6969/user/notifications?notification_id=${notification_id}`;

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });
    if (response.ok) {
      return response;
    } else {
      throw new Error("Network response was not ok.");
    }
  } catch (error) {
    console.error("An error occurred:", error);
  }
}

async function cancelEvent(event_id, cancel_reason) {
  try {
    let url = `http://localhost:6969/organizer/event/cancel?event_id=${event_id}`;
    console.log(cancel_reason)
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        cancel_reason : cancel_reason,
      }),
      credentials: "include",
    });
    if (response.ok) {
      return response;
    } else {
      throw new Error("Network response was not ok.");
    }
  } catch (error) {
    console.error("An error occurred:", error);
  }
}

export default {
  login,
  getEvents,
  register,
  joinOrganizers,
  getEventRegistrants,
  parseJwt,
  createEvent,
  joinEvent,
  leaveEvent,
  


  upvoteEvent,
  downvoteEvent,
  removeEventVote,
  newReview,
  deleteReview,
  getNotifications,
  readNotification,

  //organizer routes
  approveEventRegistration,
  rejectEventRegistration,
  cancelEvent,


  adminLogin,
  getOrganizers,
  toggleOrganizerStatus,
  getEventTypes,
  newEventType,
  deleteEventType,
  editEventType,

};