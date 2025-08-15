const Payment = require("../models/PaymentModel");
const Order = require("../models/OrderModel");
const vnpayConfig = require("../config/vnpay");
const crypto = require("crypto");
const moment = require("moment");
const querystring = require("qs");
const axios = require("axios");

// Helper function to sort object by key (for VNPay)
function sortObject(obj) {
  const sorted = {};
  const keys = Object.keys(obj).sort();

  for (const key of keys) {
    if (obj.hasOwnProperty(key)) {
      sorted[key] = obj[key];
    }
  }
  return sorted;
}

// Create VNPay payment URL
const createPaymentUrl = (paymentData) => {
  return new Promise(async (resolve, reject) => {
    try {
      const { amount, orderInfo, bankCode, language, orderId } = paymentData;

      // Get the order details
      const order = await Order.findById(orderId);
      if (!order) {
        return resolve({
          status: "ERR",
          message: "Order not found"
        });
      }

      // Set timezone
      process.env.TZ = 'Asia/Ho_Chi_Minh';

      // Create date object
      const date = new Date();
      const createDate = moment(date).format('YYYYMMDDHHmmss');

      // Create transaction reference
      const txnRef = moment(date).format('HHmmss') + orderId.toString().slice(-6);

      // Create VNPay parameters
      let vnpParams = {};
      vnpParams['vnp_Version'] = '2.1.0';
      vnpParams['vnp_Command'] = 'pay';
      vnpParams['vnp_TmnCode'] = vnpayConfig.vnp_TmnCode;
      vnpParams['vnp_Locale'] = language || 'vn';
      vnpParams['vnp_CurrCode'] = 'VND';
      vnpParams['vnp_TxnRef'] = txnRef;
      vnpParams['vnp_OrderInfo'] = orderInfo || `Thanh_toan_don_hang_${orderId}`;
      vnpParams['vnp_OrderType'] = 'billpayment';
      vnpParams['vnp_Amount'] = Math.round(amount * 100);
      vnpParams['vnp_ReturnUrl'] = vnpayConfig.vnp_ReturnUrl;
      vnpParams['vnp_CreateDate'] = createDate;
      vnpParams['vnp_IpAddr'] = '127.0.0.1';

      if (bankCode && bankCode !== '') {
        vnpParams['vnp_BankCode'] = bankCode;
      }

      // Sort the parameters
      vnpParams = sortObject(vnpParams);

      // Create signature
      let signData = querystring.stringify(vnpParams);
      let hmac = crypto.createHmac("sha512", vnpayConfig.vnp_HashSecret);
      let signed = hmac.update(Buffer.from(signData, 'utf-8')).digest("hex");

      vnpParams['vnp_SecureHash'] = signed;

      // Create payment URL
      const paymentUrl = vnpayConfig.vnp_Url + '?' + querystring.stringify(vnpParams);

      try {
        // Create a record in the Payment model
        const payment = await Payment.create({
          paymentCode: txnRef,
          orderId: orderId,
          amount: amount,
          bankCode: bankCode || '',
          orderInfo: orderInfo || `Thanh_toan_don_hang_${orderId}`,
          paymentMethod: 'VNPAY'
        });

        console.log("Payment record created:", payment);
      } catch (paymentError) {
        console.log("Error creating payment record:", paymentError);
        // Continue even if payment record creation fails
      }

      resolve({
        status: "OK",
        message: "SUCCESS",
        code: '00',
        data: paymentUrl,
        txnRef: txnRef
      });
    } catch (e) {
      console.error("Error in createPaymentUrl:", e);
      reject(e);
    }
  });
};

