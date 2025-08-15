const mongoose = require("mongoose");
const CityService = require("../services/CityService");

// Tạo City
const createCity = async (req, res) => {
  try {
    const { cityCode, cityName } = req.body;

    if (!cityCode || !cityName) {
      return res.status(400).json({
        status: "ERR",
        message: "Missing required input: cityCode or cityName",
      });
    }

    const response = await CityService.createCity(req.body);
    return res.status(201).json(response); // 201 cho tạo mới
  } catch (e) {
    return res.status(500).json({
      status: "ERR",
      message: "Internal Server Error",
      details: e.message,
    });
  }
};

// Cập nhật City
const updateCity = async (req, res) => {
  try {
    const cityId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(cityId)) {
      return res.status(400).json({
        status: "ERR",
        message: "Invalid City ID format",
      });
    }

    const data = req.body;

    if (!data || Object.keys(data).length === 0) {
      return res.status(400).json({
        status: "ERR",
        message: "No data provided for update",
      });
    }

    const response = await CityService.updateCity(cityId, data);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(500).json({
      status: "ERR",
      message: "Internal Server Error",
      details: e.message,
    });
  }
};

// Xóa City
const deleteCity = async (req, res) => {
  try {
    const cityId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(cityId)) {
      return res.status(400).json({
        status: "ERR",
        message: "Invalid City ID format",
      });
    }

    const response = await CityService.deleteCity(cityId);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(500).json({
      status: "ERR",
      message: "Internal Server Error",
      details: e.message,
    });
  }
};

// Lấy chi tiết City
const getDetailsCity = async (req, res) => {
  try {
    const cityId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(cityId)) {
      return res.status(400).json({
        status: "ERR",
        message: "Invalid City ID format",
      });
    }

    const response = await CityService.getDetailsCity(cityId);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(500).json({
      status: "ERR",
      message: "Internal Server Error",
      details: e.message,
    });
  }
};

// Lấy danh sách City
const getAllCity = async (req, res) => {
  try {
    const { limit = 8, page = 0, sort, filter } = req.query;

    // Đảm bảo giá trị limit và page hợp lệ
    const pageNumber = Math.max(0, parseInt(page, 10) || 0);
    const limitNumber = Math.max(1, parseInt(limit, 10) || 8);

    const response = await CityService.getAllCity(
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
  createCity,
  updateCity,
  deleteCity,
  getDetailsCity,
  getAllCity,
};
