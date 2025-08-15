const authService = require("../services/AuthService");

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: "Email is require!" });
    }

    const result = await authService.forgotPassword(email);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ message: error.message || "Server error!" });
  }
};

const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) {
      return res.status(400).json({ message: "Email is require!" });
    }

    const result = await authService.verifyOTP(email, otp);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ message: error.message || "Server error!" });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { email, newPassword } = req.body;
    const result = await authService.resetPassword(email, newPassword);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const loginWithGoogle = async (req, res) => {
  try {
    const { token } = req.body; // Token từ Google
    const result = await authService.loginWithGoogle(token);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const loginWithFacebook = async (req, res) => {
  try {
    const { token } = req.body; // Token từ Facebook
    const result = await authService.loginWithFacebook(token);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  forgotPassword,
  verifyOTP,
  resetPassword,
  loginWithGoogle,
  loginWithFacebook,
};
