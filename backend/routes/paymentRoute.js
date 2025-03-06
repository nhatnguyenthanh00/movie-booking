const router = require("express").Router();
const paymentController = require("../controllers/PaymentController");
const { checkAuthorize } = require("../middleware/authMiddleware");

router.post("/create", paymentController.createPayment);
router.get("/return", paymentController.getPaymentReturn);

module.exports = router;