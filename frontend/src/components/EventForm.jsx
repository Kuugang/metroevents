import React, { useEffect, useState } from "react";

export default function EventForm({ onSubmit, eventTypes, currentEvent }) {
  const [eventTitle, setEventTitle] = useState("");
  const [eventType, setEventType] = useState("");
  const [eventVenue, setEventVenue] = useState("");
  const [eventDescription, setEventDescription] = useState("");
  const [eventDateTime, setEventDateTime] = useState("");

  useEffect(() => {
    if (currentEvent) {
      setEventTitle(currentEvent.title);
      setEventType(currentEvent.type);
      setEventVenue(currentEvent.venue);
      setEventDescription(currentEvent.description);

      const formattedDate = new Date(currentEvent.datetime);
      const year = formattedDate.getFullYear();
      const month = String(formattedDate.getMonth() + 1).padStart(2, "0");
      const day = String(formattedDate.getDate()).padStart(2, "0");
      const hours = String(formattedDate.getHours()).padStart(2, "0");
      const minutes = String(formattedDate.getMinutes()).padStart(2, "0");

      const formattedDateTime = `${year}-${month}-${day}T${hours}:${minutes}`;
      setEventDateTime(formattedDateTime);
    }
  }, [currentEvent]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(e);
  };

  return (
    <>
      {eventTypes && eventTypes.length > 0 ? (
        <form onSubmit={handleSubmit} className="mt-20" action="">
          <div className="w-full max-w-6xl mx-auto rounded-xl bg-white shadow-lg p-5 text-black border flex flex-col">
            <div className="w-full border">
              <input
                type="text"
                placeholder="Event name"
                name="title"
                value={eventTitle}
                onChange={(event) => setEventTitle(event.target.value)}
                required
              ></input>
              <select
                name="type"
                value={eventType}
                onChange={(event) => setEventType(event.target.value)}
                required
              >
                {eventTypes.map((eventType) => (
                  <option key={eventType.id} value={eventType.event_name}>
                    {eventType.event_name}
                  </option>
                ))}
              </select>
            </div>
            <input
              type="text"
              placeholder="Event venue"
              name="venue"
              value={eventVenue}
              onChange={(event) => setEventVenue(event.target.value)}
              required
            ></input>
            <textarea
              className="border rounded"
              name="description"
              cols="30"
              rows="10"
              value={eventDescription}
              onChange={(event) => setEventDescription(event.target.value)}
              required
            ></textarea>
            <input
              type="file"
              name="imgfile"
              accept="image/*"
              {...(currentEvent === undefined ? { required: true } : {})}
            ></input>
            <input
              type="datetime-local"
              name="datetime"
              value={eventDateTime}
              onChange={(event) => setEventDateTime(event.target.value)}
              required
            ></input>
            <button
              type="submit"
              className="p-2 bg-violet-700 text-white rounded border"
            >
              Submit
            </button>
          </div>
        </form>
      ) : (
        <h1>Loading</h1>
      )}
    </>
  );
}
