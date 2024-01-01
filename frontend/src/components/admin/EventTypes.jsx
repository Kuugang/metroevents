import { useContext } from "react";
import { MyContext } from "../../utils/Context";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlusSquare as farPlusSquare } from "@fortawesome/free-regular-svg-icons";

export default function EventTypes({
  handleNewEventType,
  handleInputEditEvent,
  handleSaveNewEventType,
  handleDeleteEventType,
  handleEditEvent,
  editModeMap,
  editValues,
}) {
  const { eventTypes } = useContext(MyContext);
  return (
    <div className="flex flex-col items-center border border-black rounded px-6 py-2">
      <h1 className="font-bold mb-2 text-2xl">Event Types</h1>
      <form onSubmit={handleNewEventType}>
        <input
          name="event_type"
          type="text"
          className="border rounded p-2"
          placeholder="Add new event type"
        ></input>
        <button type="submit" className="text-green-500">
          <FontAwesomeIcon icon={farPlusSquare} />
        </button>
      </form>

      {eventTypes &&
        eventTypes.length > 0 &&
        eventTypes.map((et) => {
          const isEditing = editModeMap[et.id] || false;
          return (
            <div
              key={et.id}
              id={et.id}
              className="flex flex-row gap-2 border p-2 justify-between items-end"
            >
              {isEditing ? (
                <>
                  <input
                    value={
                      editModeMap[et.id]
                        ? editValues[et.id] || ""
                        : et.event_name
                    }
                    onChange={(e) => handleInputEditEvent(e, et.id)}
                  />
                  <div className="flex flex-row gap-2">
                    <button
                      onClick={() =>
                        handleSaveNewEventType(et.id, et.event_name)
                      }
                      className="text-green-500 z-20"
                    >
                      Save
                    </button>

                    <div className="flex flex-row gap-2">
                      <button
                        onClick={() => handleDeleteEventType(et.id)}
                        className="text-red-500"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <h1>{et.event_name}</h1>

                  <div className="flex flex-row gap-2">
                    <button
                      onClick={() => handleEditEvent(et.id, et.event_name)}
                      className="hover:text-white"
                    >
                      Edit
                    </button>

                    <div className="flex flex-row gap-2">
                      <button
                        onClick={() => handleDeleteEventType(et.id)}
                        className="hover:text-red-500"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          );
        })}
    </div>
  );
}
