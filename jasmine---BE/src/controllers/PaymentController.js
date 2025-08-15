const PaymentService = require("../services/PaymentService");

//create Payment
const createPayment = async (req, res) => {
  try {
    const { amount, orderInfo, bankCode, language, orderId } = req.body;

    if (!amount || !orderId) {
      return res.status(200).json({
        status: "ERR",
        message: "Amount and orderId are required",
      });
    }

    // Validate that the orderId exists
    try {
      const Order = require('../models/OrderModel');
      const orderExists = await Order.findById(orderId);
      if (!orderExists) {
        return res.status(200).json({
          status: "ERR",
          message: "Order not found",
        });
      }
    } catch (error) {
      return res.status(200).json({
        status: "ERR",
        message: "Invalid orderId format or order not found",
      });
    }

    const paymentData = {
      amount,
      orderInfo: orderInfo || `Thanh toan don hang ${orderId}`,
      bankCode: bankCode || '',
      language: language || 'vn',
      orderId
    };

    console.log("Creating VNPay payment with data:", paymentData);
    const response = await PaymentService.createPaymentUrl(paymentData);
    console.log("VNPay payment URL created:", response);

    return res.status(200).json(response);
  } catch (e) {
    console.error("Error creating VNPay payment:", e);
    return res.status(404).json({
      status: "ERR",
      message: e.message || "An error occurred while creating VNPay payment",
    });
  }
};

// Process VNPay return
const paymentReturn = async (req, res) => {
  try {
    const vnpParams = req.query;
    const response = await PaymentService.processPaymentReturn(vnpParams);

    // For direct browser returns, redirect to frontend with params
    if (req.headers.accept?.includes('text/html')) {
      const baseUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
      const queryParams = new URLSearchParams({
        vnp_ResponseCode: response.code,
        vnp_TxnRef: vnpParams.vnp_TxnRef || '',
        message: response.message
      }).toString();

      return res.redirect(`${baseUrl}/payment/result?${queryParams}`);
    }

    // For API calls, return JSON
    return res.status(200).json(response);
  } catch (e) {
    console.error("Error processing VNPay return:", e);
    return res.status(404).json({
      status: "ERR",
      message: e.message || "An error occurred while processing payment return",
    });
  }
};

// Process IPN callback from VNPay
const paymentIpn = async (req, res) => {
  try {
    const vnpParams = req.query;
    const response = await PaymentService.processPaymentReturn(vnpParams);

    // Always return standard format for VNPay IPN
    if (response.status === "OK") {
      return res.status(200).json({
        RspCode: "00",
        Message: "Confirm Success"
      });
    } else {
      return res.status(200).json({
        RspCode: response.code || "99",
        Message: response.message || "Confirm Fail"
      });
    }
  } catch (e) {
    console.error("Error processing payment IPN:", e);
    return res.status(200).json({
      RspCode: "99",
      Message: "Unknown error"
    });
  }
};

// Get payment by order ID
const getPaymentByOrderId = async (req, res) => {
  try {
    const orderId = req.params.orderId;

    if (!orderId) {
      return res.status(200).json({
        status: "ERR",
        message: "Order ID is required",
      });
    }

    const response = await PaymentService.getPaymentByOrderId(orderId);
    return res.status(200).json(response);
  } catch (e) {
    console.error("Error getting payment details:", e);
    return res.status(404).json({
      status: "ERR",
      message: e.message || "An error occurred while getting payment details",
    });
  }
};

// Get all payments (admin)
const getAllPayments = async (req, res) => {
  try {
    const { limit, page, sort, filter } = req.query;
    const response = await PaymentService.getAllPayments(
      Number(limit) || 8,
      Number(page) || 0,
      sort,
      filter
    );
    return res.status(200).json(response);
  } catch (e) {
    console.error("Error getting all payments:", e);
    return res.status(404).json({
      status: "ERR",
      message: e.message || "An error occurred while getting payments",
    });
  }
};

// Process COD payment
const processCodPayment = async (req, res) => {
  try {
    const { orderId, amount, paymentMethod } = req.body;

    if (!orderId || !amount) {
      return res.status(200).json({
        status: "ERR",
        message: "orderId and amount are required",
      });
    }

    // Validate that the orderId exists
    try {
      const Order = require('../models/OrderModel');
      const orderExists = await Order.findById(orderId);
      if (!orderExists) {
        return res.status(200).json({
          status: "ERR",
          message: "Order not found",
        });
      }

      // Create a COD payment record
      const response = await PaymentService.createCodPayment({
        orderId,
        amount,
        paymentMethod: paymentMethod || "COD"
      });

      return res.status(200).json(response);
    } catch (error) {
      return res.status(200).json({
        status: "ERR",
        message: "Invalid orderId format or order not found",
      });
    }
  } catch (e) {
    console.error("Error processing COD payment:", e);
    return res.status(404).json({
      status: "ERR",
      message: e.message || "An error occurred while processing COD payment",
    });
  }
};

