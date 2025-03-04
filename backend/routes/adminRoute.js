const router = require("express").Router();
const adminController = require("../controllers/AdminController");

router.get("/users", adminController.getAllUsers);
router.put("/users/:id/change-status", adminController.changeStatusUser);

router.post("/events", adminController.addNewEvent);
router.put("/events/:id", adminController.updateEvent);
router.delete("/events/:id", adminController.deleteEvent);

module.exports = router;