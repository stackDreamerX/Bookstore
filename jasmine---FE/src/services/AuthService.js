import axios from "axios";

export const axiosJWT = axios.create();

// Gửi yêu cầu OTP để quên mật khẩu
export const forgotPassword = async (email) => {
  try {
    const res = await axios.post(
      `${process.env.REACT_APP_API_URL_BACKEND}/auth/forgot-password`,
      { email }
    );
    return res.data;
  } catch (error) {
    if (error.response) {
      throw {
        message: error.response.data?.message || "Đã xảy ra lỗi.",
      };
    } else {
      throw { message: "Không thể kết nối đến máy chủ." };
    }
  }
};

// Xác thực OTP
// Xác thực OTP
export const verifyOTP = async (email, otp) => {
  try {
    const res = await axios.post(
      `${process.env.REACT_APP_API_URL_BACKEND}/auth/verify-otp`,
      { email, otp }
    );
    return res.data;
  } catch (error) {
    if (error.response) {
      throw {
        message: error.response.data?.message || "Đã xảy ra lỗi.",
      };
    } else {
      throw { message: "Không thể kết nối đến máy chủ." };
    }
  }
};

// Đặt lại mật khẩu mới
export const resetPassword = async (email, newPassword) => {
  try {
    const res = await axios.post(
      `${process.env.REACT_APP_API_URL_BACKEND}/auth/reset-password`,
      { email, newPassword }
    );
    return res.data;
  } catch (error) {
    if (error.response) {
      throw {
        message: error.response.data?.message || "Đã xảy ra lỗi.",
      };
    } else {
      throw { message: "Không thể kết nối đến máy chủ." };
    }
  }
};

// Đăng nhập bằng Google
export const loginWithGoogle = async (token) => {
  try {
    const res = await axios.post(
      `${process.env.REACT_APP_API_URL_BACKEND}/auth/login/google`,
      { token }
    );
    return res.data;
  } catch (error) {
    if (error.response) {
      throw {
        message: error.response.data?.message || "Đã xảy ra lỗi.",
      };
    } else {
      throw { message: "Không thể kết nối đến máy chủ." };
    }
  }
};

// Đăng nhập bằng Facebook
export const loginWithFacebook = async (token) => {
  try {
    const res = await axios.post(
      `${process.env.REACT_APP_API_URL_BACKEND}/auth/login/facebook`,
      { token }
    );
    return res.data;
  } catch (error) {
    if (error.response) {
      throw {
        message: error.response.data?.message || "Đã xảy ra lỗi.",
      };
    } else {
      throw { message: "Không thể kết nối đến máy chủ." };
    }
  }
};
