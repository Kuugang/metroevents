import { useContext, useEffect, useState } from "react";
import { MyContext } from "../utils/Context";
import { getUsers, getUserRequests, logout, getCookie } from "../utils/helper";
import { jwtDecode } from "jwt-decode";
import { axiosFetch } from "../utils/axios";
import { useNavigate } from "react-router-dom";

import EventTypes from "../components/admin/EventTypes";
import Users from "../components/admin/Users";
import OrganizerRequests from "../components/admin/OrganizerRequests";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [tab, setTab] = useState("Users");

  const [editModeMap, setEditModeMap] = useState({});
  const [editValues, setEditValues] = useState({});
  const [users, setUsers] = useState({});
  const [organizerRequests, setOrganizerRequests] = useState();

  const { eventTypes, setEventTypes } = useContext(MyContext);

  async function handleNewEventType(e) {
    e.preventDefault();

    const input = {
      event_type: e.target.event_type.value,
    };

    const data = await axiosFetch.post(`/admin/event`, input);

    if (data.status !== 200) {
      throw new Error(data.data.message);
    }
    e.target.event_type.value = "";
    setEventTypes((eventTypes) => [data.data, ...eventTypes]);
  }

  async function handleDeleteEventType(e) {
    e.preventDefault();
    const id = e.target.parentElement.parentElement.id;

    const data = await axiosFetch.delete(`/admin/event?event_type_id=${id}`);

    if (data.status !== 200) {
      throw new Error(data.data.message);
    }

    const newEventTypes = eventTypes.filter((et) => {
      return et.id != id;
    });

    setEventTypes(newEventTypes);
  }

  async function handleSaveNewEventType(id, event_name) {
    setEditValues((prevEditValues) => ({
      ...prevEditValues,
      [id]: event_name,
    }));

    setEditModeMap((prevState) => ({
      ...prevState,
      [id]: !prevState[id],
    }));

    const newType = editValues[id];

    const data = await axiosFetch.put(`/admin/event?event_type_id=${id}`, {
      new_event_type: newType,
    });

    if (data.status !== 200) {
      throw new Error(data.data.message);
    }

    const update = eventTypes.map((e) => {
      if (e.id === id) {
        return {
          ...e,
          event_name: newType,
        };
      }

      return e;
    });

    setEventTypes(update);
  }

  const handleEditEvent = (id, event_name) => {
    setEditValues((prevEditValues) => ({
      ...prevEditValues,
      [id]: event_name,
    }));

    setEditModeMap((prevState) => ({
      ...prevState,
      [id]: !prevState[id],
    }));
  };

  const handleInputEditEvent = (e, id) => {
    const updatedEditValues = { ...editValues };
    updatedEditValues[id] = e.target.value;
    setEditValues(updatedEditValues);
    setEditModeMap((prevState) => ({
      ...prevState,
      [id]: true,
    }));
  };

  async function handleUpdateUserPrivilege(e, user_id) {
    e.preventDefault();

    const input = {
      privilege: e.target.privilege.value,
    };
    const data = await axiosFetch.post(
      `/admin/users?user_id=${user_id}`,
      input
    );

    if (data.status !== 200) {
      return new Error(data.data.message);
    }

    const updatedUsers = users.map((u) => {
      if (u.id == user_id) {
        return {
          ...u,
          privilege: input.privilege,
        };
      }
      return u;
    });
    setUsers(updatedUsers);
    alert("updated user privilege");
  }

  async function handleAcceptOrganizerRequst(request) {
    const inputs = {
      user_id: request.user_id,
      request_id: request.id,
    };

    const data = await axiosFetch.post(
      "/admin/organizer/requests/accept",
      inputs
    );

    if (data.status !== 200) {
      return new Error(data.data.message);
    }
    const updatedOrganizerRequest = organizerRequests.filter((r) => {
      return r.id != request.id;
    });
    setOrganizerRequests(updatedOrganizerRequest);
    alert("Accepted Organizer Request");
  }

  async function handleRejectOrganizerRequest(request) {
    const inputs = {
      user_id: request.user_id,
      request_id: request.id,
    };

    const data = await axiosFetch.post(
      "/admin/organizer/requests/reject",
      inputs
    );

    if (data.status !== 200) {
      return new Error(data.data.message);
    }

    const updatedOrganizerRequest = organizerRequests.filter((r) => {
      return r.id != request.id;
    });

    setOrganizerRequests(updatedOrganizerRequest);
    alert("Rejected Organizer Request");
  }

  function setTabUsers() {
    setTab("Users");
  }

  function setTabOrganizerRequests() {
    setTab("Organizer Requests");
  }

  function setTabEventTypes() {
    setTab("Event Types");
  }

  useEffect(() => {
    try {
      if (jwtDecode(localStorage.getItem("token")).privilege !== "admin") {
        logout();
        navigate("/");
      }
    } catch (error) {
      logout();
      navigate("/");
    }
  }, [eventTypes]);

  useEffect(() => {
    if (users.length > 0) {
      getUserRequests().then((data) => {
        const orgRequests = data
          .filter((d) => {
            return d.type === 1;
          })
          .map((r) => {
            return {
              ...r,
              firstname: users.find((u) => u.id == r.user_id).firstname,
              lastname: users.find((u) => u.id == r.user_id).lastname,
              username: users.find((u) => u.id == r.user_id).username,
            };
          });
        setOrganizerRequests(orgRequests);
      });
    }
  }, [users]);

  useEffect(() => {
    getUsers().then((data) => {
      setUsers(data);
    });
  }, []);

  return (
    <div className="flex flex-col gap-2">
      <div className="justify-center flex flex-row">
        <button onClick={setTabUsers}>Users</button>
        <button onClick={setTabOrganizerRequests}>Organizer Requests</button>
        <button onClick={setTabEventTypes}>Event Types</button>
      </div>

      {tab == "Users" && (
        <Users
          users={users}
          handleUpdateUserPrivilege={handleUpdateUserPrivilege}
        ></Users>
      )}

      {tab == "Organizer Requests" && (
        <OrganizerRequests
          organizerRequests={organizerRequests}
          handleAcceptOrganizerRequst={handleAcceptOrganizerRequst}
          handleRejectOrganizerRequest={handleRejectOrganizerRequest}
        ></OrganizerRequests>
      )}

      {tab == "Event Types" && (
        <EventTypes
          handleNewEventType={handleNewEventType}
          handleInputEditEvent={handleInputEditEvent}
          handleSaveNewEventType={handleSaveNewEventType}
          handleDeleteEventType={handleDeleteEventType}
          handleEditEvent={handleEditEvent}
          editModeMap={editModeMap}
          editValues={editValues}
        ></EventTypes>
      )}
    </div>
  );
}
