const router = require("express").Router();
const adminController = require("../controllers/AdminController");

router.get("/users", adminController.getAllUsers);
router.put("/users/:id/change-status", adminController.changeStatusUser);

router.post("/events", adminController.addNewEvent);
router.put("/events/:id", adminController.updateEvent);
router.delete("/events/:id", adminController.deleteEvent);

router.get("/movies", adminController.getAllMovies);
router.put("/movies/:id", adminController.updateMovie);
router.delete("/movies/:id", adminController.deleteMovie);

router.get("/movies/:id/showtimes", adminController.getShowtimesByMovieId);
router.post("/movies/:movieId/showtimes", adminController.addShowtime);
router.delete("/showtimes/:id", adminController.deleteShowtime);

module.exports = router;