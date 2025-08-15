const IntroduceService = require("../services/IntroduceService");

//create Introduce
const createIntroduce = async (req, res) => {
  try {
    //test input data
    const {
      introduceCode,
      introduceName,
      introduceTitle,
      introduceContent
    } = req.body;
    //console.log("req.body", req.body);

    if (
      !introduceCode ||
      !introduceName ||
      !introduceContent ||
      !introduceTitle 
    ) {
      //check have
      return res.status(200).json({
        status: "ERR",
        message: "The input is required",
      });
    }

    const response = await IntroduceService.createIntroduce(req.body);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};

//update Introduce
const updateIntroduce = async (req, res) => {
  try {
    const IntroduceId = req.params.id;
    if (!IntroduceId) {
      return res.status(400).json({
        status: "ERR",
        message: "Introduce ID is required",
      });
    }
    const response = await IntroduceService.updateIntroduce(IntroduceId, req.body);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(400).json({
      status: "ERR",
      message: e.message,
    });
  }
};

//delete Introduce
const deleteIntroduce = async (req, res) => {
  try {
    const IntroduceId = req.params.id;
    if (!IntroduceId) {
      return res.status(400).json({
        status: "ERR",
        message: "Introduce ID is required",
      });
    }
    const response = await IntroduceService.deleteIntroduce(IntroduceId);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(400).json({
      status: "ERR",
      message: e.message,
    });
  }
};

//get details Introduce
const getDetailsIntroduce = async (req, res) => {
  try {
    const IntroduceId = req.params.id;
    if (!IntroduceId) {
      return res.status(400).json({
        status: "ERR",
        message: "Introduce ID is required",
      });
    }
    const response = await IntroduceService.getDetailsIntroduce(IntroduceId);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(400).json({
      status: "ERR",
      message: e.message,
    });
  }
};

//get all Introduce
const getAllIntroduce = async (req, res) => {
  try {
    const { limit, page, sort, filter } = req.query;
    const response = await IntroduceService.getAllIntroduce(
      Number(limit) || 8,
      Number(page) || 0,
      sort,
      filter
    );
    return res.status(200).json(response);
  } catch (e) {
    return res.status(400).json({
      status: "ERR",
      message: e.message,
    });
  }
};

// Áp dụng mã giảm giá vào đơn hàng
const applyIntroduce = async (req, res) => {
  try {
    const { IntroduceCode, totalPrice } = req.body;
    if (!IntroduceCode || !totalPrice) {
      return res.status(400).json({
        status: "ERR",
        message: "Introduce code and total price are required",
      });
    }
    const response = await IntroduceService.applyIntroduce(
      IntroduceCode,
      
    );
    return res.status(200).json(response);
  } catch (e) {
    return res.status(400).json({
      status: "ERR",
      message: e.message,
    });
  }
};

// Kiểm tra tính hợp lệ của mã giảm giá
const validateIntroduce = async (req, res) => {
  try {
    const { IntroduceCode } = req.body;
    if (!IntroduceCode) {
      return res.status(400).json({
        status: "ERR",
        message: "Introduce code is required",
      });
    }
    const response = await IntroduceService.validateIntroduce(IntroduceCode);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(400).json({
      status: "ERR",
      message: e.message,
    });
  }
};

// Kích hoạt hoặc vô hiệu hóa mã giảm giá
const toggleIntroduceStatus = async (req, res) => {
  try {
    const IntroduceId = req.params.id;
    if (!IntroduceId) {
      return res.status(400).json({
        status: "ERR",
        message: "Introduce ID is required",
      });
    }
    const response = await IntroduceService.toggleIntroduceStatus(IntroduceId);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(400).json({
      status: "ERR",
      message: e.message,
    });
  }
};

//lấy mã giảm giá cho ng dùng cụ thể
const getUserIntroduces = async (req, res) => {
  try {
    const userId = req.user.id; // Lấy ID người dùng từ token (do `authMiddleware` cung cấp)

    // Gọi service để lấy danh sách mã giảm giá dành riêng cho người dùng
    const response = await IntroduceService.getUserIntroduces(userId);

    return res.status(200).json({
      status: "OK",
      data: response,
    });
  } catch (e) {
    return res.status(400).json({
      status: "ERR",
      message: e.message,
    });
  }
};

module.exports = {
  createIntroduce,
  updateIntroduce,
  deleteIntroduce,
  getDetailsIntroduce,
  getAllIntroduce,
  applyIntroduce,
  validateIntroduce,
  toggleIntroduceStatus,
  getUserIntroduces,
};
