const DistrictService = require("../services/DistrictService");

// Tạo District
const createDistrict = async (req, res) => {
  try {
    const { districtCode, districtName, cityCode } = req.body;

    if (!districtCode || !districtName || !cityCode) {
      return res.status(400).json({
        status: "ERR",
        message: "Missing required input: districtCode, districtName or cityCode",
      });
    }

    const response = await DistrictService.createDistrict(req.body);
    return res.status(201).json(response); // 201 cho tạo mới
  } catch (e) {
    return res.status(500).json({
      status: "ERR",
      message: "Internal Server Error",
      details: e.message,
    });
  }
};

// Cập nhật District
const updateDistrict = async (req, res) => {
  try {
    const districtId = req.params.id;
    const data = req.body;

    if (!districtId) {
      return res.status(400).json({
        status: "ERR",
        message: "District ID is required",
      });
    }

    const response = await DistrictService.updateDistrict(districtId, data);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(500).json({
      status: "ERR",
      message: "Internal Server Error",
      details: e.message,
    });
  }
};

// Xóa District
const deleteDistrict = async (req, res) => {
  try {
    const districtId = req.params.id;

    if (!districtId) {
      return res.status(400).json({
        status: "ERR",
        message: "District ID is required",
      });
    }

    const response = await DistrictService.deleteDistrict(districtId);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(500).json({
      status: "ERR",
      message: "Internal Server Error",
      details: e.message,
    });
  }
};

// Lấy chi tiết District
const getDetailsDistrict = async (req, res) => {
  try {
    const districtId = req.params.id;

    if (!districtId) {
      return res.status(400).json({
        status: "ERR",
        message: "District ID is required",
      });
    }

    const response = await DistrictService.getDetailsDistrict(districtId);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(500).json({
      status: "ERR",
      message: "Internal Server Error",
      details: e.message,
    });
  }
};

// Lấy danh sách District
const getAllDistrict = async (req, res) => {
  try {
    const { limit = 8, page = 0, sort, filter } = req.query;

    // Đảm bảo giá trị limit và page hợp lệ
    const pageNumber = Math.max(0, Number(page));
    const limitNumber = Math.max(1, Number(limit));

    const response = await DistrictService.getAllDistrict(
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
  createDistrict,
  updateDistrict,
  deleteDistrict,
  getDetailsDistrict,
  getAllDistrict,
};
