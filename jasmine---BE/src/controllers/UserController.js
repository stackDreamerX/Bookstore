const UserServices = require("../services/UserServices");
const JwtService = require("../services/JwtService");
const validator = require("validator");

//tạo tài khoản
const createUser = async (req, res) => {
  try {
    // console.log(req.body);
    //test input data
    const {
      familyName,
      userName,
      userPhone,
      userEmail,
      userPassword,
      userConfirmPassword,
      userAddress,
      userWard,
      userDistrict,
      userCity,
      userImage,
      isAdmin,
    } = req.body;

    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/; //check email
    const isValidEmail = emailPattern.test(userEmail);
    if (
      !familyName ||
      !userName ||
      !userPhone ||
      !userEmail ||
      !userPassword ||
      !userConfirmPassword
      // !userAddress ||
      // !userRole
    ) {
      //check have
      return res.status(200).json({
        status: "ERR",
        message: "The input is required",
      });
    } else if (!isValidEmail) {
      return res.status(200).json({
        status: "ERR",
        message: "The input is not email",
      });
    } else if (userPassword !== userConfirmPassword) {
      return res.status(200).json({
        status: "ERR",
        message: "The password is not equal confirmPassword",
      });
    }

    // console.log("isValidEmail ", isValidEmail);

    const response = await UserServices.createUser(req.body);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};

//đăng nhập
const loginUser = async (req, res) => {
  try {
    // console.log(req.body);
    //test input data
    const {
      // familyName,
      // userName,
      // userPhone,
      userEmail,
      userPassword,
      // userConfirmPassword,
      // userAddress,
      // userImage,
      // userRole,
    } = req.body;
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/; //check email
    const isValidEmail = emailPattern.test(userEmail);
    if (
      // !familyName ||
      // !userName ||
      // !userPhone ||
      !userEmail ||
      !userPassword
      // !userConfirmPassword ||
      // !userAddress ||
      // !userImage
    ) {
      //check have
      return res.status(400).json({
        status: "ERR",
        message: "Email and password are required",
      });
    } else if (!isValidEmail) {
      return res.status(200).json({
        status: "ERR",
        message: "The input is not email",
      });
      // } else if (password !== userConfirmPassword) {
      //   return res.status(200).json({
      //     status: "ERR",
      //     message: "The password is not equal confirmPassword",
      //   });
    }

    // console.log("isValidEmail ", isValidEmail);

    const response = await UserServices.loginUser(req.body);
    const { refresh_token, ...newResponse } = response;

    // console.log("response", response);
    res.cookie("refresh_token", refresh_token, {
      httpOnly: true,
      secure: false,
      sameSite: "Strict",
    });

    if (!response) {
      return res
        .status(500)
        .json({ status: "ERR", message: "Internal Server Error" });
    }
    return res.status(200).json(newResponse);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};

//đăng xuất
const logoutUser = async (req, res) => {
  try {
    res.clearCookie("refresh_token");
    return res.status(200).json({
      status: "OK",
      message: "Log out successfully",
    });
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};

//update user
const updateUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const data = req.body;
    if (!userId) {
      return res.status(200).json({
        status: "ERR",
        message: "The userId is required",
      });
    }

    //console.log("userId", userId);
    const response = await UserServices.updateUser(userId, data);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};

//delete user
const deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;
    //const token = req.headers;

    if (!userId) {
      return res.status(200).json({
        status: "ERR",
        message: "The userId is required",
      });
    }

    const response = await UserServices.deleteUser(userId);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};

//get info user
const getAllUser = async (req, res) => {
  try {
    const { limit, page } = req.query;
    const response = await UserServices.getAllUser(Number(limit), Number(page));
    return res.status(200).json(response);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};

//get detail user
const getDetailsUser = async (req, res) => {
  try {
    const userId = req.params.id;

    if (!userId) {
      return res.status(200).json({
        status: "ERR",
        message: "The userId is required",
      });
    }

    const response = await UserServices.getDetailsUser(userId);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};

//cấp token mới
const refreshToken = async (req, res) => {
  console.log("req.cookies", req.cookies);
  console.log("req.cookies.refresh_token", req.cookies.refresh_token);

  try {
    const token = req.cookies.refresh_token;

    if (!token) {
      return res.status(200).json({
        status: "ERR",
        message: "The token is required",
      });
    }

    const response = await JwtService.refreshTokenJwtService(token);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(200).json({
        status: "ERR",
        message: "The email is required",
      });
    }
    const response = await UserServices.forgotPassword(email);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;
    if (!token || !newPassword) {
      return res.status(200).json({
        status: "ERR",
        message: "The token and new password are required",
      });
    }
    const response = await UserServices.resetPassword(token, newPassword);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};

const changePassword = async (req, res) => {
  try {
    const userId = req.user.id;
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
      return res.status(200).json({
        status: "ERR",
        message: "The old password and new password are required",
      });
    }

    const response = await UserServices.changePassword(
      userId,
      oldPassword,
      newPassword
    );
    return res.status(200).json(response);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};

const updateAvatar = async (req, res) => {
  try {
    const userId = req.user.id;
    const { avatarUrl } = req.body;

    if (!avatarUrl) {
      return res.status(200).json({
        status: "ERR",
        message: "The avatar URL is required",
      });
    }

    const response = await UserServices.updateAvatar(userId, avatarUrl);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};

const updateUserRole = async (req, res) => {
  try {
    const userId = req.params.id;
    const { userRole } = req.body;

    if (!userRole) {
      return res.status(200).json({
        status: "ERR",
        message: "The userRole is required",
      });
    }

    const response = await UserServices.updateUserRole(userId, userRole);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};

// Lấy lịch sử đơn hàng của người dùng
const getOrderHistory = async (req, res) => {
  try {
    const userId = req.user._id; // Lấy ID người dùng từ token đã xác thực
    const response = await UserServices.getOrderHistory(userId);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};

// Lấy chi tiết đơn hàng
const getOrderDetails = async (req, res) => {
  try {
    const { orderId } = req.params;
    if (!orderId) {
      return res.status(400).json({
        status: "ERR",
        message: "The orderId is required",
      });
    }

    const response = await UserServices.getOrderDetails(orderId);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};

// Lấy tất cả tin tức
const getAllNews = async (req, res) => {
  try {
    const response = await UserServices.getAllNews();
    return res.status(200).json(response);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};

// Lấy thông tin giới thiệu
const getIntroduce = async (req, res) => {
  try {
    const response = await UserServices.getIntroduce();
    return res.status(200).json(response);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};

module.exports = {
  createUser,
  loginUser,
  updateUser,
  deleteUser,
  getAllUser,
  getDetailsUser,
  refreshToken,
  forgotPassword,
  resetPassword,
  changePassword,
  updateUserRole,
  updateAvatar,
  getOrderHistory,
  getOrderDetails,
  getAllNews,
  getIntroduce,
  logoutUser,
};
