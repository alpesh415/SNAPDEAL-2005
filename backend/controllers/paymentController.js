const Razorpay = require("razorpay");
const crypto = require("crypto");
const paymentModel = require("../models/Payment");
const orderModel = require("../models/Order");
const cartModel = require("../models/Cart");
const productModel = require("../models/Product");

const completeOrderInventory = async (order, userId) => {
  for (const item of order.products) {
    const updated = await productModel.findOneAndUpdate(
      { _id: item.product, stock: { $gte: item.quantity } },
      { $inc: { stock: -item.quantity } },
      { new: true }
    );
    if (!updated) throw new Error("Insufficient stock while completing payment");
  }
  await cartModel.findOneAndUpdate({ user: userId }, { $set: { products: [] } });
};

// Created only when needed, so the server still starts if Razorpay keys are missing.
let razorpayClient = null;
const getRazorpay = () => {
  if (!razorpayClient) {
    razorpayClient = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });
  }
  return razorpayClient;
};

// Create Razorpay order for an existing application order
const createRazorpayOrder = async (req, res) => {
  try {
    const { userId, orderId } = req.body;

    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
      return res.status(500).json({
        success: false,
        message: "Razorpay keys are not configured in backend .env",
      });
    }

    const order = await orderModel.findById(orderId);
    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    if (order.user.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: "This order does not belong to this user",
      });
    }

    if (order.paymentStatus === "paid") {
      return res.status(400).json({
        success: false,
        message: "Order is already paid",
      });
    }

    const amount = Math.round(Number(order.totalAmount) * 100);
    if (!amount || amount < 100) {
      return res.status(400).json({
        success: false,
        message: "Razorpay minimum payment amount is ₹1",
      });
    }

    const razorpayOrder = await getRazorpay().orders.create({
      amount,
      currency: "INR",
      receipt: `order_${order._id}`,
      notes: {
        appOrderId: order._id.toString(),
        userId: userId.toString(),
      },
    });

    order.razorpayOrderId = razorpayOrder.id;
    await order.save();

    res.status(201).json({
      success: true,
      key: process.env.RAZORPAY_KEY_ID,
      razorpayOrder,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Verify Razorpay signature on the server and mark payment as paid
const verifyRazorpayPayment = async (req, res) => {
  try {
    const {
      userId,
      orderId,
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = req.body;

    const order = await orderModel.findById(orderId);
    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    if (order.user.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: "This order does not belong to this user",
      });
    }

    if (order.paymentStatus === "paid") {
      return res.status(200).json({
        success: true,
        message: "Payment was already verified",
        order,
      });
    }

    if (!order.razorpayOrderId || order.razorpayOrderId !== razorpay_order_id) {
      return res.status(400).json({
        success: false,
        message: "Razorpay order ID mismatch",
      });
    }

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      order.paymentStatus = "failed";
      await order.save();

      return res.status(400).json({
        success: false,
        message: "Payment signature verification failed",
      });
    }

    let payment = await paymentModel.findOne({ order: orderId });

    if (!payment) {
      payment = await paymentModel.create({
        user: userId,
        order: orderId,
        amount: order.totalAmount,
        paymentMethod: "razorpay",
        transactionId: razorpay_payment_id,
        status: "success",
        razorpayOrderId: razorpay_order_id,
        razorpayPaymentId: razorpay_payment_id,
        razorpaySignature: razorpay_signature,
      });
    } else {
      payment.paymentMethod = "razorpay";
      payment.transactionId = razorpay_payment_id;
      payment.status = "success";
      payment.razorpayOrderId = razorpay_order_id;
      payment.razorpayPaymentId = razorpay_payment_id;
      payment.razorpaySignature = razorpay_signature;
      await payment.save();
    }

    await completeOrderInventory(order, userId);
    order.paymentStatus = "paid";
    order.status = order.status === "pending" ? "confirmed" : order.status;
    await order.save();

    res.status(200).json({
      success: true,
      message: "Payment verified successfully",
      payment,
      order,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const createPayment = async (req, res) => {
  try {
    const { userId, orderId, paymentMethod } = req.body;
    const order = await orderModel.findById(orderId);

    if (!order) return res.status(404).json({ success: false, message: "Order not found" });

    if (order.user.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: "This order does not belong to this user",
      });
    }

    if (paymentMethod === "razorpay") {
      return res.status(400).json({
        success: false,
        message: "Use the Razorpay create-order and verify-payment APIs",
      });
    }

    const paymentExist = await paymentModel.findOne({ order: orderId });
    if (paymentExist) {
      return res.status(400).json({ success: false, message: "Payment already exists" });
    }

    let status = "pending";
    let transactionId = "";

    if (paymentMethod === "cod") {
      status = "success";
      transactionId = "COD-" + Date.now();
    }

    const payment = await paymentModel.create({
      user: userId,
      order: orderId,
      amount: order.totalAmount,
      paymentMethod,
      transactionId,
      status,
    });

    if (status === "success") {
      await completeOrderInventory(order, userId);
      order.paymentStatus = "paid";
      order.status = "confirmed";
      await order.save();
    }

    res.status(201).json({
      success: true,
      message: "Payment created successfully",
      payment,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getPayment = async (req, res) => {
  try {
    const payment = await paymentModel.findById(req.params.id).populate("user").populate("order");
    if (!payment) return res.status(404).json({ success: false, message: "Payment not found" });
    res.status(200).json({ success: true, payment });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getPaymentByOrder = async (req, res) => {
  try {
    const payment = await paymentModel.findOne({ order: req.params.orderId }).populate("order");
    if (!payment) return res.status(404).json({ success: false, message: "Payment not found" });
    res.status(200).json({ success: true, payment });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updatePaymentStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const payment = await paymentModel.findById(req.params.id);
    if (!payment) return res.status(404).json({ success: false, message: "Payment not found" });

    payment.status = status;
    await payment.save();

    const order = await orderModel.findById(payment.order);
    if (order) {
      order.paymentStatus =
        status === "success" ? "paid" : status === "failed" ? "failed" : "pending";
      await order.save();
    }

    res.status(200).json({
      success: true,
      message: "Payment status updated successfully",
      payment,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  createPayment,
  getPayment,
  getPaymentByOrder,
  updatePaymentStatus,
  createRazorpayOrder,
  verifyRazorpayPayment,
};
