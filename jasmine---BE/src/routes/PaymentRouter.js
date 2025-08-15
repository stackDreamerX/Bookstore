const express = require("express");
const router = express.Router();
const PaymentController = require("../controllers/PaymentController");
const { authMiddleware } = require("../middleware/authMiddleware");

// Create VNPay payment
router.post("/create", PaymentController.createPayment);

// Process COD payment
router.post("/process-cod", PaymentController.processCodPayment);

// VNPay return and IPN
router.get("/vnpay-return", PaymentController.paymentReturn);
router.get("/ipn", PaymentController.paymentIpn);

// Get payment by order ID
router.get("/order/:orderId", PaymentController.getPaymentByOrderId);

// Get all payments (admin only)
router.get("/all", authMiddleware, PaymentController.getAllPayments);

// ZaloPay routes
router.post('/create-zalopay', PaymentController.createZaloPayPayment);
router.get('/zalopay-result', PaymentController.processZaloPayReturn);

module.exports = router;