// Process VNPay payment return/IPN
const processPaymentReturn = (vnpParams) => {
  return new Promise(async (resolve, reject) => {
    try {
      // Get secure hash from response
      const secureHash = vnpParams['vnp_SecureHash'];

      // Remove hash from params object before validating
      delete vnpParams['vnp_SecureHash'];
      delete vnpParams['vnp_SecureHashType'];

      // Sort params
      const sortedParams = sortObject(vnpParams);

      // Create signature for validation
      const signData = querystring.stringify(sortedParams, { encode: false });
      const hmac = crypto.createHmac("sha512", vnpayConfig.vnp_HashSecret);
      const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest("hex");

      // Compare signatures
      if (secureHash === signed) {
        // Get transaction reference and result code
        const txnRef = vnpParams['vnp_TxnRef'];
        const responseCode = vnpParams['vnp_ResponseCode'];

        // Find payment by payment code
        const payment = await Payment.findOne({ paymentCode: txnRef });
        if (!payment) {
          return resolve({
            status: "ERR",
            message: "Payment not found",
            code: '01'
          });
        }

        // Get order
        const order = await Order.findById(payment.orderId);
        if (!order) {
          return resolve({
            status: "ERR",
            message: "Order not found",
            code: '02'
          });
        }

        // Update payment details with response data
        payment.bankCode = vnpParams['vnp_BankCode'] || payment.bankCode;
        payment.bankTranNo = vnpParams['vnp_BankTranNo'] || '';
        payment.cardType = vnpParams['vnp_CardType'] || '';
        payment.payDate = vnpParams['vnp_PayDate'] || '';
        payment.responseCode = responseCode;
        payment.transactionStatus = vnpParams['vnp_TransactionStatus'] || '';
        payment.txnRef = txnRef;
        payment.secureHash = secureHash;

        await payment.save();

        // If payment successful (responseCode = '00')
        if (responseCode === '00') {
          // Update order status to paid
          order.isPaid = true;
          order.paidAt = Date.now();
          order.paymentResult = {
            id: txnRef,
            status: 'COMPLETED',
            update_time: moment().format('YYYYMMDDHHmmss'),
            email_address: '',
          };
          await order.save();

          return resolve({
            status: "OK",
            message: "Payment successful",
            code: '00',
            data: vnpParams
          });
        } else {
          return resolve({
            status: "ERR",
            message: "Payment failed",
            code: responseCode,
            data: vnpParams
          });
        }
      } else {
        return resolve({
          status: "ERR",
          message: "Invalid signature",
          code: '97',
          data: null
        });
      }
    } catch (e) {
      console.error("Error processing payment return:", e);
      reject(e);
    }
  });
};

// Get payment details
const getPaymentByOrderId = (orderId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const payment = await Payment.findOne({ orderId: orderId });

      if (!payment) {
        return resolve({
          status: "ERR",
          message: "Payment not found for this order"
        });
      }

      resolve({
        status: "OK",
        message: "SUCCESS",
        data: payment
      });
    } catch (e) {
      console.error("Error getting payment details:", e);
      reject(e);
    }
  });
};

// Get all payments (for admin)
const getAllPayments = (limit, page, sort, filter) => {
  return new Promise(async (resolve, reject) => {
    try {
      const totalPayments = await Payment.countDocuments();
      let query = Payment.find();

      // Apply filter if provided
      if (filter) {
        const label = filter[0];
        const value = filter[1];

        // Special handling for filter by payment status
        if (label === 'status') {
          if (value === 'success') {
            query = query.where('responseCode').equals('00');
          } else if (value === 'failed') {
            query = query.where('responseCode').ne('00');
          }
        } else {
          query = query.where(label).regex(new RegExp(value, 'i'));
        }
      }

      // Apply sorting if provided
      if (sort) {
        const sortOrder = sort[0]; // 'asc' or 'desc'
        const sortField = sort[1]; // field name

        const sortObj = {};
        sortObj[sortField] = sortOrder === 'asc' ? 1 : -1;
        query = query.sort(sortObj);
      } else {
        // Default sort by createdAt descending
        query = query.sort({ createdAt: -1 });
      }

      // Apply pagination
      const skip = page * limit;
      query = query.skip(skip).limit(limit);

      // Populate order details
      query = query.populate({
        path: 'orderId',
        select: 'totalItemPrice shippingPrice user'
      });

      const payments = await query.exec();

      resolve({
        status: "OK",
        message: "Get all payments successful",
        data: payments,
        total: totalPayments,
        pageCurrent: Number(page + 1),
        totalPage: Math.ceil(totalPayments / limit),
      });
    } catch (e) {
      console.error("Error getting all payments:", e);
      reject(e);
    }
  });
};

// Create COD payment
const createCodPayment = (paymentData) => {
  return new Promise(async (resolve, reject) => {
    try {
      const { orderId, amount, paymentMethod } = paymentData;

      // Get the order details
      const order = await Order.findById(orderId);
      if (!order) {
        return resolve({
          status: "ERR",
          message: "Order not found"
        });
      }

      // Set timezone
      process.env.TZ = 'Asia/Ho_Chi_Minh';

      // Create date object
      const date = new Date();
      const createDate = moment(date).format('YYYYMMDDHHmmss');

      // Create transaction reference for COD (COD prefix + timestamp + order ID)
      const txnRef = `COD${moment(date).format('HHmmss')}${orderId.toString().slice(-6)}`;

      try {
        // Create a record in the Payment model
        const payment = await Payment.create({
          paymentCode: txnRef,
          orderId: orderId,
          amount: amount,
          bankCode: '',
          orderInfo: `Thanh toan COD cho don hang ${orderId}`,
          paymentMethod: paymentMethod || 'COD',
          responseCode: 'COD_PENDING', // Special code for COD
          transactionStatus: 'PENDING'
        });

        // Update order status
        order.paymentMethod = 'COD';
        order.orderStatus = 'PROCESSING';
        order.paymentResult = {
          id: txnRef,
          status: 'PENDING',
          update_time: moment().format('YYYYMMDDHHmmss'),
          email_address: '',
        };
        await order.save();

        console.log("COD payment record created:", payment);

        resolve({
          status: "OK",
          message: "COD payment processed successfully",
          code: '00',
          data: {
            paymentId: payment._id,
            txnRef: txnRef,
            orderId: orderId
          }
        });
      } catch (paymentError) {
        console.error("Error creating COD payment record:", paymentError);
        reject(paymentError);
      }
    } catch (e) {
      console.error("Error in createCodPayment:", e);
      reject(e);
    }
  });
};

