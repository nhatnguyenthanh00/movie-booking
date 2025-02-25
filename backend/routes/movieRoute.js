const router = require("express").Router();
const showtimeController = require("../controllers/ShowtimeController");
const movieController = require("../controllers/MovieController");

router.get("/:movieId/showtime", showtimeController.getShowtimeByDay);

router.post("/:movieId/showtime", showtimeController.addShowtime);

router.get("/main", movieController.getAllMoviePoster);

router.get("/detail/:movieId", movieController.getMovieDetailById);

module.exports = router;