// Create ZaloPay payment
const createZaloPayPayment = async (req, res) => {
  try {
    const { orderId, amount, description } = req.body;

    if (!orderId || !amount) {
      return res.status(200).json({
        status: "ERR",
        message: "OrderId and amount are required"
      });
    }

    // Validate that the orderId exists
    try {
      const Order = require('../models/OrderModel');
      const orderExists = await Order.findById(orderId);
      if (!orderExists) {
        return res.status(200).json({
          status: "ERR",
          message: "Order not found"
        });
      }
    } catch (error) {
      return res.status(200).json({
        status: "ERR",
        message: "Invalid orderId format or order not found"
      });
    }

    console.log("Creating ZaloPay payment with data:", { orderId, amount, description });
    const result = await PaymentService.createZaloPayPayment({
      orderId,
      amount,
      description
    });

    console.log("ZaloPay payment created:", result);
    return res.status(200).json(result);
  } catch (error) {
    console.error("Error in createZaloPayPayment controller:", error);
    return res.status(500).json({
      status: "ERR",
      message: "Internal server error"
    });
  }
};

// Process ZaloPay payment return
const processZaloPayReturn = async (req, res) => {
  try {
    console.log("ZaloPay return params:", req.query);
    const paymentData = {
      appid: req.query.appid,
      apptransid: req.query.apptransid,
      pmcid: req.query.pmcid,
      amount: req.query.amount,
      discountamount: req.query.discountamount,
      status: req.query.status,
      checksum: req.query.checksum
    };

    // Verify required fields
    const requiredFields = ['appid', 'apptransid', 'pmcid', 'amount', 'status', 'checksum'];
    const missingFields = requiredFields.filter(field => !paymentData[field]);

    if (missingFields.length > 0) {
      console.error("Missing required fields:", missingFields);
      return res.status(400).json({
        status: "ERR",
        message: `Missing required fields: ${missingFields.join(', ')}`
      });
    }

    const response = await PaymentService.processZaloPayReturn(paymentData);
    console.log("ZaloPay return processed:", response);

    // For direct browser returns, redirect to frontend with params
    if (req.headers.accept?.includes('text/html')) {
      const baseUrl = 'http://localhost:3000'; // Hardcode frontend URL for development

      // Determine the appropriate code based on ZaloPay status
      let code = response.code;
      if (!code) {
        if (paymentData.status === '1') {
          code = '00'; // Success
        } else if (paymentData.status === '-49') {
          code = '24'; // Canceled by user (using VNPay's code for consistency)
        } else {
          code = '99'; // General failure
        }
      }

      const queryParams = new URLSearchParams({
        app_trans_id: paymentData.apptransid,
        status: paymentData.status,
        amount: paymentData.amount,
        pmcid: paymentData.pmcid,
        message: response.message,
        code: code
      }).toString();

      console.log("Redirecting to frontend with params:", queryParams);
      return res.redirect(`${baseUrl}/payment/result?${queryParams}`);
    }

    // For API calls, return JSON
    return res.status(200).json(response);
  } catch (error) {
    console.error("Error processing ZaloPay return:", error);
    return res.status(500).json({
      status: "ERR",
      message: "Internal server error"
    });
  }
};

const getPaymentStatusText = (paymentMethod, paymentResult) => {
  if (!paymentResult) return 'Chưa thanh toán';

  if (paymentMethod === 'ZALOPAY') {
    return paymentResult.status === 'COMPLETED' ? 'Đã thanh toán qua ZaloPay' : 'Chưa thanh toán';
  }
  if (paymentMethod === 'VNPAY') {
    return paymentResult.status === 'COMPLETED' ? 'Đã thanh toán qua VNPay' : 'Chưa thanh toán';
  }
  if (paymentMethod === 'COD') {
    return 'Thanh toán khi nhận hàng';
  }
  return 'Chưa thanh toán';
};

const handleConfirmDelivery = async () => {
  try {
    const response = await updateOrderStatus(orderId, 'DELIVERED');
    if (response.status === 'OK') {
      fetchOrderDetails();
      alert('Xác nhận nhận hàng thành công!');
    } else {
      alert('Không thể xác nhận nhận hàng. Vui lòng thử lại.');
    }
  } catch (error) {
    console.error('Error confirming delivery:', error);
    alert('Đã xảy ra lỗi. Vui lòng thử lại.');
  }
};

module.exports = {
  createPayment,
  paymentReturn,
  paymentIpn,
  getPaymentByOrderId,
  getAllPayments,
  processCodPayment,
  createZaloPayPayment,
  processZaloPayReturn
};
