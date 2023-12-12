import api from "./api/api.js";
import checkAuth from "./checkAuth.js";

let userId;

try {
  userId = JSON.parse(localStorage.getItem("user")).id;
} catch (e) {}

document.addEventListener("DOMContentLoaded", async function () {
  const overlay = document.querySelector("#overlay");
  if (
    window.location.pathname != "/index.php" &&
    window.location.pathname != "/admin/login.php"
  ) {
    const authentication = checkAuth.checkAuthentication();
    if (!authentication) {
      window.location.href = "index.php";
    }
  }

  if (window.location.pathname == "/index.php") {
    if (checkAuth.checkAuthentication() === true)
      window.location.href = "dashboard.php";
    const loginForm = document.querySelector("#loginForm");
    loginForm.addEventListener("submit", async function (event) {
      event.preventDefault();
      const result = await api.login();
      if (!result) alert("Login failed");
      else {
        localStorage.setItem("user", JSON.stringify(result));
        location.href = "dashboard.php";
      }
    });

    const registerButton = document.getElementById("registerButton");
    registerButton.addEventListener("click", async function (event) {
      event.preventDefault();
      const registerForm = document.querySelector("#registerForm");
      registerForm.classList.remove("hidden");
      overlay.classList.remove("hidden");
      overlay.addEventListener("click", async function (event) {
        registerForm.classList.add("hidden");
        overlay.classList.add("hidden");
      });
    });

    const registerForm = document.querySelector("#registerForm");
    registerForm.addEventListener("submit", async function (event) {
      event.preventDefault();
      const response = await api.register();
      if (!response.ok) alert("Something went wrong");
      if (response.ok) alert("Registered successfully");
    });
  }

  if (window.location.pathname === "/dashboard.php") {
    function renderEvents(events, container) {
      for (const event of events) {
        const utcDateString = event.event_date;
        const utcDate = new Date(utcDateString);
        const localDate = utcDate.toLocaleString();

        const e = `
            <div id = "${
              event.id
            }" class = "border bg-gray-100 rounded flex flex-row justify-center mb-10 p-3 min-h-[100px] whitespace-normal">
                <div class = "w-[50%] flex flex-col items-center justify-center p-3">
                    <div class = "max-h-[500px] max-w-[900px]">
                        <img class = "w-full h-full rounded hover:scale-[101%] transition ease-in-out" src = "http://localhost:6969/${
                          event.image
                        }" alt = "Event Image">
                    </div>

                    <h1 class = "font-bold text-2xl mb-2">${event.title} </h1>
                    
                    <span class = "font-semibold text-base">${
                      event.event_type
                    } event</span>
                    ${
                      event.is_cancelled
                        ? `
                        <p class = "font-black text-red-600">Event cancelled</p>
                        <p class = "font-semibold text-red-600">${event.cancellation_reason}</p>
                        `
                        : `<p class = "font-bold text-xs mt-2 mb-2">Scheduled at: ${localDate}</p>`
                    }

                    <button id = "${
                      event.id
                    }" class = "p-2 border bg-[#5F2C72] text-white rounded hover">Learn More</button>
                </div>
            </div> 
            `;
        container.innerHTML += e;
      }
    }

    const authentication = checkAuth.checkAuthentication();
    if (!authentication) {
      window.location.href = "index.php";
    }

    const data = await api.getEvents(1);
    let events = data.events;
    renderEvents(events, document.getElementById("events-container"));

    let page = 1;
    document.addEventListener("scroll", async (e) => {
      var limit = Math.max(
        document.body.scrollHeight,
        document.body.offsetHeight,
        document.documentElement.clientHeight,
        document.documentElement.scrollHeight,
        document.documentElement.offsetHeight
      );

      if (window.scrollY + 2000 > limit) {
        page += 1;
        const data = await api.getEvents(page);
        renderEvents(data.events, document.getElementById("events-container"));
      }
    });

    document
      .querySelector("#events-container")
      .addEventListener("click", function (e) {
        if (e.target.tagName === "BUTTON") {
          const event = events.filter((event) => event.id == e.target.id);
          const eventId = event[0].id;
          window.location.href = `event.php?event_id=${eventId}`;
        }
      });
  }

  if (window.location.pathname == "/profile.php") {
    const userInfoDiv = document.getElementById("user");
    const userInfo = JSON.parse(localStorage.getItem("user"));
    const events = await api.getEvents(undefined, undefined, userInfo.id);

    const userProfile = `
      <h2 class = "font-bold text-xl">${userInfo.firstName} ${userInfo.lastName}</h2>
      <h1 class = "font-bold">${userInfo.username}</h1>
    `;
    userInfoDiv.innerHTML = userProfile;

    const joinButton = document.getElementById("joinOrganizers");
    if (!api.parseJwt(document.cookie).isOrganizer) {
      joinButton.classList.remove("hidden");
    }

    joinButton.addEventListener("click", function () {
      api.joinOrganizers();
    });

    // const notifications = await api.getNotifications();

    function renderEventActivity(events){
      console.log(events)

      for(const event of events){
        const utcDateString = event.event_date;
        const utcDate = new Date(utcDateString);
        const localDate = utcDate.toLocaleString();
        const statusClass = event.status === "accepted" ? "bg-green-400" : event.status === "pending" ? "bg-yellow-300" : event.status === "rejected" ? "bg-red-500" : "";

        const e = `
          <a href = "event.php?event_id=${event.id}" class = "flex flex-row ${statusClass} w-full justify-between">
            <h1 class = "font-black">${event.title}<h1>
            <h1 class = "font-semibold text-sm">${localDate}</h1>
          </a>
        ` 

        document.getElementById("registered-events").innerHTML += e;
      }
    }

    renderEventActivity(events);
  }

  if (window.location.pathname === "/event.php") {
    const urlParams = new URLSearchParams(window.location.search);
    const eventId = urlParams.get("event_id");
    let data = await api.getEvents(undefined, eventId);

    const participants = data.participants;
    const event = data.event[0];

    let participated = participants.filter(
      (participant) => participant.id === userId
    );

    let isHost = userId === event.organizer_id;
    let accepted;
    let pending = false;

    if (participated.length != 0) {
      if (participated[0].status === "accepted") accepted = true;
      if (participated[0].status === "rejected") accepted = false;
      if (participated[0].status === "pending") pending = true;
    }

    const event_container = document.getElementById("event-container");
    const utcDate = new Date(event.event_date);
    const localTimeZoneOffset = utcDate.getTimezoneOffset();
    const localTime = new Date(
      utcDate.getTime() - localTimeZoneOffset * 60 * 1000
    ).toLocaleString();

    function renderEvent(data, pending, accepted, event_container) {
      const event = data.event[0];

      const participants = data.participants.filter(
        (p) => p.id !== event.organizer_id
      );

      const host = data.participants.find(
        (participant) => (participant.id = event.organizer_id)
      );

      const reviews = data.reviews;
      const votes = data.votes;
      const hasVoted = Boolean(votes.find((vote) => vote.user_id === userId));

      event_container.innerHTML = " ";
      const div = `
            <div class = "relative w-[50%] h-[350px] mx-auto z-10">
                <img class = "mx-auto w-content h-full" src="http://localhost:6969/${
                  event.image
                }" alt="" />
            </div>

            <div class = "w-full flex flex-col items-center gap-2">
            <h1 class = "font-bold text-6xl">${event.title}</h1>

            <p class = "font-semibold">${localTime}</p>

            <div class = "font-semibold">
              <i class="fa-solid fa-location-dot fa-xl text-red-500"></i>
              ${event.venue} 
            </div>

            <p class = "font-semibold">${event.event_type} event</p>
            
            ${
              Boolean(userId !== host.id)
              ?
                `<p class = "font-semibold">Hosted by ${host.firstName} ${host.lastName}</p>`
              :
                event.is_cancelled 
                ?
                  `<p class = "font-semibold text-red-500">Event cancelled</p>`
                :
                  ``
            }

            <div class = "flex flex-row gap-2 justify-center">
              ${
                hasVoted
                  ? Boolean(
                      votes.find(
                        (vote) => vote.user_id === userId && vote.vote === 1
                      )
                    )
                    ? `
                  <button id = "remove-vote">
                    <i class="fa-solid fa-thumbs-up fa-2xl text-green-500"></i>
                  </button>
                  ${event.upvote}
                  <button id = "downvote-button">
                    <i class="fa-regular fa-thumbs-down fa-2xl text-red-500"></i>
                  </buton>
                  ${event.downvote}`
                    : `<button id="upvote-button">
                    <i class="fa-regular fa-thumbs-up fa-2xl text-green-500"></i>
                  </button>
                  ${event.upvote}
                  <button id = "remove-vote">
                    <i class="fa-solid fa-thumbs-down fa-2xl text-red-500"></i>
                  </buton>
                  ${event.downvote}`
                  : `<button id="upvote-button">
                  <i class="fa-regular fa-thumbs-up fa-2xl text-green-500"></i>
                </button>
                ${event.upvote}
                <button id = "downvote-button">
                  <i class="fa-regular fa-thumbs-down fa-2xl text-red-500"></i>
                </buton>
                ${event.downvote}`
              }
            </div>
            ${
              isHost
                ?
                `<button id = "manage-event" class = "border border-green-500 bg-green-500 px-4 py-2 rounded text-white hover:text-green-500 hover:bg-white">Manage Event</button>`
                : (event.is_cancelled == 1)
                  ?
                  `<div class = "flex flex-col items-center">
                    <p class = "font-black text-red-500 text-lg">Event Cancelled</p>
                    <p class = "font-normal text-red-500 text-lg">${event.cancellation_reason}</p>
                  </div>`
                    : pending
                      ? 
                      `<p class = "font-semibold">Your event registration request is pending</p>
                      <button id = "leave-event" class = "border border-red-500 bg-red-500 px-4 py-2 rounded text-white hover:text-red-500 hover:bg-white">Revoke Registration</button>`
                      : accepted
                        ? 
                          `<p class = "text-green-500 font-semibold">Your registration was accepted by the event host! See you soon!<p>
                          <button id = "leave-event" class = "border border-red-500 bg-red-500 px-4 py-2 rounded text-white hover:text-red-500 hover:bg-white">Revoke Registration</button>`
                        : accepted === false
                          ? 
                          `<p class = "text-red-500 font-semibold">Your registration was rejected by the event host</p>`
                          : 
                          `<button id = "join-event" class = "border border-blue-500 bg-blue-500 px-4 py-2 rounded text-white hover:text-blue-500 hover:bg-white">Register</button>`
            }
            
            </div>

            <div class = "mt-4 bg-gray-100 p-4">
                <p>${event.description}</p>
            </div>
            <h1 class = "font-black text-lg mt-5">Participants<h1>

            <div id = "participants" class = "flex flex-col items-center border w-full"> 

            </div>

            ${
              Boolean(reviews.length > 0)
                ? `
              <h1 class = "font-black text-2xl">Reviews</h1>
              <div id = "reviews">
              
              </div>
              `
                : ""
            }
            `;
      event_container.innerHTML += div;

      const participants_container = document.getElementById("participants");

      participants.forEach((participant) => {
        const e = `
        <div class = "flex flex-row gap-2 items-end p-5">
          <h1 class = "font-bold">${participant.firstName}</h1>
          <h1 class = "font-bold">${participant.lastName}</h1>
          <h1 class = "font-semibold text-sm">${participant.username}</h1>
        </div>
        `;
        participants_container.innerHTML += e;
      });

      const reviews_container = document.getElementById("reviews");
      reviews.forEach((review) => {
        const e = `
          <div id = "${
            review.id
          } "class = "relative border border-black rounded bg-gray-100">
            ${
              review.user_id === userId
                ? `<button class = "delete-review absolute top-1 right-1 text-red-500">
                <i class="fa-solid fa-trash-can fa-lg"></i>
              </button>`
                : ""
            }
            <h1 class = "font-bold inline">${review.firstName} ${
          review.lastName
        }</h1>
            <h1 class = "font-semibold text-sm inline"> ${review.username}</h1>
            <p>${review.review}</p>
          <div>
        `;
        reviews_container.innerHTML += e;
      });

      let join_button;
      let leave_button;
      let manage_event_button;
      let upvote_button;
      let downvote_button;
      let remove_vote_button;

      manage_event_button = document.getElementById("manage-event");
      join_button = document.getElementById("join-event");
      leave_button = document.getElementById("leave-event");

      upvote_button = document.getElementById("upvote-button");
      downvote_button = document.getElementById("downvote-button");
      remove_vote_button = document.getElementById("remove-vote");

      if (upvote_button) {
        upvote_button.addEventListener("click", async function (e) {
          await api.upvoteEvent(event.id);
          const data = await api.getEvents(undefined, eventId);
          renderEvent(data, pending, accepted, event_container);
        });
      }

      if (downvote_button) {
        downvote_button.addEventListener("click", async function (e) {
          await api.downvoteEvent(event.id);
          const data = await api.getEvents(undefined, eventId);
          renderEvent(data, pending, accepted, event_container);
        });
      }

      if (remove_vote_button) {
        remove_vote_button.addEventListener("click", async function () {
          await api.removeEventVote(event.id);
          const data = await api.getEvents(undefined, eventId);
          renderEvent(data, pending, accepted, event_container);
        });
      }

      if (manage_event_button) {
        manage_event_button.addEventListener("click", function (e) {
          window.location.href = `manageEvent.php?event_id=${event.id}`;
        });
      }

      if (join_button) {
        join_button.addEventListener("click", async function (e) {
          e.preventDefault();
          await api.joinEvent(event.id).then((result) => {
            if (result.status === 200) {
              pending = true;
              renderEvent(data, pending, accepted, event_container);
            }
          });
        });
      }

      if (leave_button) {
        const confirmation = `<div class = "z-50 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center bg-white rounded p-5">
					<h1 class = "font-bold text-xl mb-2">Are you sure about that?</h1>			
          <div class = "flex flex-row gap-4">
            <button id = "yesButton" class = "inline border border-blue-500 bg-blue-500 px-4 py-2 rounded text-white hover:text-blue-500 hover:bg-white">Yes</button>
            <button id = "noButton" class = "inline border border-blue-500 bg-blue-500 px-4 py-2 rounded text-white hover:text-blue-500 hover:bg-white">No</button>
          </div>
				</div>	
				`;

        leave_button.addEventListener("click", async function (e) {
          const overlay = document.querySelector("#overlay");
          overlay.classList.remove("hidden");
          overlay.innerHTML = confirmation;

          const yesButton = document.getElementById("yesButton");
          const noButton = document.getElementById("noButton");

          overlay.addEventListener("click", async function (event) {
            if (event.target === this) {
              overlay.classList.add("hidden");
            }
          });
          noButton.addEventListener("click", function () {
            overlay.classList.add("hidden");
          });

          yesButton.addEventListener("click", async function () {
            await api.leaveEvent(event.id).then((result) => {
              if (result.status === 200) {
                accepted = undefined;
                pending = false;
                overlay.classList.add("hidden");
                renderEvent(data, pending, accepted, event_container);
              }
            });
          });
        });
      }

      const delete_review_buttons = document.querySelectorAll(".delete-review");
      delete_review_buttons.forEach((button) => {
        button.addEventListener("click", async function (e) {
          const review_id = e.target.parentElement.parentElement.id;
          await api.deleteReview(review_id);
          data = await api.getEvents(undefined, eventId);
          renderEvent(data, pending, accepted, event_container);
        });
      });
    }

    renderEvent(data, pending, accepted, event_container);
    const review_form = document.getElementById("new-review-form");
    if (review_form) {
      review_form.addEventListener("submit", async function (e) {
        e.preventDefault();
        const review = document.getElementById("new-review-input").value;
        await api.newReview(eventId, review);

        data = await api.getEvents(undefined, eventId);
        renderEvent(data, pending, accepted, event_container);
      });
    }
  }

  if (window.location.pathname === "/manageEvent.php") {
    if (!api.parseJwt(document.cookie).isOrganizer) {
      window.location.href = "dashboard.php";
    }
    function renderParticipants(container, participants) {
      container.innerHTML = "";

      for (const participant of participants) {
        const e = `
        <div id = "${
          participant.id
        }" class = "w-full p-2 flex flex-row justify-center gap-2 items-center ${
          participant.status === "accepted" ? "bg-green-500" : "bg-red-500"
        }">
          <h1 class = "font-black">${participant.firstName}   ${
          participant.lastName
        }</h1>
        
          ${
            Boolean(participant.status === "accepted")
              ? `<button disabled class = "inline border border-green-500 bg-green-200 px-4 py-2 rounded text-white hover:text-green-200 hover:bg-white">Accept</button>
              <button id = "reject-registrant" class = "inline border border-red-500 bg-red-500 px-4 py-2 rounded text-white hover:text-red-500 hover:bg-white">Revoke</button>`
              : `<button id = "accept-registrant" class = "inline border border-green-500 bg-green-500 px-4 py-2 rounded text-white hover:text-green-500 hover:bg-white">Accept</button>
              <button disabled class = "inline border border-red-200 bg-red-200 px-4 py-2 rounded text-white hover:text-red-200 hover:bg-white">Revoke</button>`
          }
        </div>
        `;
        container.innerHTML += e;
      }

      if (participants.length > 0) {
        const accept_button = document.getElementById("accept-registrant");
        const reject_button = document.getElementById("reject-registrant");
        if (accept_button) {
          accept_button.addEventListener("click", async function (e) {
            const user_id = e.target.parentElement.id;
            const result = await api.approveEventRegistration(
              event.id,
              user_id
            );
            for (const p of participants) {
              if (p.id == user_id) {
                p.status = result.status;
              }
              renderParticipants(container, participants);
            }
          });
        }

        if (reject_button) {
          reject_button.addEventListener("click", async function (e) {
            const user_id = e.target.parentElement.id;
            const result = await api.rejectEventRegistration(event.id, user_id);
            for (const p of participants) {
              if (p.id == user_id) {
                p.status = result.status;
              }
              renderParticipants(container, participants);
            }
          });
        }
      }
    }

    const urlParams = new URLSearchParams(window.location.search);
    const eventId = urlParams.get("event_id");
    const data = await api.getEvents(undefined, eventId);
    let participants = data.participants;
    participants = participants.filter(
      (participant) => participant.id !== userId
    );

    const event = data.event[0];

    const participantsContainer = document.getElementById("participants");
    const submitButton = document.getElementById("event-submit-button");
    submitButton.textContent = "Update Event";
    const eventTitleInput = document.getElementById("eventTitleInput");
    const eventTypeInput = document.getElementById("eventTypeInput");
    const eventVenueInput = document.getElementById("eventVenueInput");
    const eventDescriptionInput = document.getElementById(
      "eventDescriptionInput"
    );
    const eventDateInput = document.getElementById("eventDateInput");

    eventTitleInput.value = event.title;
    eventTypeInput.value = event.event_type;
    eventDescriptionInput.value = event.description;
    eventVenueInput.value = event.venue;
    const date = new Date(event.event_date);
    const formattedDate = date.toISOString().split("T")[0]; // YYYY-MM-DD
    const time = date.toISOString().split("T")[1].split(".")[0]; // HH:MM:SS

    eventDateInput.value = `${formattedDate} ${time}`;

    renderParticipants(participantsContainer, participants);

    let cancel_event_button = document.getElementById("cancel-event");

    cancel_event_button.addEventListener("click", async function () {
      const form = `
      <form id = "cancel-event" class = "w-[40%] z-50 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center bg-white rounded p-5 gap-2">
        <textarea id="cancel-reason" class = "w-full border border-black p-2" cols="30" rows="10" placeholder = "Enter cancellation reason"></textarea>
        <button type = "submit" class = "border border-red-500 bg-red-500 px-4 py-2 rounded text-white hover:text-red-500 hover:bg-white">Cancel Event</button>
      </form>  
      `;

      overlay.classList.remove("hidden");
      overlay.innerHTML += form;
      overlay.addEventListener("click", async function (event) {
        if (event.target === this) {
          overlay.classList.add("hidden");
        }
      });
      document
        .getElementById("cancel-event")
        .addEventListener("submit", async function (e) {
          e.preventDefault();
          const cancel_reason = document.getElementById("cancel-reason").value;
          await api.cancelEvent(event.id, cancel_reason);
          window.location.href = `/event.php?event_id=${event.id}`;
        });
    });
  }

  if (window.location.pathname === "/createEvent.php") {
    const event_types = await api.getEventTypes();
    const eventTypeInput = document.getElementById("eventTypeInput")

    event_types.forEach((eventType) => {
      const option = document.createElement("option");
      option.value = eventType.event_name;
      option.textContent = eventType.event_name;
      eventTypeInput.appendChild(option);
    });

    const createEventForm = document.querySelector("#createEventForm");
    createEventForm.addEventListener("submit", async function (e) {
      e.preventDefault();
      const title = document.querySelector("#eventTitleInput").value;
      const description = document.querySelector(
        "#eventDescriptionInput"
      ).value;
      const event_type = document.querySelector("#eventTypeInput").value;
      const venue = document.querySelector("#eventVenueInput").value;
      const image = document.querySelector("#eventFileInput").files[0];
      const date = document.querySelector("#eventDateInput").value;
      const result = await api.createEvent(
        title,
        description,
        venue,
        event_type,
        image,
        date
      );
      if (result) alert("Event created successfully");
      window.location.href = "dashboard.php";
    });
  }
});
