const router = require("express").Router();
const adminController = require("../controllers/AdminController");

// Lấy tất cả user
router.get("/users", adminController.getAllUsers);

// Thay đổi trạng thái user
router.put("/users/:id/change-status", adminController.changeStatusUser);

// Thêm sự kiện mới
router.post("/events", adminController.addNewEvent);

// Cập nhật sự kiện
router.put("/events/:id", adminController.updateEvent);

// Xóa sự kiện
router.delete("/events/:id", adminController.deleteEvent);

// Lấy tất cả phim
router.get("/movies", adminController.getAllMovies);

// Thêm phim mới
router.post("/movies", adminController.addNewMovie);

// Cập nhật phim
router.put("/movies/:id", adminController.updateMovie);

// Xóa phim
router.delete("/movies/:id", adminController.deleteMovie);

// Thêm showtime
router.post("/movies/:movieId/add-showtime", adminController.addShowtime);
// Xóa showtime
router.delete("/showtimes/:id", adminController.deleteShowtime);

// Lấy tất cả phòng chiếu
router.get("/rooms", adminController.getAllRoom);

module.exports = router;