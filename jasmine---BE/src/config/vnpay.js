const vnpayConfig = {
  vnp_TmnCode: "GZ0QCN45", // Replace with your actual TMN Code
  vnp_HashSecret: "ERM5MEBB5PUMN4HA7JMNTI4UMBI0DWQJ", // Replace with your actual Hash Secret
  vnp_Url: "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html",
  vnp_Api: "https://sandbox.vnpayment.vn/merchant_webapi/api/transaction",
  vnp_ReturnUrl: "http://localhost:3000/payment/result", // Frontend URL to handle return
  vnp_IpnUrl: "http://localhost:3001/api/payment/ipn" // Backend URL for IPN
};

module.exports = vnpayConfig;