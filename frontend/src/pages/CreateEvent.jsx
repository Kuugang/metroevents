import { axiosFetch } from "../utils/axios";
import { useNavigate } from "react-router";
import { uploadImage, useFetchEventTypes } from "../utils/helper";
import { MyContext } from "../utils/Context";
import { useContext, useState } from "react";
import { toast } from "react-toastify";
import EventForm from "../components/EventForm";
import Spinner from "../components/Spinner";

export default function CreateEvent() {
  const { eventTypes, setEvents } = useContext(MyContext);
  const [isLoading, setIsLoading] = useState(false);
  useFetchEventTypes();

  const navigate = useNavigate();

  const [creatingPost] = useState(false);

  async function handleCreateEvent(e) {
    try {
      setIsLoading(true);
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

      if (response.status == 200) {
        const imageResponse = await fetch(inputs.image);
        const imageData = await imageResponse.text();
        toast.success("Event created");
        setIsLoading(false);
        response.data.result.image = imageData;
        setEvents((prevEvents) => [response.data.result, ...prevEvents]);
        navigate("/dashboard");
      }
    } catch (error) {
      toast.error(error.message);
      setIsLoading(false);
    }
  }

  return (
    <>
      {isLoading && <Spinner></Spinner>}
      <EventForm
        onSubmit={handleCreateEvent}
        eventTypes={eventTypes}
      ></EventForm>

      {creatingPost && <></>}
    </>
  );
}
