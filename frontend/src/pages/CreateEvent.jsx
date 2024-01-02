import { axiosFetch } from "../utils/axios";
import { useNavigate } from "react-router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { uploadImage, useFetchEventTypes } from "../utils/helper";
import { MyContext } from "../utils/Context";
import { useContext, useState } from "react";
import { toast } from "react-toastify";
import EventForm from "../components/EventForm";
import Spinner from "../components/Spinner";
import { IoLocationOutline } from "react-icons/io5";
import { LuClock10 } from "react-icons/lu";

import {
  faThumbsUp as fasThumbsUp,
  faThumbsDown as fasThumbsDown,
} from "@fortawesome/free-solid-svg-icons";

export default function CreateEvent() {
  const { eventTypes, setEvents } = useContext(MyContext);

  const [eventTitle, setEventTitle] = useState("");
  const [eventType, setEventType] = useState("");
  const [eventVenue, setEventVenue] = useState("");
  const [eventDescription, setEventDescription] = useState("");
  const [eventDateTime, setEventDateTime] = useState("");
  const [imagePreview, setImagePreview] = useState("");

  const [isLoading, setIsLoading] = useState(false);

  useFetchEventTypes();

  const navigate = useNavigate();

  const [creatingPost] = useState(false);

  async function handleCreateEvent(e) {
    try {
      setIsLoading(true);
      const file = e.target.imgfile.files[0];
      console.log(file)
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
      <div className="w-full flex flex-row justify-around items-center border px-60">
        <div className="flex flex-row justify-around w-full">
          <div className="flex flex-col w-[80%]">
            <div className="relative h-[350px] mx-auto border rounded w-[350px]">
              {imagePreview && (
                <img
                  loading="lazy"
                  className="mx-auto h-full"
                  src={imagePreview}
                  alt=""
                />
              )}
            </div>

            <div className="w-full flex flex-col items-center gap-1">
              <h1 className="font-bold text-6xl">{eventTitle}</h1>
              <p className="font-semibold">a {eventType} event</p>

              <div className="flex flex-row gap-2 items-center text-base">
                <div className="flex flex-row gap-1 items-center">
                  <LuClock10 />
                  <p>{eventDateTime}</p>
                </div>
                <div className="flex flex-row gap-1 items-center">
                  <IoLocationOutline />
                  <p>{eventVenue}</p>
                </div>
              </div>

              <p>
                <p className="font-semibold">Hosted by You</p>
              </p>

              <div className="flex flex-col gap-2 items-center">
                <div className="flex flex-row gap-2">
                  <>
                    <FontAwesomeIcon
                      icon={fasThumbsUp}
                      className="cursor-pointer fa-2xl text-green-500"
                    />

                    <p>0</p>

                    <FontAwesomeIcon
                      icon={fasThumbsDown}
                      className="cursor-pointer fa-2xl text-red-500"
                    />
                    <p>0</p>
                  </>
                </div>

                <div className="text-sm text-center bg-[rgb(128,128,128)] rounded p-4">
                  <p>{eventDescription}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <EventForm
          onSubmit={handleCreateEvent}
          eventTypes={eventTypes}
          eventTitle={eventTitle}
          setEventTitle={setEventTitle}
          eventType={eventType}
          setEventType={setEventType}
          eventVenue={eventVenue}
          setEventVenue={setEventVenue}
          eventDescription={eventDescription}
          setEventDescription={setEventDescription}
          eventDateTime={eventDateTime}
          setEventDateTime={setEventDateTime}
          imagePreview={imagePreview}
          setImagePreview={setImagePreview}
        ></EventForm>
      </div>

      {creatingPost && <></>}
    </>
  );
}
