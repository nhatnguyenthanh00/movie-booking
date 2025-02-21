const router = require("express").Router();
const eventController = require("../controllers/EventController");

router.get("/image", eventController.getAllEventHomePageImage);
router.get("/:eventId", eventController.getEventById);
router.post("/", eventController.addEvent);
router.put("/:eventId", eventController.updateEvent);

module.exports = router;