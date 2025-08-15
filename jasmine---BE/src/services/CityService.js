const mongoose = require("mongoose");
const City = require("../models/CityModel");

// Tạo City
const createCity = async (newCity) => {
  try {
    const { cityCode, cityName } = newCity;

    // Kiểm tra dữ liệu đầu vào
    if (!cityCode || !cityName) {
      return {
        status: "ERR",
        message: "Missing required input: cityCode, cityName  ",
      };
    }

    // Kiểm tra trùng lặp CityCode hoặc CityName
    const existingCity = await City.findOne({
      $or: [{ cityCode }, { cityName }],
    });
    if (existingCity) {
      return {
        status: "ERR",
        message: "City with the same code or name already exists",
      };
    }

    // Tạo mới
    const createdCity = await City.create({
      cityCode,
      cityName,
    });
    return {
      status: "OK",
      message: "City created successfully",
      data: createdCity,
    };
  } catch (e) {
    return {
      status: "ERR",
      message: "Error creating City",
      details: e.message,
    };
  }
};

// Cập nhật City
const updateCity = async (id, data) => {
  try {
    // Kiểm tra định dạng ObjectID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return {
        status: "ERR",
        message: "Invalid City ID format",
      };
    }

    // Kiểm tra City tồn tại
    const existingCity = await City.findById(id);
    if (!existingCity) {
      return {
        status: "ERR",
        message: "City not found",
      };
    }

    // Kiểm tra dữ liệu cập nhật
    if (!data || Object.keys(data).length === 0) {
      return {
        status: "ERR",
        message: "No data provided for update",
      };
    }

    // Cập nhật
    const updatedCity = await City.findByIdAndUpdate(id, data, {
      new: true,
    });
    return {
      status: "OK",
      message: "City updated successfully",
      data: updatedCity,
    };
  } catch (e) {
    return {
      status: "ERR",
      message: "Error updating City",
      details: e.message,
    };
  }
};

// Xóa City
const deleteCity = async (id) => {
  try {
    // Kiểm tra định dạng ObjectID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return {
        status: "ERR",
        message: "Invalid City ID format",
      };
    }

    // Kiểm tra City tồn tại
    const existingCity = await City.findById(id);
    if (!existingCity) {
      return {
        status: "ERR",
        message: "City not found",
      };
    }

    // Xóa City
    await City.findByIdAndDelete(id);
    return {
      status: "OK",
      message: "City deleted successfully",
    };
  } catch (e) {
    return {
      status: "ERR",
      message: "Error deleting City",
      details: e.message,
    };
  }
};

// Lấy chi tiết City
const getDetailsCity = async (id) => {
  try {
    // Kiểm tra định dạng ObjectID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return {
        status: "ERR",
        message: "Invalid City ID format",
      };
    }

    const city = await City.findById(id);
    if (!city) {
      return {
        status: "ERR",
        message: "City not found",
      };
    }

    return {
      status: "OK",
      message: "City retrieved successfully",
      data: city,
    };
  } catch (e) {
    return {
      status: "ERR",
      message: "Error retrieving City",
      details: e.message,
    };
  }
};

// Lấy tất cả City
const getAllCity = async (limit, page, sort, filter) => {
  try {
    // Xử lý sort và filter
    let query = {};
    let sortQuery = {};

    if (filter && Array.isArray(filter) && filter.length === 2) {
      const [key, value] = filter;
      query[key] = { $regex: value, $options: "i" }; // Tìm kiếm không phân biệt hoa thường
    }

    if (sort && Array.isArray(sort) && sort.length === 2) {
      const [order, field] = sort;
      sortQuery[field] = order === "asc" ? 1 : -1;
    }

    // Pagination
    const totalCity = await City.countDocuments(query);
    const citys = await City.find(query)
      .sort(sortQuery)
      .skip(page * limit)
      .limit(limit);

    return {
      status: "OK",
      message: "All Citys retrieved successfully",
      data: citys,
      total: totalCity,
      pageCurrent: Number(page) + 1,
      totalPage: Math.ceil(totalCity / limit),
    };
  } catch (e) {
    return {
      status: "ERR",
      message: "Error retrieving Citys",
      details: e.message,
    };
  }
};

module.exports = {
  createCity,
  updateCity,
  deleteCity,
  getDetailsCity,
  getAllCity,
};