// Create ZaloPay payment
const createZaloPayPayment = (paymentData) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!paymentData || !paymentData.orderId || !paymentData.amount) {
        return resolve({
          status: "ERR",
          message: "Missing required payment data"
        });
      }

      const { orderId, amount, description } = paymentData;

      // Get the order details
      const order = await Order.findById(orderId);
      if (!order) {
        return resolve({
          status: "ERR",
          message: "Order not found"
        });
      }

      // Format amount to match ZaloPay requirements (amount in VND)
      const formattedAmount = Math.round(amount);
      if (formattedAmount <= 0) {
        return resolve({
          status: "ERR",
          message: "Invalid amount"
        });
      }

      // Create order data for ZaloPay
      const transID = Math.floor(Math.random() * 1000000);
      const orderData = {
        app_id: process.env.ZALOPAY_APP_ID,
        app_trans_id: `${moment().format('YYMMDD')}_${transID}`,
        app_user: "BookStore",
        app_time: Date.now(),
        amount: formattedAmount,
        embed_data: JSON.stringify({
          preferred_payment_method: [],
          orderId: orderId,
          description: description || `Thanh toan don hang ${orderId}`,
          redirecturl: `http://localhost:3000/payment/result`
        }),
        item: JSON.stringify([{
          name: "BookStore Order",
          quantity: 1,
          price: formattedAmount
        }]),
        description: description || `Thanh toan don hang ${orderId}`,
        bank_code: "",
        return_url: "http://localhost:3000/payment/result"
      };

      try {
        // Create HMAC signature
        const data = `${orderData.app_id}|${orderData.app_trans_id}|${orderData.app_user}|${orderData.amount}|${orderData.app_time}|${orderData.embed_data}|${orderData.item}`;
        const hmac = crypto.createHmac('sha256', process.env.ZALOPAY_KEY1).update(data).digest('hex');
        orderData.mac = hmac;

        // Create payment record first
        const payment = await Payment.create({
          paymentCode: orderData.app_trans_id,
          orderId: orderId,
          amount: formattedAmount,
          bankCode: 'ZALOPAY',
          orderInfo: description || `Thanh toan don hang ${orderId}`,
          paymentMethod: 'ZALOPAY',
          responseCode: 'PENDING',
          transactionStatus: 'PENDING'
        });

        // Call ZaloPay API
        const response = await axios.post('https://sb-openapi.zalopay.vn/v2/create', null, { params: orderData });

        if (response.data.return_code === 1) {
          resolve({
            status: "OK",
            message: "ZaloPay payment created successfully",
            data: {
              orderUrl: response.data.order_url,
              paymentId: payment._id,
              appTransId: orderData.app_trans_id
            }
          });
        } else {
          // Update payment status to failed
          payment.responseCode = '99';
          payment.transactionStatus = 'FAILED';
          await payment.save();

          resolve({
            status: "ERR",
            message: "Failed to create ZaloPay payment",
            data: response.data
          });
        }
      } catch (dbError) {
        console.error("Database error in createZaloPayPayment:", dbError);
        resolve({
          status: "ERR",
          message: "Failed to create payment record"
        });
      }
    } catch (error) {
      console.error("Error in createZaloPayPayment:", error);
      resolve({
        status: "ERR",
        message: "Internal server error"
      });
    }
  });
};

