const router = require("express").Router();
const eventController = require("../controllers/EventController");

router.get("/", eventController.getAllEvent);
router.get("/main", eventController.getAllEventHomePage);
router.get("/:eventId", eventController.getEventById);
router.post("/", eventController.addEvent);
router.put("/:eventId", eventController.updateEvent);

module.exports = router;