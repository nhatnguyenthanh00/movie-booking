const router = require("express").Router();
const reviewController = require("../controllers/ReviewController");
const { checkAuthorize } = require("../middleware/authMiddleware");
router.post("/add-new",checkAuthorize(["user"]),reviewController.addNewReview);

module.exports = router;