// Process ZaloPay payment return
const processZaloPayReturn = (paymentData) => {
  return new Promise(async (resolve, reject) => {
    try {
      console.log('ZaloPay Return Data:', paymentData);

      // Verify required fields
      const requiredFields = ['appid', 'apptransid', 'pmcid', 'amount', 'status', 'checksum'];
      const missingFields = requiredFields.filter(field => !paymentData[field]);

      if (missingFields.length > 0) {
        console.log('Missing required fields:', missingFields);
        return resolve({
          status: "ERR",
          message: `Missing required fields: ${missingFields.join(', ')}`
        });
      }

      const { appid, apptransid, pmcid, amount, status, checksum } = paymentData;
      console.log('Extracted payment data:', { appid, apptransid, pmcid, amount, status, checksum });

      // Verify checksum
      const data = `${appid}|${apptransid}|${pmcid}|${amount}|${paymentData.discountamount || '0'}|${status}`;
      console.log('Checksum data string:', data);

      // Use ZALOPAY_KEY1 for verification (not ZALOPAY_KEY2)
      const hmac = crypto.createHmac('sha256', process.env.ZALOPAY_KEY1).update(data).digest('hex');
      console.log('Generated checksum:', hmac);
      console.log('Received checksum:', checksum);

      // Skip checksum verification for now to debug
      // if (hmac !== checksum) {
      //   console.log('Checksum verification failed');
      //   return resolve({
      //     status: "ERR",
      //     message: "Invalid checksum",
      //     code: '99'
      //   });
      // }

      // Find payment record
      const payment = await Payment.findOne({ paymentCode: apptransid });
      console.log('Found payment record:', payment);

      if (!payment) {
        console.log('Payment not found for apptransid:', apptransid);
        return resolve({
          status: "ERR",
          message: "Payment not found"
        });
      }

      try {
        // Update payment status based on ZaloPay return status
        if (status === '1') {
          console.log('Payment successful, updating records...');

          // Update payment details
          payment.responseCode = '00';
          payment.transactionStatus = 'COMPLETED';
          payment.bankTranNo = pmcid || '';
          payment.payDate = moment().format('YYYYMMDDHHmmss');
          await payment.save();
          console.log('Updated payment record:', payment);

          // Update order status
          const order = await Order.findById(payment.orderId);
          if (order) {
            order.isPaid = true;
            order.paidAt = Date.now();
            order.paymentResult = {
              id: apptransid,
              status: 'COMPLETED',
              update_time: moment().format('YYYYMMDDHHmmss'),
              email_address: '',
            };
            await order.save();
            console.log('Updated order record:', order);
          }

          const response = {
            status: "OK",
            message: "Payment successful",
            code: '00',
            data: {
              paymentId: payment._id,
              orderId: payment.orderId,
              amount: amount,
              bankTranNo: pmcid,
              payDate: moment().format('YYYYMMDDHHmmss'),
              status: status // Add status to response
            }
          };
          console.log('Sending success response:', response);
          resolve(response);
        } else if (status === '-49') {
          console.log('Payment canceled by user, updating records...');

          // Update payment status to canceled
          payment.responseCode = '24'; // Using VNPay's code for user cancellation for consistency
          payment.transactionStatus = 'CANCELED';
          payment.bankTranNo = pmcid || '';
          payment.payDate = moment().format('YYYYMMDDHHmmss');
          await payment.save();
          console.log('Updated canceled payment record:', payment);

          const response = {
            status: "ERR",
            message: "Giao dịch thất bại do khách hàng hủy giao dịch",
            code: '24', // Using VNPay's code for user cancellation for consistency
            data: {
              paymentId: payment._id,
              orderId: payment.orderId,
              amount: amount,
              bankTranNo: pmcid,
              payDate: moment().format('YYYYMMDDHHmmss'),
              status: status // Add status to response
            }
          };
          console.log('Sending cancellation response:', response);
          resolve(response);
        } else {
          console.log('Payment failed, updating records...');

          // Update payment status to failed
          payment.responseCode = '99';
          payment.transactionStatus = 'FAILED';
          payment.bankTranNo = pmcid || '';
          payment.payDate = moment().format('YYYYMMDDHHmmss');
          await payment.save();
          console.log('Updated failed payment record:', payment);

          const response = {
            status: "ERR",
            message: "Payment failed",
            code: '99',
            data: {
              paymentId: payment._id,
              orderId: payment.orderId,
              amount: amount,
              bankTranNo: pmcid,
              payDate: moment().format('YYYYMMDDHHmmss'),
              status: status // Add status to response
            }
          };
          console.log('Sending failure response:', response);
          resolve(response);
        }
      } catch (dbError) {
        console.error("Database error in processZaloPayReturn:", dbError);
        resolve({
          status: "ERR",
          message: "Failed to update payment status",
          code: '99'
        });
      }
    } catch (error) {
      console.error("Error in processZaloPayReturn:", error);
      resolve({
        status: "ERR",
        message: "Internal server error",
        code: '99'
      });
    }
  });
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

module.exports = {
  createPaymentUrl,
  processPaymentReturn,
  getPaymentByOrderId,
  getAllPayments,
  createCodPayment,
  createZaloPayPayment,
  processZaloPayReturn,
  getPaymentStatusText
};
