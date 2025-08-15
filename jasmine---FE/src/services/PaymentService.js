import axios from "axios";

// Create VNPay payment
export const createPayment = async (data) => {
  try {
    const res = await axios.post(
      `${process.env.REACT_APP_API_URL_BACKEND}/payment/create`,
      data,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return res.data;
  } catch (error) {
    if (error.response) {
      throw {
        message: error.response.data?.message || "Đã xảy ra lỗi khi tạo thanh toán.",
      };
    } else {
      throw {
        status: 500,
        message: "Không thể kết nối đến máy chủ."
      };
    }
  }
};

// Get VNPay payment result
export const getPaymentResult = async (params) => {
  try {
    const res = await axios.get(
      `${process.env.REACT_APP_API_URL_BACKEND}/payment/vnpay-return`,
      { params }
    );
    return res.data;
  } catch (error) {
    if (error.response) {
      throw {
        message: error.response.data?.message || "Đã xảy ra lỗi khi xác thực thanh toán.",
      };
    } else {
      throw {
        status: 500,
        message: "Không thể kết nối đến máy chủ."
      };
    }
  }
};

// Get payment by order ID
export const getPaymentByOrderId = async (orderId) => {
  try {
    const res = await axios.get(
      `${process.env.REACT_APP_API_URL_BACKEND}/payment/order/${orderId}`
    );
    return res.data;
  } catch (error) {
    if (error.response) {
      throw {
        message: error.response.data?.message || "Không tìm thấy thông tin thanh toán.",
      };
    } else {
      throw {
        status: 500,
        message: "Không thể kết nối đến máy chủ."
      };
    }
  }
};

// Process COD payment
export const processCodPayment = async (data) => {
  try {
    const res = await axios.post(
      `${process.env.REACT_APP_API_URL_BACKEND}/payment/process-cod`,
      data,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return res.data;
  } catch (error) {
    if (error.response) {
      throw {
        message: error.response.data?.message || "Đã xảy ra lỗi khi xử lý thanh toán COD.",
      };
    } else {
      throw {
        status: 500,
        message: "Không thể kết nối đến máy chủ."
      };
    }
  }
};

// ZaloPay Payment Service
export const createZaloPayPayment = async (data) => {
  try {
    const response = await axios.post(
      `${process.env.REACT_APP_API_URL_BACKEND}/payment/create-zalopay`,
      data
    );
    return response.data;
  } catch (error) {
    console.error('Error creating ZaloPay payment:', error);
    throw error;
  }
};

// Verify ZaloPay payment result
export const verifyZaloPayPayment = async (params) => {
  try {
    const response = await axios.get(
      `${process.env.REACT_APP_API_URL_BACKEND}/payment/zalopay-result`,
      { params }
    );
    return response.data;
  } catch (error) {
    console.error('Error verifying ZaloPay payment:', error);
    throw error;
  }
};