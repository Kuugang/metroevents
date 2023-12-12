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
  decideJoinStatus,
  joinOrganizers,
  getOrganizers,
  updateOrganizers,
  adminLogin,
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
  toggleOrganizerStatus,
  getNotifications,
  approveEventRegistration,
  rejectEventRegistration,
  verifyEventOrganizer,
  cancelEvent,
  readNotification,
} = require("../controllers/mainControllers");

var uploads = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads");
  },
  filename: function (req, file, cb) {
    cb(
      null,
      `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
    );
  },
});

var uploads = multer({ storage: uploads });

router.route("/getEvents").get(getEvents);
router.route("/user/register").post(register);
router.route("/user/login").post(login);
router.route("/user/logout").post(logout);
router.route("/user/joinOrganizers").post(verifyToken, joinOrganizers);
router.route("/user/notifications").get(verifyToken, getNotifications);
router.route("/user/notifications").post(verifyToken, readNotification);

router.route("/event/joinEvent").post(verifyToken, userJoinEvent);
router.route("/event/leaveEvent").post(verifyToken, userLeaveEvent);
router.route("/event/upvote").post(verifyToken, upvoteEvent);
router.route("/event/downvote").post(verifyToken, downvoteEvent);
router.route("/event/removevote").post(verifyToken, removeEventVote);

router.route("/event/review").post(verifyToken, reviewEvent);
router.route("/event/review").delete(verifyToken, deleteReview);
router.route("/event/review").put(verifyToken, updateReview);

router
  .route("/organizer/createEvent")
  .post(uploads.single("imgfile"), verifyOrganizerToken, createEvent);

// router
//   .route("/organizer/deleteEvent")
//   .delete(verifyOrganizerToken, deleteEvent);

router
  .route("/organizer/event/approve")
  .put(verifyOrganizerToken, verifyEventOrganizer, approveEventRegistration);

router
  .route("/organizer/event/reject")
  .put(verifyOrganizerToken, verifyEventOrganizer, rejectEventRegistration);
router.route("/organizer/event/cancel").post(verifyOrganizerToken, verifyEventOrganizer, cancelEvent);

router.route("/organizer/event").get(verifyOrganizerToken, getEventTypes);

//crud for event types
router.route("/admin/organizers").get(verifyAdminToken, getOrganizers);
router
  .route("/admin/organizer/status")
  .put(verifyAdminToken, toggleOrganizerStatus);
router.route("/admin/login").post(adminLogin);

router.route("/admin/event").get(verifyAdminToken, getEventTypes);
router.route("/admin/event").post(verifyAdminToken, createEventType);
router.route("/admin/event").delete(verifyAdminToken, deleteEventType);
router.route("/admin/event").put(verifyAdminToken, updateEventType);

module.exports = router;
