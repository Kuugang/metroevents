import { useContext, useEffect, useState } from "react";
import { MyContext } from "../utils/Context";
import { axiosFetch } from "../utils/axios";
import RequestOrganizerModal from "../components/RequestOrganizerModal";
import { getUserEvents, getUser } from "../utils/helper";
import { Link, useParams } from "react-router-dom";
import { CgProfile } from "react-icons/cg";
import { toast } from "react-toastify";
import Spinner from "../components/Spinner";

export default function Profile() {
  const { username } = useParams();
  const { isLoggedIn, userData, setUserData, events, setEvents } =
    useContext(MyContext);
  const [currentUser, setCurrentUser] = useState(null);
  const [userEvents, setUserEvents] = useState(null);
  const [tab, setTab] = useState("Joined Events");
  const [isLoading, setIsLoading] = useState(false);

  const [requestOrganizerModalIsOpen, setRequestOrganizerModalIsOpen] =
    useState(false);

  function openRequestOrganizerModal() {
    setRequestOrganizerModalIsOpen(true);
  }

  function closeRequestOrganizerModal() {
    setRequestOrganizerModalIsOpen(false);
  }

  async function handleJoinOrganizerRequest(e) {
    try {
      e.preventDefault();
      setIsLoading(true);

      const data = await axiosFetch.post("/user/joinOrganizers", {
        message: e.target.message.value,
      });

      if (data.status !== 200) {
        throw new Error(data.data.message);
      }
      const updatedUserData = { ...userData };
      updatedUserData.requests.unshift(data.data);
      setUserData(updatedUserData);
      toast.success("Organizer request pending");
      setIsLoading(false);
      closeRequestOrganizerModal();
    } catch (error) {
      toast.error(error.message);
      setIsLoading(false);
      closeRequestOrganizerModal();
    }
  }

  function changeTab(tab) {
    setTab(tab);
  }

  useEffect(() => {
    if (currentUser != null) {
      getUserEvents(currentUser.id).then((data) => {
        setUserEvents(data);

        let uniqueNewEvents = data;
        let combinedEvents;

        if (events.length > 0) {
          uniqueNewEvents = data.filter(
            (newEvent) =>
              !events.some((existingEvent) => existingEvent.id === newEvent.id)
          );
        }
        combinedEvents = [...events, ...uniqueNewEvents];

        combinedEvents.sort((a, b) => a.id - b.id);
        setEvents(combinedEvents);
      });
    }
  }, [currentUser]);

  useEffect(() => {
    getUser(username).then((data) => {
      setCurrentUser(data);
    });
  }, []);

  return (
    <>
      {isLoading && (
        <Spinner></Spinner>
      )}
      <div className="mx-auto flex flex-row items-center justify-center gap-2 mb-4">
        {currentUser && (
          <>
            <button onClick={() => changeTab("Joined Events")}>
              Joined Events
            </button>
            <button onClick={() => changeTab("Reviews")}>Reviews</button>
            <>
              {(currentUser.privilege == "admin" ||
                currentUser.privilege == "organizer") && (
                <button onClick={() => changeTab("Hosted Events")}>
                  Hosted Events
                </button>
              )}
            </>
          </>
        )}
      </div>

      <div className="flex flex-row gap-2 px-64">
        <div className="w-[60%]">
          {tab == "Joined Events" && (
            <>
              {userEvents &&
              userEvents.filter((e) => {
                return e.organizer_id != currentUser.id;
              }).length > 0 ? (
                <div className="flex flex-col gap-2">
                  {userEvents
                    .filter((e) => {
                      return e.organizer_id != currentUser.id;
                    })
                    .map((e) => {
                      return (
                        <Link
                          className="flex flex-col justify-center items-center w-full px-4 py-2 bg-[#808080] shadow-2xl border-[black] rounded"
                          to={`/event/${e.id}`}
                          key={e.id}
                          id={e.id}
                        >
                          <div>
                            <img
                              src={e.image}
                              alt="Event Image"
                              className="h-[300px] rounded"
                            />
                          </div>
                          <h1 className="text-md">{e.title}</h1>
                          <h1 className="text-xs mb-4">{e.type} event</h1>
                          <p className="truncate text-xs overflow-x-hidden">
                            {e.description}
                          </p>
                        </Link>
                      );
                    })}
                </div>
              ) : (
                <p>Nothing here yet</p>
              )}
            </>
          )}

          {tab == "Reviews" && (
            <>
              {currentUser.reviews && currentUser.reviews.length > 0 ? (
                <div className="flex flex-col gap-2">
                  {currentUser.reviews.map((r) => {
                    return (
                      <Link
                        className="flex flex-col justify-center items-center w-full px-4 py-2 bg-[#808080] shadow-2xl border-[black] rounded"
                        to={`/event/${r.event_id}`}
                        key={r.id}
                        id={r.id}
                      >
                        <p>{r.review}</p>
                      </Link>
                    );
                  })}
                </div>
              ) : (
                <p>Nothing here yet</p>
              )}
            </>
          )}

          {tab == "Hosted Events" && (
            <>
              {currentUser.hostedEvents &&
              currentUser.hostedEvents.length > 0 ? (
                <div className="flex flex-col gap-2">
                  {userEvents
                    .filter((e) => {
                      return e.organizer_id == currentUser.id;
                    })
                    .map((e) => {
                      return (
                        <Link
                          className="flex flex-col justify-center items-center w-full px-4 py-2 bg-[#808080] shadow-2xl border-[black] rounded"
                          to={`/event/${e.id}`}
                          key={e.id}
                          id={e.id}
                        >
                          <div>
                            <img
                              src={e.image}
                              alt="Event Image"
                              className="h-[300px] rounded"
                            />
                          </div>
                          <h1 className="text-md">{e.title}</h1>
                          <h1 className="text-xs mb-4">{e.type} event</h1>
                          <p className="truncate text-xs overflow-x-hidden">
                            {e.description}
                          </p>
                        </Link>
                      );
                    })}
                </div>
              ) : (
                <p>Nothing here yet</p>
              )}
            </>
          )}
        </div>

        <div className="w-[30%]">
          {currentUser && (
            <div className="border p-6 rounded">
              <div className="flex flex-row mb-4">
                <div>
                  <CgProfile className="text-6xl" />
                  <hr />
                  <div className="flex flex-row gap-2 text-md font-bold">
                    <h1>{currentUser.firstname}</h1>
                    <h1>{currentUser.lastname}</h1>
                  </div>
                  <h1 className="text-base font-semibold">
                    u/{currentUser.username}
                  </h1>
                  <p className="text-xs font-light">
                    Lorem ipsum, dolor sit amet consectetur adipisicing elit.
                    Harum est optio a incidunt praesentium natus blanditiis?
                    Temporibus voluptatem natus inventore?
                  </p>
                </div>
              </div>

              {isLoggedIn == true &&
                userData.id == currentUser.id &&
                userData.privilege == "user" && (
                  <>
                    {Boolean(
                      userData.requests.find((r) => r.type == 1) == undefined
                    ) ? (
                      <>
                        <button onClick={openRequestOrganizerModal}>
                          Request to be an Organizer
                        </button>

                        <RequestOrganizerModal
                          isOpen={requestOrganizerModalIsOpen}
                          onClose={closeRequestOrganizerModal}
                          handleJoinOrganizerRequest={
                            handleJoinOrganizerRequest
                          }
                        ></RequestOrganizerModal>
                      </>
                    ) : (
                      <>
                        <p>Organizer request pending</p>
                      </>
                    )}
                  </>
                )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
