const WardService = require("../services/WardService");

// Tạo ward
const createWard = async (req, res) => {
  try {
    const { wardCode, wardName, districtCode } = req.body;

    if (!wardCode || !wardName || !districtCode) {
      return res.status(400).json({
        status: "ERR",
        message: "Missing required input: wardCode, wardName, or districtCode",
      });
    }

    const response = await WardService.createWard(req.body);
    return res.status(201).json(response); // 201 cho tạo mới
  } catch (e) {
    return res.status(500).json({
      status: "ERR",
      message: "Internal Server Error",
      details: e.message,
    });
  }
};

// Cập nhật ward
const updateWard = async (req, res) => {
  try {
    const wardId = req.params.id;
    const data = req.body;

    if (!wardId) {
      return res.status(400).json({
        status: "ERR",
        message: "Ward ID is required",
      });
    }

    const response = await WardService.updateWard(wardId, data);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(500).json({
      status: "ERR",
      message: "Internal Server Error",
      details: e.message,
    });
  }
};

// Xóa ward
const deleteWard = async (req, res) => {
  try {
    const wardId = req.params.id;

    if (!wardId) {
      return res.status(400).json({
        status: "ERR",
        message: "Ward ID is required",
      });
    }

    const response = await WardService.deleteWard(wardId);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(500).json({
      status: "ERR",
      message: "Internal Server Error",
      details: e.message,
    });
  }
};

// Lấy chi tiết ward
const getDetailsWard = async (req, res) => {
  try {
    const wardId = req.params.id;

    if (!wardId) {
      return res.status(400).json({
        status: "ERR",
        message: "Ward ID is required",
      });
    }

    const response = await WardService.getDetailsWard(wardId);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(500).json({
      status: "ERR",
      message: "Internal Server Error",
      details: e.message,
    });
  }
};

// Lấy danh sách ward
const getAllWard = async (req, res) => {
  try {
    const { limit = 8, page = 0, sort, filter } = req.query;

    // Đảm bảo giá trị limit và page hợp lệ
    const pageNumber = Math.max(0, Number(page));
    const limitNumber = Math.max(1, Number(limit));

    const response = await WardService.getAllWard(
      limitNumber,
      pageNumber,
      sort,
      filter
    );
    return res.status(200).json(response);
  } catch (e) {
    return res.status(500).json({
      status: "ERR",
      message: "Internal Server Error",
      details: e.message,
    });
  }
};

module.exports = {
  createWard,
  updateWard,
  deleteWard,
  getDetailsWard,
  getAllWard,
};
