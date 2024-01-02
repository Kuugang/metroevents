import { useEffect, useState, useContext } from "react";
import { MyContext } from "../utils/Context";
import { useNavigate, useParams } from "react-router";
import { Link } from "react-router-dom";
import { getEventById, joinEvent, leaveEvent } from "../utils/helper";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { toast } from "react-toastify";
import { IoLocationOutline } from "react-icons/io5";
import { LuClock10 } from "react-icons/lu";

import {
  faThumbsUp as farThumbsUp,
  faThumbsDown as farThumbsDown,
  faTrashCan as farTrashCan,
  faEdit as farEdit,
  faClock as farClock,
} from "@fortawesome/free-regular-svg-icons";
import {
  faThumbsUp as fasThumbsUp,
  faThumbsDown as fasThumbsDown,
} from "@fortawesome/free-solid-svg-icons";
import { axiosFetch } from "../utils/axios";
import EditReview from "../components/EditReview";
import Spinner from "../components/Spinner";

export default function EventDetails() {
  const { userData, events, privilege } = useContext(MyContext);

  const navigate = useNavigate();
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [participants, setParticipants] = useState(null);
  const [vote, setVote] = useState("");
  const [upVotes, setUpVotes] = useState(0);
  const [downVotes, setDownVotes] = useState(0);
  const [eventJoinStatus, setEventJoinStatus] = useState("");
  const [reviews, setReviews] = useState(null);
  const [editReviewIsOpen, setEditReviewIsOpen] = useState(false);
  const [currentReview, setCurrentReview] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  function updateUpvotes(array) {
    setUpVotes(array.filter((v) => v.vote == true).length);
  }

  function updateDownVotes(array) {
    setDownVotes(array.filter((v) => v.vote == false).length);
  }

  async function handleUpVote(e) {
    setVote("upvote");
    e.target.classList.add("disabled");
    const data = (await axiosFetch.post(`/event/upvote?event_id=${id}`)).data;
    updateUpvotes(data);
    updateDownVotes(data);
  }

  async function handleDownVote(e) {
    setVote("downvote");
    e.target.classList.add("disabled");
    const data = (await axiosFetch.post(`/event/downvote?event_id=${id}`)).data;
    updateUpvotes(data);
    updateDownVotes(data);
  }

  async function handleRemoveVote(e) {
    setVote("");
    e.target.classList.add("disabled");
    const data = (await axiosFetch.post(`/event/removevote?event_id=${id}`))
      .data;
    updateUpvotes(data);
    updateDownVotes(data);
  }

  function updateEventJoinStatus(array) {
    const data = array.find((d) => {
      return d.id === JSON.parse(localStorage.getItem("userDetails")).id;
    });
    if (data === undefined) return;
    setEventJoinStatus(data.status);
  }

  async function handleJoinEvent() {
    setIsLoading(true);
    joinEvent(id)
      .then((data) => {
        setEventJoinStatus("pending");
        data.firstname = userData.firstname;
        data.lastname = userData.lastname;
        data.username = userData.username;
        setParticipants((participants) => [...participants, data]);
        toast.success("Registered for event");
        setIsLoading(false);
      })
      .catch((error) => {
        toast.error(error.message);
        setIsLoading(false);
      });
  }

  async function handleLeaveEvent() {
    setIsLoading(true);
    leaveEvent(id)
      .then((data) => {
        setEventJoinStatus("");
        setParticipants(participants.filter((p) => p.user_id !== userData.id));
        toast.success("Left event");
        setIsLoading(false);
      })
      .catch((error) => {
        toast.error(error.message);
        setIsLoading(false);
      });
  }

  async function handleReview(e) {
    e.preventDefault();
    setIsLoading(true);
    try {
      let inputs = {
        review: e.target.review.value,
      };

      const data = await axiosFetch.post(
        `/event/review?event_id=${id}`,
        inputs
      );

      if (data.status !== 200) {
        throw new Error(data.data.message);
      }

      if (data.status === 200) {
        e.target.reset();
        setReviews((reviews) => [data.data, ...reviews]);
        toast.success("Reviewed event");
        setIsLoading(false);
      }
    } catch (error) {
      toast.error(error.message);
      setIsLoading(false);
    }
  }

  function openEditReviewModal(review) {
    setCurrentReview(review);
    setEditReviewIsOpen(true);
  }

  function closeEditReviewModal() {
    setEditReviewIsOpen(false);
  }

  async function handleDeleteReview(review) {
    setIsLoading(true);

    try {
      const review_id = review.id;

      const data = await axiosFetch.delete(
        `/event/review?review_id=${review_id}`
      );

      if (data.status !== 200) {
        throw new Error(data.data.message);
      }

      if (data.status === 200) {
        let newReviews = reviews.filter((review) => review.id != review_id);
        setReviews(newReviews);
        toast.success("Deleted review");
        setIsLoading(false);
      }
    } catch (error) {
      toast.error(error.message);
      setIsLoading(false);
    }
  }

  async function handleEditReview(e) {
    e.preventDefault();
    setIsLoading(true);
    try {
      const inputs = {
        review: e.target.review.value,
      };

      const data = await axiosFetch.put(
        `/event/review?review_id=${currentReview.id}`,
        inputs
      );

      if (data.status !== 200) {
        throw new Error(data.data.message);
      }

      const updatedReviews = reviews.map((review) => {
        if (review.id == currentReview.id) {
          return {
            ...review,
            review: inputs.review,
          };
        }
        return review;
      });

      setReviews(updatedReviews);
      setEditReviewIsOpen(false);
      toast.success("Edited review");
      setIsLoading(false);
    } catch (error) {
      toast.error(error.message);
      setIsLoading(false);
    }
  }

  useEffect(() => {
    let e;
    if (events.length >= 0) {
      getEventById(id)
        .then((data) => {
          setEvent(data.event);
          setParticipants(data.participants);
          setReviews(data.reviews.reverse());
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      e = events.find((e) => e.id == id);
      setEvent(e);
      setParticipants(e.participants);
      setReviews(e.reviews.reverse());
    }
  }, []);

  useEffect(() => {
    if (event === undefined) {
      alert("Event not found");
      navigate("/dashboard");
    }

    if (event) {
      const userVote = event.votes.find(
        (v) => v.user_id == JSON.parse(localStorage.getItem("userDetails")).id
      );
      if (userVote) {
        setVote(Boolean(userVote.vote) === true ? "upvote" : "downvote");
      }
      updateUpvotes(event.votes);
      updateDownVotes(event.votes);

      if (privilege != "") {
        updateEventJoinStatus(participants);
        const participated = participants.find(
          (p) => p.user_id === userData.id
        );

        if (participated) {
          setEventJoinStatus(participated.status);
        }
      }
    }
  }, [event]);

  return (
    <>
      {isLoading && <Spinner></Spinner>}
      {event && (
        <>
          <div
            id="event-container"
            className="flex flex-row justify-around w-full"
            key={event.id}
          >
            <div className="flex flex-col w-[80%]">
              <div className="relative h-[350px] mx-auto">
                <img
                  loading="lazy"
                  className="mx-auto h-full"
                  src={event.image}
                  alt="Event Image"
                />
              </div>

              <div className="w-full flex flex-col items-center gap-1">
                <h1 className="font-bold text-6xl">{event.title}</h1>
                <p className="font-semibold">a {event.type} event</p>

                <div className="flex flex-row gap-2 items-center text-base">
                  <div className="flex flex-row gap-1 items-center">
                    <LuClock10 />
                    <p>{event.datetime}</p>
                  </div>
                  <div className="flex flex-row gap-1 items-center">
                    <IoLocationOutline />
                    <p>{event.venue}</p>
                  </div>
                </div>

                <Link to={`/${event.host.username}`}>
                  <p className="font-semibold">
                    Hosted by {event.host.firstname} {event.host.lastname}
                  </p>
                </Link>

                {event.is_cancelled && (
                  <p className="font-semibold text-red-500">Event cancelled</p>
                )}
                <div className="flex flex-col gap-2 items-center">
                  <div className="flex flex-row gap-2">
                    {vote == "" && (
                      <>
                        <FontAwesomeIcon
                          onClick={handleUpVote}
                          icon={fasThumbsUp}
                          className="cursor-pointer fa-2xl text-green-500"
                        />

                        <p>{upVotes}</p>

                        <FontAwesomeIcon
                          onClick={handleDownVote}
                          icon={fasThumbsDown}
                          className="cursor-pointer fa-2xl text-red-500"
                        />
                        <p>{downVotes}</p>
                      </>
                    )}
                    {vote == "upvote" && (
                      <>
                        <FontAwesomeIcon
                          onClick={handleRemoveVote}
                          icon={fasThumbsUp}
                          type="input"
                          className="cursor-pointer fa-2xl text-green-500"
                        />
                        <p>{upVotes}</p>

                        <FontAwesomeIcon
                          onClick={handleDownVote}
                          icon={farThumbsDown}
                          className="cursor-pointer fa-2xl text-red-500"
                        />
                        <p>{downVotes}</p>
                      </>
                    )}
                    {vote == "downvote" && (
                      <>
                        <FontAwesomeIcon
                          onClick={handleUpVote}
                          icon={farThumbsUp}
                          className="cursor-pointer fa-2xl text-green-500"
                        />
                        <p>{upVotes}</p>

                        <FontAwesomeIcon
                          onClick={handleRemoveVote}
                          icon={fasThumbsDown}
                          className="cursor-pointer fa-2xl text-red-500"
                        />
                        <p>{downVotes}</p>
                      </>
                    )}
                  </div>

                  <div className="text-sm text-center bg-[rgb(128,128,128)] rounded p-4">
                    <p>{event.description}</p>
                  </div>

                  {privilege != "" && (
                    <>
                      {userData.id === event.host.id ||
                      userData.privilege == "admin" ? (
                        <Link
                          className="border border-green-500 bg-green-500 px-4 py-2 rounded text-white hover:text-green-500 hover:bg-white"
                          to={`/manageEvent/${id}`}
                        >
                          Manage Event
                        </Link>
                      ) : (
                        <>
                          {event.is_cancelled ? (
                            <div className="flex flex-col items-center">
                              <p className="font-black text-red-500 text-lg">
                                Event Cancelled
                              </p>
                              <p className="font-normal text-red-500 text-lg">
                                {event.cancellation_reason}
                              </p>
                            </div>
                          ) : (
                            <>
                              {eventJoinStatus === "" ? (
                                <button
                                  onClick={handleJoinEvent}
                                  className="px-4 py-2"
                                >
                                  Register
                                </button>
                              ) : (
                                <>
                                  {eventJoinStatus === "pending" && (
                                    <>
                                      <p className="font-semibold">
                                        Your event registration request is
                                        pending
                                      </p>
                                      <button
                                        onClick={handleLeaveEvent}
                                        className="border border-red-500 bg-red-500 px-4 py-2 rounded text-white hover:text-red-500 hover:bg-white"
                                      >
                                        Revoke Registration
                                      </button>
                                    </>
                                  )}
                                  {eventJoinStatus === "accepted" && (
                                    <>
                                      <p className="text-green-500 font-semibold">
                                        Your registration was accepted by the
                                        event host! See you soon!
                                      </p>
                                      <button
                                        onClick={handleLeaveEvent}
                                        className="border border-red-500 bg-red-500 px-4 py-2 rounded text-white hover:text-red-500 hover:bg-white"
                                      >
                                        Revoke Registration
                                      </button>
                                    </>
                                  )}

                                  {eventJoinStatus === "rejected" && (
                                    <>
                                      <p className="text-red-500 font-semibold">
                                        Your registration was rejected by the
                                        event host
                                      </p>
                                    </>
                                  )}
                                </>
                              )}
                            </>
                          )}
                        </>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className="flex flex-col items-start gap-3 border p-3 rounded bg-[#292929]">
              <div className="flex flex-row items-center justify-center bg-[#ffa31a] py-2 px-3 rounded">
                <h1 className="font-bold text-black text-lg">
                  Event Participants
                </h1>
              </div>
              <div className="flex flex-col gap-2">
                {participants.filter((p) => p.status === "accepted").length >
                0 ? (
                  participants.map((p) => {
                    return (
                      p.status == "accepted" && (
                        <div
                          key={p.id}
                          className={`flex flex-row gap-2 items-end`}
                        >
                          <h1 className="font-semibold text-sm">
                            {p.firstname}
                          </h1>
                          <h1 className="font-semibold text-sm">
                            {p.lastname}
                          </h1>
                          <h1 className="font-semibold text-xs">
                            {p.username}
                          </h1>
                        </div>
                      )
                    );
                  })
                ) : (
                  <p>Nothing here yet</p>
                )}
              </div>
            </div>
          </div>

          <div className="p-5 flex flex-col justify-center w-full items-center">
            <form
              onSubmit={handleReview}
              className="flex flex-col justify-center gap-2 w-[60vw]"
            >
              <textarea
                name="review"
                className="border text-black border-black rounded p-4"
                cols="40"
                rows="4"
                placeholder="Wow cool event, definitely coming"
                required
              ></textarea>
              <button type="submit" className="bg-[#ffa31a]">
                Submit Review
              </button>
            </form>
            <div className="flex flex-col items-center gap-1 w-full">
              <h1>Reviews</h1>
              {reviews && reviews.length > 0 ? (
                <div className="min-w-[250px]">
                  {reviews.map((review) => {
                    return (
                      <div
                        key={review.id}
                        id={review.id}
                        className="rounded p-3 bg-[#292929] break-words whitespace-pre-wrap w-full max-w-[60vw] relative"
                      >
                        <div className="flex flex-row justify-between items-center w-full">
                          <Link
                            to={`/${review.username}`}
                            className="font-semibold text-sm inline underline"
                          >
                            u/{review.username}
                          </Link>

                          {review.user_id === userData.id && (
                            <div className="flex flex-row top-1 right-1">
                              <button
                                onClick={() => openEditReviewModal(review)}
                              >
                                <FontAwesomeIcon
                                  icon={farEdit}
                                  className="fa-xs"
                                />
                              </button>
                              <button
                                onClick={() => handleDeleteReview(review)}
                                className="text-red-500"
                                id={review.id}
                              >
                                <FontAwesomeIcon
                                  icon={farTrashCan}
                                  className="fa-xs"
                                />
                              </button>
                            </div>
                          )}
                        </div>
                        <p className="text-sm">{review.review}</p>
                      </div>
                    );
                  })}
                  <EditReview
                    isOpen={editReviewIsOpen}
                    onClose={closeEditReviewModal}
                    initialReview={currentReview}
                    setEditReviewIsOpen={setEditReviewIsOpen}
                    reviews={reviews}
                    setReviews={setReviews}
                    handleEditReview={handleEditReview}
                  />
                </div>
              ) : (
                <p>Nothing here yet</p>
              )}
            </div>
          </div>
        </>
      )}
    </>
  );
}
