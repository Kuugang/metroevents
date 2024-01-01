const express = require("express");
const multer = require("multer");
const router = express.Router();
const path = require("path");

const {
  register,
  login,
  createEvent,
  deleteEvent,
  getEvents,
  joinOrganizers,
  getOrganizers,
  createEventType,
  getEventTypes,
  deleteEventType,
  updateEventType,
  logout,
  verifyToken,
  verifyAdminToken,
  userJoinEvent,
  userLeaveEvent,
  verifyOrganizerToken,
  downvoteEvent,
  upvoteEvent,
  reviewEvent,
  deleteReview,
  updateReview,
  removeEventVote,
  approveEventRegistration,
  rejectEventRegistration,
  verifyEventOrganizer,
  cancelEvent,
  readNotification,
  updateEvent,
  adminGetUsers,
  adminSetUserPrivilege,
  getUserRequests,
  acceptOrganizerRequest,
  rejectOrganizerRequest,
  getUser,
  userGetNotifications,
} = require("../controllers/mainControllers");


router.route("/getEvents").get(getEvents); //partially done
router.route("/user/register").post(register); //done
router.route("/user/login").post(login); //done
router.route("/user/logout").post(logout); //done
router.route("/user/joinOrganizers").post(verifyToken, joinOrganizers); //need review
router.route("/user/notifications").get(verifyToken, userGetNotifications);
router.route("/user/notifications").post(verifyToken, readNotification);
router.route("/user").get(getUser);

router.route("/event/joinEvent").post(verifyToken, userJoinEvent); 
router.route("/event/leaveEvent").post(verifyToken, userLeaveEvent);
router.route("/event/upvote").post(verifyToken, upvoteEvent);
router.route("/event/downvote").post(verifyToken, downvoteEvent);
router.route("/event/removevote").post(verifyToken, removeEventVote);

router.route("/event/review").post(verifyToken, reviewEvent);
router.route("/event/review").delete(verifyToken, deleteReview);
router.route("/event/review").put(verifyToken, updateReview);

router.route("/organizer/createEvent").post(verifyOrganizerToken, createEvent);

router
  .route("/organizer/event/approve")
  .put(verifyOrganizerToken, verifyEventOrganizer, approveEventRegistration);

router
  .route("/organizer/event/reject")
  .put(verifyOrganizerToken, verifyEventOrganizer, rejectEventRegistration);
router
  .route("/organizer/event/cancel")
  .post(verifyOrganizerToken, verifyEventOrganizer, cancelEvent);

router.route("/organizer/event").get(verifyOrganizerToken, getEventTypes);
router.route("/organizer/event").put(verifyOrganizerToken, updateEvent);




router.route("/admin/organizers").get(verifyAdminToken, getOrganizers);
router.route("/admin/users").get(verifyAdminToken, adminGetUsers)
router.route("/admin/users").post(verifyAdminToken, adminSetUserPrivilege)
router.route("/admin/users/requests").get(verifyAdminToken, getUserRequests)

router.route("/admin/organizer/requests/accept").post(verifyAdminToken, acceptOrganizerRequest)
router.route("/admin/organizer/requests/reject").post(verifyAdminToken, rejectOrganizerRequest)


//crud for event types
router.route("/admin/event").get(verifyAdminToken, getEventTypes);
router.route("/admin/event").post(verifyAdminToken, createEventType); //done
router.route("/admin/event").delete(verifyAdminToken, deleteEventType); //done
router.route("/admin/event").put(verifyAdminToken, updateEventType); //done

module.exports = router;