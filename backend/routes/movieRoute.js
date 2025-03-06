const router = require("express").Router();
const showtimeController = require("../controllers/ShowtimeController");
const movieController = require("../controllers/MovieController");

router.get("/:movieId/showtime-by-day", showtimeController.getShowtimeByDay);

router.get("/showtime/:showtimeId", showtimeController.getShowtimeById);

router.get("/main", movieController.getAllMoviePoster);

router.get("/detail/:movieId", movieController.getMovieDetailById);

router.get("/detail/:movieId/reviews", movieController.getReviewsByMovieId);

module.exports = router;