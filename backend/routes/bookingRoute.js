const router = require("express").Router();
const bookingController = require("../controllers/BookingController");
const { checkAuthorize } = require("../middleware/authMiddleware");
router.post("/", bookingController.createBooking);
router.get("/:id", checkAuthorize(["user"]), bookingController.getInfoBooking);
router.get("/book/:movieId", bookingController.getBookingByMovieId);
router.get("/book/:movieId/:showtimeId",bookingController.getCustomerByShowtimeId);

module.exports = router;
