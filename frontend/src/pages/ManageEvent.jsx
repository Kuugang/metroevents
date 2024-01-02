import { useContext, useEffect, useState } from "react";
import { MyContext } from "../utils/Context";
import { useParams } from "react-router-dom";
import { uploadImage } from "../utils/helper";
import { axiosFetch } from "../utils/axios";
import { useNavigate } from "react-router-dom";
import EventForm from "../components/EventForm";
import CancelEventFormModal from "../components/CancelEventFormModal";
import Spinner from "../components/Spinner";
import { toast } from "react-toastify";

export default function ManageEvent() {
  const { events, setEvents, eventTypes } = useContext(MyContext);
  const { id } = useParams();
  const [cancelEventFormModalIsOpen, setCancelEventFormModalIsOpen] =
    useState(false);

  const [eventTitle, setEventTitle] = useState("");
  const [eventType, setEventType] = useState("");
  const [eventVenue, setEventVenue] = useState("");
  const [eventDescription, setEventDescription] = useState("");
  const [eventDateTime, setEventDateTime] = useState("");
  const [imagePreview, setImagePreview] = useState("");

  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const [currentEvent, setCurrentEvent] = useState("");
  useEffect(() => {
    if (events) {
      setCurrentEvent(events.find((e) => e.id == id));
    }
  }, [events]);

  async function handleEditEvent(e) {
    setIsLoading(true);
    try {
      const file = e.target.imgfile.files[0];

      let link;

      if (file) {
        link = await uploadImage(file);
      }

      const inputs = {
        title: e.target.title.value,
        description: e.target.description.value,
        venue: e.target.venue.value,
        type: e.target.type.value,
        datetime: new Date(e.target.datetime.value),
        image: link,
      };

      const data = await axiosFetch.put(
        `/organizer/event?event_id=${currentEvent.id}`,
        inputs
      );

      if (data.status !== 200) {
        throw new Error(data.data.message);
      }

      let newEvent = {
        title: inputs.title,
        description: inputs.description,
        venue: inputs.venue,
        type: inputs.type,
        datetime: e.target.datetime.value,
      };

      const response = await fetch(link);
      const imageData = await response.text();

      if (file) {
        newEvent = {
          ...newEvent,
          image: imageData,
        };
      }

      const updatedEvents = events.map((event) => {
        if (event.id === currentEvent.id) {
          return {
            ...event,
            ...newEvent,
          };
        }

        return event;
      });

      setEvents(updatedEvents);
      toast.success("Edited event");
      setIsLoading(false);
      navigate(`/event/${id}`);
    } catch (error) {
      toast.error(error.message);
      setIsLoading(false);
    }
  }

  async function handleCancelEvent(e) {
    e.preventDefault();
    const input = {
      cancel_reason: e.target.cancel_reason.value,
    };

    const data = await axiosFetch.post(
      `/organizer/event/cancel?event_id=${id}`,
      input
    );

    if (data.status !== 200) {
      throw new Error(data.data.message);
    }

    const updatedEvents = events.map((event) => {
      if (event.id === currentEvent.id) {
        return {
          ...event,
          is_cancelled: true,
          cancellation_reason: input.cancel_reason,
        };
      }

      return event;
    });

    setEvents(updatedEvents);

    navigate(`/event/${id}`);
  }

  function openCancelEventModal() {
    setCancelEventFormModalIsOpen(true);
  }

  function closeCancelEventFormModal() {
    setCancelEventFormModalIsOpen(false);
  }

  async function handleAcceptRegistrant(event, user_id) {
    event.target.disabled = true;
    const data = await axiosFetch.put(
      `/organizer/event/approve?event_id=${id}&user_id=${user_id}`
    );

    const participant = currentEvent.participants.find(
      (p) => p.user_id == user_id
    );
    participant.status = "accepted";

    setCurrentEvent({
      ...currentEvent,
      participants: currentEvent.participants.map((p) =>
        p.user_id !== participant.user_id ? p : participant
      ),
    });

    event.target.disabled = false;
  }

  async function handleRejectRegistrant(event, user_id) {
    event.target.disabled = true;
    const data = await axiosFetch.put(
      `/organizer/event/reject?event_id=${id}&user_id=${user_id}`
    );
    const participant = currentEvent.participants.find(
      (p) => p.user_id == user_id
    );
    participant.status = "rejected";
    setCurrentEvent({
      ...currentEvent,
      participants: currentEvent.participants.map((p) =>
        p.user_id !== participant.user_id ? p : participant
      ),
    });
    event.target.disabled = false;
  }

  return (
    <>
      {currentEvent && (
        <>
          {isLoading && <Spinner></Spinner>}
          <EventForm
            onSubmit={handleEditEvent}
            eventTypes={eventTypes}
            currentEvent={currentEvent}
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
          <CancelEventFormModal
            isOpen={cancelEventFormModalIsOpen}
            onClose={closeCancelEventFormModal}
            handleCancelEvent={handleCancelEvent}
          ></CancelEventFormModal>
          <div className="flex flex-col items-center mt-4 gap-2">
            <button
              onClick={openCancelEventModal}
              className="border p-2 rounded text-red-500 bg-red-500 text-white"
            >
              Cancel Event
            </button>
            <h1 className="text-4xl font-black text-center">
              Event Registrants
            </h1>
            <div
              id="participants"
              className="w-full border flex flex-col justify-center items-center"
            ></div>
          </div>

          {currentEvent.participants.map((participant) => {
            return (
              <div
                key={participant.id}
                className={`w-full p-2 flex flex-row justify-center gap-2 items-center ${
                  participant.status === "pending"
                    ? "bg-gray-100"
                    : participant.status === "accepted"
                    ? "bg-green-500"
                    : "bg-red-500"
                }`}
              >
                <h1 className="font-black">
                  {participant.firstname} {participant.lastname}
                </h1>
                <h1>{participant.username}</h1>

                <div>
                  <button
                    className="inline border border-red-500 bg-red-500 px-4 py-2 rounded text-white hover:text-red-500 hover:bg-white"
                    onClick={(event) =>
                      handleRejectRegistrant(event, participant.user_id)
                    }
                    disabled={participant.status === "rejected"}
                  >
                    Reject
                  </button>
                  <button
                    onClick={(event) =>
                      handleAcceptRegistrant(event, participant.user_id)
                    }
                    disabled={participant.status === "accepted"}
                    className="inline border border-green-500 bg-green-500 px-4 py-2 rounded text-white hover:text-green-500 hover:bg-white"
                  >
                    Accept
                  </button>
                </div>
              </div>
            );
          })}
        </>
      )}
    </>
  );
}
