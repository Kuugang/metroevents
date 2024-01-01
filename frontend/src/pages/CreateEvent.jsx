import { axiosFetch } from "../utils/axios";
import { useNavigate } from "react-router";
import { uploadImage, useFetchEventTypes } from "../utils/helper";
import { MyContext } from "../utils/Context";
import { useContext, useState } from "react";
import EventForm from "../components/EventForm";

export default function CreateEvent() {
  const { eventTypes, setEvents } = useContext(MyContext)
  useFetchEventTypes();

  const navigate = useNavigate();

  const [creatingPost] = useState(false);

  async function handleCreateEvent(e) {
    const file = e.target.imgfile.files[0];
    const link = await uploadImage(file);

    const inputs = {
      title: e.target.title.value,
      description: e.target.description.value,
      venue: e.target.venue.value,
      type: e.target.type.value,
      datetime: new Date(e.target.datetime.value),
      image: link,
    };

    const response = await axiosFetch.post("/organizer/createEvent", inputs);

    if (response.status === 200) {
      setEvents((prevEvents) => [response.data.result, ...prevEvents]);
      alert("Event created");
      navigate("/dashboard");
    }
  }

  return (
    <>
      <EventForm
        onSubmit={handleCreateEvent}
        eventTypes={eventTypes}
      ></EventForm>

      {creatingPost && <></>}
    </>
  );
}
