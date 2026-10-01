const express = require("express");
const router = express.Router();

const {
  createPayment,
  getPayment,
  getPaymentByOrder,
  updatePaymentStatus,
  createRazorpayOrder,
  verifyRazorpayPayment,
} = require("../controllers/paymentController");

router.post("/create", createPayment);
router.post("/razorpay/create-order", createRazorpayOrder);
router.post("/razorpay/verify", verifyRazorpayPayment);
router.get("/get/:id", getPayment);
router.get("/order/:orderId", getPaymentByOrder);
router.put("/status/:id", updatePaymentStatus);

module.exports = router;
