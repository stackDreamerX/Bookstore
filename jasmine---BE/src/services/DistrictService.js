const mongoose = require("mongoose");
const District = require("../models/DistrictModel");

// Tạo District
const createDistrict = async (newDistrict) => {
  try {
    const { districtCode, districtName, cityCode } = newDistrict;

    // Kiểm tra dữ liệu đầu vào
    if (!districtCode || !districtName || !cityCode) {
      return {
        status: "ERR",
        message:
          "Missing required input: districtCode, districtName, or cityCode",
      };
    }

    // Kiểm tra trùng lặp districtCode hoặc districtName
    const existingDistrict = await District.findOne({
      $or: [{ districtCode }, { districtName }],
    });
    if (existingDistrict) {
      return {
        status: "ERR",
        message: "District with the same code or name already exists",
      };
    }

    // Tạo mới
    const createdDistrict = await District.create({
      districtCode,
      districtName,
      cityCode,
    });
    return {
      status: "OK",
      message: "District created successfully",
      data: createdDistrict,
    };
  } catch (e) {
    return {
      status: "ERR",
      message: "Error creating District",
      details: e.message,
    };
  }
};

// Cập nhật District
const updateDistrict = async (id, data) => {
  try {
    // Kiểm tra định dạng ObjectID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return {
        status: "ERR",
        message: "Invalid District ID format",
      };
    }

    // Kiểm tra District tồn tại
    const existingDistrict = await District.findById(id);
    if (!existingDistrict) {
      return {
        status: "ERR",
        message: "District not found",
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
    const updatedDistrict = await District.findByIdAndUpdate(id, data, {
      new: true,
    });
    return {
      status: "OK",
      message: "District updated successfully",
      data: updatedDistrict,
    };
  } catch (e) {
    return {
      status: "ERR",
      message: "Error updating District",
      details: e.message,
    };
  }
};

// Xóa District
const deleteDistrict = async (id) => {
  try {
    // Kiểm tra định dạng ObjectID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return {
        status: "ERR",
        message: "Invalid District ID format",
      };
    }

    // Kiểm tra District tồn tại
    const existingDistrict = await District.findById(id);
    if (!existingDistrict) {
      return {
        status: "ERR",
        message: "District not found",
      };
    }

    // Xóa District
    await District.findByIdAndDelete(id);
    return {
      status: "OK",
      message: "District deleted successfully",
    };
  } catch (e) {
    return {
      status: "ERR",
      message: "Error deleting District",
      details: e.message,
    };
  }
};

// Lấy chi tiết District
const getDetailsDistrict = async (id) => {
  try {
    // Kiểm tra định dạng ObjectID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return {
        status: "ERR",
        message: "Invalid District ID format",
      };
    }

    const district = await District.findById(id);
    if (!district) {
      return {
        status: "ERR",
        message: "District not found",
      };
    }

    return {
      status: "OK",
      message: "District retrieved successfully",
      data: district,
    };
  } catch (e) {
    return {
      status: "ERR",
      message: "Error retrieving District",
      details: e.message,
    };
  }
};

// Lấy tất cả District
const getAllDistrict = async (limit, page, sort, filter) => {
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
    const totalDistrict = await District.countDocuments(query);
    const districts = await District.find(query)
      .sort(sortQuery)
      .skip(page * limit)
      .limit(limit);

    return {
      status: "OK",
      message: "All Districts retrieved successfully",
      data: districts,
      total: totalDistrict,
      pageCurrent: Number(page) + 1,
      totalPage: Math.ceil(totalDistrict / limit),
    };
  } catch (e) {
    return {
      status: "ERR",
      message: "Error retrieving Districts",
      details: e.message,
    };
  }
};

module.exports = {
  createDistrict,
  updateDistrict,
  deleteDistrict,
  getDetailsDistrict,
  getAllDistrict,
};
