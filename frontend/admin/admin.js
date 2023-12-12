import api from "../api/api.js";

function renderEventTypes(event_types, event_types_container) {
  event_types_container.innerHTML = "";
  for (const event of event_types) {
    const e = `
    <div id = "${event.id}" class = "flex flex-row gap-2 border p-2 justify-between items-end">
      <h1>${event.event_name}</h1>  

      <div class = "flex flex-row gap-2">
        <button class = "edit-event-type hover:text-blue-600">
          <i class="fa-solid fa-pen fa-lg"></i>
        </button>         

        <button class = "delete-event-type hover:text-red-600">
          <i class="fa-solid fa-trash-can fa-lg"></i>
        </button>
      </div>
    </div>
    `;
    event_types_container.innerHTML += e;
  }

    const edit_buttons = document.querySelectorAll(".edit-event-type");
    edit_buttons.forEach((button) => {
      button.addEventListener("click", function (e) {
        const edit_button = e.target.parentElement;
        const parent = e.target.parentElement.parentElement;
        const event_type_id = parent.parentElement.id;

        const submit_button = document.createElement("button");
        submit_button.innerHTML = '<i class="fa-solid fa-check fa-lg"></i>';

        edit_button.classList.add("hidden");

        parent.prepend(submit_button);

        let h1 = parent.parentElement.querySelector("h1");
        const currentEventName = h1.textContent;
        const inputElement = document.createElement("input");
        inputElement.classList.add("border", "border-black", "rounded");
        inputElement.value = currentEventName;
        parent.parentElement.replaceChild(inputElement, h1);

        submit_button.addEventListener("click", async function () {
          const new_event_type = inputElement.value;

          await api.editEventType(event_type_id, new_event_type);

          edit_button.classList.remove("hidden");
          parent.removeChild(submit_button);
          parent.parentElement.removeChild(inputElement);
          h1 = document.createElement("h1");
          h1.innerHTML = new_event_type;
          parent.parentElement.prepend(h1);
        });
      });
    });

    const delete_buttons = document.querySelectorAll(".delete-event-type");
    delete_buttons.forEach((button) => {
      button.addEventListener("click", async function (e) {
        const event_type_id =
          e.target.parentElement.parentElement.parentElement.id;
        console.log(event_type_id)
          await api.deleteEventType(event_type_id);
          event_types = await api.getEventTypes();
          renderEventTypes(event_types, event_types_container);
      });
    });
}

function renderOrganizers(organizers, container) {
  container.innerHTML = "";
  for (const organizer of organizers) {
    const e = `
          <div class = "flex flex-row gap-2 border p-2 justify-between items-end ${
            organizer.accepted == 1 ? "bg-green-400" : "bg-white"
          }">
            <div>
              <h1 class = "font-black text-xl inline">${organizer.firstName} ${
      organizer.lastName
    }</h1>
              <h1 class = "font-semibold text-sm inline">${
                organizer.username
              }</h1>
            </div>
            <div id = "control" class = "flex flex-row">
              ${
                organizer.accepted
                  ? `
                  <button id = "${organizer.user_id}" class = "border border-red-500 bg-red-500 px-4 py-2 rounded text-white hover:text-red-500 hover:bg-white">Revoke</button>
                  `
                  : `
                  <button id = ${organizer.user_id} class = "border border-green-500 bg-green-500 px-4 py-2 rounded text-white hover:text-green-500 hover:bg-white">Accept</button>
                  <button/>
                  `
              }

            </div>
          </div>
        `;
    container.innerHTML += e;
  }
}

document.addEventListener("DOMContentLoaded", async function () {
  const overlay = document.getElementById("overlay");
  const spinner = document.getElementById("spinner");

  if (window.location.pathname === "/admin/login.php") {
    const loginForm = document.querySelector("#loginForm");
    loginForm.addEventListener("submit", async function (event) {
      event.preventDefault();
      const result = await api.adminLogin();
      if (!result) alert("Login failed");
      else {
        localStorage.setItem("admin", JSON.stringify(result));
        location.href = "dashboard.php";
      }
    });
  }

  if (window.location.pathname === "/admin/dashboard.php") {
    try {
      api.parseJwt(document.cookie);
    } catch (e) {
      window.location.href = "login.php";
    }

    let organizers = await api.getOrganizers();
    let event_types = await api.getEventTypes();

    const logout_button = document.getElementById("logout-button");
    logout_button.addEventListener("click", function () {
      localStorage.removeItem("admin");
      document.cookie = "auth=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
      window.location.href = "login.php";
    });

    const organizer_container = document.getElementById("organizers");
    renderOrganizers(organizers, organizer_container);

    organizer_container.addEventListener("click", async function (e) {
      if (e.target.tagName === "BUTTON") {
        // spinner.classList.remove("hidden");
        // overlay.classList.remove("hidden");
        await api.toggleOrganizerStatus(e.target.id);
        // spinner.classList.add("hidden");
        // overlay.classList.add("hidden");
        organizers = await api.getOrganizers();
        renderOrganizers(organizers, organizer_container);
      }
    });

    const event_types_container = document.getElementById("event-types");
    renderEventTypes(event_types, event_types_container);

    const new_event_type_form = document.getElementById("new-event-type-form");

    new_event_type_form.addEventListener("submit", async function (e) {
      e.preventDefault();
      const new_event_type =
        new_event_type_form.querySelector("#new-event-type").value;

      await api.newEventType(new_event_type);
      event_types = await api.getEventTypes();
      renderEventTypes(event_types, event_types_container);
    });


  }
});
