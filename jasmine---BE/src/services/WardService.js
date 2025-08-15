const Ward = require("../models/WardModel");

// Tạo Ward
const createWard = (newWard) => {
  return new Promise(async (resolve, reject) => {
    try {
      const { wardCode, wardName, districtCode } = newWard;

      // Kiểm tra trùng tên
      const existingWard = await Ward.findOne({ wardName });
      if (existingWard) {
        return resolve({
          status: "ERR",
          message: "The name of the Ward already exists",
        });
      }

      // Tạo mới
      const createdWard = await Ward.create({
        wardCode,
        wardName,
        districtCode,
      });
      resolve({
        status: "OK",
        message: "Ward created successfully",
        data: createdWard,
      });
    } catch (e) {
      reject({
        status: "ERR",
        message: "Error creating Ward",
        details: e.message,
      });
    }
  });
};

// Cập nhật Ward
const updateWard = (id, data) => {
  return new Promise(async (resolve, reject) => {
    try {
      // Kiểm tra Ward tồn tại
      const existingWard = await Ward.findById(id);
      if (!existingWard) {
        return resolve({
          status: "ERR",
          message: "Ward not found",
        });
      }

      // Cập nhật
      const updatedWard = await Ward.findByIdAndUpdate(id, data, { new: true });
      resolve({
        status: "OK",
        message: "Ward updated successfully",
        data: updatedWard,
      });
    } catch (e) {
      reject({
        status: "ERR",
        message: "Error updating Ward",
        details: e.message,
      });
    }
  });
};

// Xóa Ward
const deleteWard = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      // Kiểm tra Ward tồn tại
      const existingWard = await Ward.findById(id);
      if (!existingWard) {
        return resolve({
          status: "ERR",
          message: "Ward not found",
        });
      }

      // Xóa Ward
      await Ward.findByIdAndDelete(id);
      resolve({
        status: "OK",
        message: "Ward deleted successfully",
      });
    } catch (e) {
      reject({
        status: "ERR",
        message: "Error deleting Ward",
        details: e.message,
      });
    }
  });
};

// Lấy chi tiết Ward
const getDetailsWard = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const ward = await Ward.findById(id);
      if (!ward) {
        return resolve({
          status: "ERR",
          message: "Ward not found",
        });
      }

      resolve({
        status: "OK",
        message: "Ward retrieved successfully",
        data: ward,
      });
    } catch (e) {
      reject({
        status: "ERR",
        message: "Error retrieving Ward",
        details: e.message,
      });
    }
  });
};

// Lấy tất cả Ward
const getAllWard = (limit, page, sort, filter) => {
  return new Promise(async (resolve, reject) => {
    try {
      // Query cơ bản
      let query = {};
      let sortQuery = {};

      // Áp dụng filter
      if (filter) {
        const [key, value] = filter;
        query[key] = { $regex: value, $options: "i" };
      }

      // Áp dụng sort
      if (sort) {
        const [order, field] = sort;
        sortQuery[field] = order === "asc" ? 1 : -1;
      }

      // Lấy dữ liệu
      const totalWard = await Ward.countDocuments(query);
      const wards = await Ward.find(query)
        .sort(sortQuery)
        .skip(page * limit)
        .limit(limit);

      resolve({
        status: "OK",
        message: "All Wards retrieved successfully",
        data: wards,
        total: totalWard,
        pageCurrent: Number(page) + 1,
        totalPage: Math.ceil(totalWard / limit),
      });
    } catch (e) {
      reject({
        status: "ERR",
        message: "Error retrieving Wards",
        details: e.message,
      });
    }
  });
};

module.exports = {
  createWard,
  updateWard,
  deleteWard,
  getDetailsWard,
  getAllWard,
};
