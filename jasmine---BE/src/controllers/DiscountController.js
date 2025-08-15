const DiscountService = require("../services/DiscountService");

//create discount
const createDiscount = async (req, res) => {
  try {
    //test input data
    const {
      discountCode,
      discountName,
      discountValue,
      applicableCategory,
      discountStartDate,
      discountEndDate,
    } = req.body;
    //console.log("req.body", req.body);

    if (
      !discountCode ||
      !discountName ||
      !discountValue ||
      !applicableCategory ||
      !req.file||
      !discountStartDate ||
      !discountEndDate 
    ) {
      //check have
      return res.status(400).json({
        status: "ERR",
        message: "The input is required",
      });
    }
    const discountImage= req.file.path;
    const newDiscount={
      discountCode,
      discountName,
      discountValue,
      applicableCategory,
      discountImage,
      discountStartDate,
      discountEndDate,
    }
    console.log("NEW", newDiscount)
    const response = await DiscountService.createDiscount(newDiscount);
    console.log("NEW1")
    return res.status(200).json(response);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};

//update discount
const updateDiscount = async (req, res) => {
  try {
    const discountId = req.params.id;
    if (!discountId) {
      return res.status(400).json({
        status: "ERR",
        message: "Discount ID is required",
      });
    }
    const response = await DiscountService.updateDiscount(discountId, req.body);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(400).json({
      status: "ERR",
      message: e.message,
    });
  }
};

//delete discount
const deleteDiscount = async (req, res) => {
  try {
    const discountId = req.params.id;
    if (!discountId) {
      return res.status(400).json({
        status: "ERR",
        message: "Discount ID is required",
      });
    }
    const response = await DiscountService.deleteDiscount(discountId);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(400).json({
      status: "ERR",
      message: e.message,
    });
  }
};

//get details discount
const getDetailsDiscount = async (req, res) => {
  try {
    const discountId = req.params.id;
    if (!discountId) {
      return res.status(400).json({
        status: "ERR",
        message: "Discount ID is required",
      });
    }
    const response = await DiscountService.getDetailsDiscount(discountId);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(400).json({
      status: "ERR",
      message: e.message,
    });
  }
};

//get all discount

const getAllDiscount = async (req, res) => {
  try {
    
    const { limit, page, sort, filter } = req.query;

    const response = await DiscountService.getAllDiscount(
      Number(limit),
      Number(page) ,
      sort,
      filter
    );
    return res.status(200).json(response);
  } catch (e) {console.log(e)
    return res.status(500).json({
      message: e.message || "Something went wrong",
      
    });
  }
};

// Áp dụng mã giảm giá vào đơn hàng
const applyDiscount = async (req, res) => {
  try {
    const { discountCode, totalPrice } = req.body;
    if (!discountCode || !totalPrice) {
      return res.status(400).json({
        status: "ERR",
        message: "Discount code and total price are required",
      });
    }
    const response = await DiscountService.applyDiscount(
      discountCode,
      totalPrice
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
const validateDiscount = async (req, res) => {
  try {
    const { discountCode } = req.body;
    if (!discountCode) {
      return res.status(400).json({
        status: "ERR",
        message: "Discount code is required",
      });
    }
    const response = await DiscountService.validateDiscount(discountCode);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(400).json({
      status: "ERR",
      message: e.message,
    });
  }
};

// Kích hoạt hoặc vô hiệu hóa mã giảm giá
const toggleDiscountStatus = async (req, res) => {
  try {
    const discountId = req.params.id;
    if (!discountId) {
      return res.status(400).json({
        status: "ERR",
        message: "Discount ID is required",
      });
    }
    const response = await DiscountService.toggleDiscountStatus(discountId);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(400).json({
      status: "ERR",
      message: e.message,
    });
  }
};

//lấy mã giảm giá cho ng dùng cụ thể
const getUserDiscounts = async (req, res) => {
  try {
    const userId = req.user.id; // Lấy ID người dùng từ token (do `authMiddleware` cung cấp)

    // Gọi service để lấy danh sách mã giảm giá dành riêng cho người dùng
    const response = await DiscountService.getUserDiscounts(userId);

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
  createDiscount,
  updateDiscount,
  deleteDiscount,
  getDetailsDiscount,
  getAllDiscount,
  applyDiscount,
  validateDiscount,
  toggleDiscountStatus,
  getUserDiscounts,
};
