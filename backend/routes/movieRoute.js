const router = require("express").Router();
const showtimeController = require("../controllers/ShowtimeController");
const movieController = require("../controllers/MovieController");

router.get("/:movieId/showtime", showtimeController.getShowtimeByDay);

router.post("/:movieId/showtime", showtimeController.addShowtime);

router.get("/poster", movieController.getAllMoviePoster);

module.exports = router;