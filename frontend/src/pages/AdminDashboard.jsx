import { useContext, useEffect, useState } from "react";
import { MyContext } from "../utils/Context";
import { getUsers, getUserRequests, logout, getCookie } from "../utils/helper";
import { jwtDecode } from "jwt-decode";
import { axiosFetch } from "../utils/axios";
import { useNavigate } from "react-router-dom";

import EventTypes from "../components/admin/EventTypes";
import Users from "../components/admin/Users";
import OrganizerRequests from "../components/admin/OrganizerRequests";
import { toast } from "react-toastify";
import Spinner from "../components/Spinner";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [tab, setTab] = useState("Users");
  const [editModeMap, setEditModeMap] = useState({});
  const [editValues, setEditValues] = useState({});
  const [users, setUsers] = useState({});
  const [organizerRequests, setOrganizerRequests] = useState();
  const [isLoading, setIsLoading] = useState(false);

  const { events, setEvents, eventTypes, setEventTypes } = useContext(MyContext);

  async function handleNewEventType(e) {
    setIsLoading(true);
    try {
      e.preventDefault();

      const input = {
        event_type: e.target.event_type.value,
      };

      const data = await axiosFetch.post(`/admin/event`, input);

      if (data.status !== 200) {
        throw new Error(data.data.message);
      }
      e.target.event_type.value = "";
      setIsLoading(false);
      toast.success("Created new event type");
      setEventTypes((eventTypes) => [data.data, ...eventTypes]);
    } catch (error) {
      toast.error(error.message);
      setIsLoading(false);
    }
  }

  async function handleDeleteEventType(id) {
    setIsLoading(true);
    try {
      const data = await axiosFetch.delete(`/admin/event?event_type_id=${id}`);

      if (data.status !== 200) {
        throw new Error(data.data.message);
      }

      const newEventTypes = eventTypes.filter((et) => {
        return et.id != id;
      });
      toast.success("Deleted event type");
      setIsLoading(false);
      setEventTypes(newEventTypes);

      const newEvents = events.filter((e) => {
        return e.event_type_id != id;
      })
      setEvents(newEvents)
    } catch (error) {
      toast.error(error.name);
      setIsLoading(false);
    }
  }

  async function handleSaveNewEventType(id, event_name) {
    setIsLoading(false);
    try {
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

      const update = eventTypes.map((e) => {
        if (e.id === id) {
          return {
            ...e,
            event_name: newType,
          };
        }

        return e;
      });

      toast.success("New event type saved");
      setIsLoading(false);
      setEventTypes(update);
      const newEvents = events.map((e) => {
        if(e.event_type_id == id){
          return{
            ...e,
            type: newType,
          }
        }
        return e;
      })

      console.log(newEvents)

      setEvents(newEvents)
    } catch (error) {
      toast.error(error.message);
      setIsLoading(false);
    }
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
    setIsLoading(true);
    try {
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
      toast.success("Updated user privilege");
      setIsLoading(false);
      setUsers(updatedUsers);
    } catch (error) {
      toast.error(error.message);
      setIsLoading(false);
    }
  }

  async function handleAcceptOrganizerRequst(request) {
    setIsLoading(true);
    try {
      const inputs = {
        user_id: request.user_id,
        request_id: request.id,
      };

      const data = await axiosFetch.post(
        "/admin/organizer/requests/accept",
        inputs
      );

      const updatedOrganizerRequest = organizerRequests.filter((r) => {
        return r.id != request.id;
      });

      const updatedUsers = users.map((u) => {
        if (request.user_id == u.id) {
          return {
            ...u,
            privilege: "organizer",
          };
        }
        return u;
      });

      setUsers(updatedUsers);
      setOrganizerRequests(updatedOrganizerRequest);
      toast.success("Accepted organizer request");
      setIsLoading(false);
    } catch (error) {
      toast.error(error.name);
      setIsLoading(false);
    }
  }

  async function handleRejectOrganizerRequest(request) {
    setIsLoading(true);
    try {
      const inputs = {
        user_id: request.user_id,
        request_id: request.id,
      };

      const data = await axiosFetch.post(
        "/admin/organizer/requests/reject",
        inputs
      );

      const updatedOrganizerRequest = organizerRequests.filter((r) => {
        return r.id != request.id;
      });

      setOrganizerRequests(updatedOrganizerRequest);

      toast.success("Rejected Organizer Request");
      setIsLoading(false);
    } catch (error) {
      toast.error(error.message);
      setIsLoading(false);
    }
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
    <>
      {isLoading && <Spinner></Spinner>}
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
    </>
  );
}
