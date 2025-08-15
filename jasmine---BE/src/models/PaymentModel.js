const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
  {
    paymentCode: {
      type: String,
      required: true,
      unique: true, // Mã giao dịch VNPay (vnp_TxnRef)
    },
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order", // Liên kết với đơn hàng
      required: true,
    },
    amount: {
      type: Number,
      required: true, // Số tiền thanh toán
    },
    paymentMethod: {
      type: String,
      enum: ['VNPAY', 'COD', 'ZALOPAY', 'OTHER'],
      default: 'VNPAY',
      required: true, // Phương thức thanh toán
    },
    bankCode: {
      type: String,
      required: false, // Mã ngân hàng VNPay (vnp_BankCode)
    },
    bankTranNo: {
      type: String,
      required: false, // Mã giao dịch tại ngân hàng (vnp_BankTranNo)
    },
    cardType: {
      type: String,
      required: false, // Loại thẻ thanh toán (vnp_CardType)
    },
    orderInfo: {
      type: String,
      required: false, // Thông tin đơn hàng (vnp_OrderInfo)
    },
    payDate: {
      type: String,
      required: false, // Thời gian thanh toán (vnp_PayDate) định dạng yyyyMMddHHmmss
    },
    responseCode: {
      type: String,
      required: false, // Mã phản hồi (vnp_ResponseCode), 00 = thành công
    },
    transactionStatus: {
      type: String,
      required: false, // Trạng thái giao dịch (vnp_TransactionStatus), 00 = thành công
    },
    txnRef: {
      type: String,
      required: false, // Mã tham chiếu giao dịch (vnp_TxnRef)
    },
    secureHash: {
      type: String,
      required: false, // Mã hash xác thực (vnp_SecureHash)
    }
  },
  {
    timestamps: true, // Tự động thêm createdAt và updatedAt
  }
);

const Payment = mongoose.model("Payment", paymentSchema);
module.exports = Payment;
