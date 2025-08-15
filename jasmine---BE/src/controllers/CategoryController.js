const CategoryService = require("../services/CategoryService"); // Đảm bảo đường dẫn đúng

// Tạo loại sách mới
const createCategory = async (req, res) => {
  try {
    const { categoryCode, categoryName } = req.body;

    // Kiểm tra dữ liệu nhập vào
    if (!categoryCode || !categoryName) {
      return res.status(400).json({
        status: "ERR",
        message: "All fields are required", // Trả về lỗi nếu thiếu categoryCode hoặc categoryName
      });
    }

    // Gọi service để tạo category mới
    const response = await CategoryService.createCategory({ categoryCode, categoryName });
    return res.status(200).json(response); // Trả về kết quả thành công

  } catch (e) {
    // Trả về lỗi nếu có exception
    return res.status(500).json({
      status: "ERR",
      message: e.message || "Something went wrong", // Nếu có lỗi khác, trả về lỗi 500
    });
  }
};

// Cập nhật thông tin loại sách
const updateCategory = async (req, res) => {
  try {
    const categoryId = req.params.id;
    const data = req.body;

    if (!categoryId) {
      return res.status(400).json({
        status: "ERR",
        message: "The CategoryId is required", // Kiểm tra CategoryId
      });
    }

    const response = await CategoryService.updateCategory(categoryId, data);
    return res.status(200).json(response); // Trả về kết quả thành công
  } catch (e) {
    return res.status(500).json({
      status: "ERR",
      message: e.message || "Something went wrong",
    });
  }
};

// Xóa loại sách
const deleteCategory = async (req, res) => {
  try {
    const categoryId = req.params.id;

    if (!categoryId) {
      return res.status(400).json({
        status: "ERR",
        message: "The CategoryId is required", // Kiểm tra CategoryId
      });
    }

    const response = await CategoryService.deleteCategory(categoryId);
    return res.status(200).json(response); // Trả về kết quả thành công
  } catch (e) {
    return res.status(500).json({
      status: "ERR",
      message: e.message || "Something went wrong",
    });
  }
};

// Lấy thông tin chi tiết loại sách
const getDetailsCategory = async (req, res) => {
  try {
    const categoryId = req.params.id;

    if (!categoryId) {
      return res.status(400).json({
        status: "ERR",
        message: "The CategoryId is required", // Kiểm tra CategoryId
      });
    }

    const response = await CategoryService.getDetailsCategory(categoryId);
    if (!response) {
      return res.status(404).json({
        status: "ERR",
        message: "Category not found", // Nếu không tìm thấy category
      });
    }

    return res.status(200).json(response); // Trả về kết quả thành công
  } catch (e) {
    return res.status(500).json({
      status: "ERR",
      message: e.message || "Something went wrong",
    });
  }
};

// Lấy danh sách tất cả loại sách
const getAllCategory = async (req, res) => {
  try {
    const { limit, page, sort, filter } = req.query;

    const response = await CategoryService.getAllCategory(
      Number(limit) || 10,
      Number(page) || 0,
      sort,
      filter
    );

    return res.status(200).json(response); // Trả về danh sách loại sách
  } catch (e) {
    return res.status(500).json({
      status: "ERR",
      message: e.message || "Something went wrong",
    });
  }
};

module.exports = {
  createCategory,
  updateCategory,
  deleteCategory,
  getDetailsCategory,
  getAllCategory,
};
