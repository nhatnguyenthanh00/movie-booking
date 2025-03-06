const router = require("express").Router();
const bookingController = require("../controllers/BookingController");
const { checkAuthorize } = require("../middleware/authMiddleware");
router.post("/", checkAuthorize(["user"]), bookingController.createBooking);
router.get("/:id", checkAuthorize(["user"]), bookingController.getInfoBooking);


module.exports = router;