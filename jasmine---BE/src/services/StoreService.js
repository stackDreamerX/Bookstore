const mongoose = require("mongoose");
const Store = require("../models/StoreModel");

// Tạo Store
const createStore = async (newStore) => {
  try {
    const { storeCode, storeName, storePhone, storeEmail, storeAddress } =
      newStore;

    // Kiểm tra dữ liệu đầu vào
    if (
      !storeCode ||
      !storeName ||
      !storePhone ||
      !storeEmail ||
      !storeAddress
    ) {
      return {
        status: "ERR",
        message:
          "Missing required input: storeCode, storeName, storePhone, storeEmail, or storeAddress",
      };
    }

    // Kiểm tra trùng lặp storeCode hoặc storeEmail
    const existingStore = await Store.findOne({
      $or: [{ storeCode }, { storeEmail }],
    });
    if (existingStore) {
      return {
        status: "ERR",
        message: "Store with the same code or email already exists",
      };
    }

    // Tạo mới
    const createdStore = await Store.create(newStore);
    return {
      status: "OK",
      message: "Store created successfully",
      data: createdStore,
    };
  } catch (e) {
    return {
      status: "ERR",
      message: "Error creating Store",
      details: e.message,
    };
  }
};

// Cập nhật Store
const updateStore = async (id, data) => {
  try {
    // Kiểm tra định dạng ObjectID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return {
        status: "ERR",
        message: "Invalid Store ID format",
      };
    }

    // Kiểm tra Store tồn tại
    const existingStore = await Store.findById(id);
    if (!existingStore) {
      return {
        status: "ERR",
        message: "Store not found",
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
    const updatedStore = await Store.findByIdAndUpdate(id, data, { new: true });
    return {
      status: "OK",
      message: "Store updated successfully",
      data: updatedStore,
    };
  } catch (e) {
    return {
      status: "ERR",
      message: "Error updating Store",
      details: e.message,
    };
  }
};

// Xóa Store
const deleteStore = async (id) => {
  try {
    // Kiểm tra định dạng ObjectID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return {
        status: "ERR",
        message: "Invalid Store ID format",
      };
    }

    // Kiểm tra Store tồn tại
    const existingStore = await Store.findById(id);
    if (!existingStore) {
      return {
        status: "ERR",
        message: "Store not found",
      };
    }

    // Xóa Store
    await Store.findByIdAndDelete(id);
    return {
      status: "OK",
      message: "Store deleted successfully",
    };
  } catch (e) {
    return {
      status: "ERR",
      message: "Error deleting Store",
      details: e.message,
    };
  }
};

// Lấy chi tiết Store
const getDetailsStore = async (id) => {
  try {
    // Kiểm tra định dạng ObjectID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return {
        status: "ERR",
        message: "Invalid Store ID format",
      };
    }

    const store = await Store.findById(id).populate([
      { path: "storeAddress.ward" },
      { path: "storeAddress.district" },
      { path: "storeAddress.city" },
    ]);

    if (!store) {
      return {
        status: "ERR",
        message: "Store not found",
      };
    }

    return {
      status: "OK",
      message: "Store retrieved successfully",
      data: store,
    };
  } catch (e) {
    return {
      status: "ERR",
      message: "Error retrieving Store",
      details: e.message,
    };
  }
};

// Lấy tất cả Store
const getAllStores = async (limit, page, sort, filter) => {
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
    const totalStores = await Store.countDocuments(query);
    const stores = await Store.find(query)
      .sort(sortQuery)
      .skip(page * limit)
      .limit(limit);

    return {
      status: "OK",
      message: "All Stores retrieved successfully",
      data: stores,
      total: totalStores,
      pageCurrent: Number(page) + 1,
      totalPage: Math.ceil(totalStores / limit),
    };
  } catch (e) {
    return {
      status: "ERR",
      message: "Error retrieving Stores",
      details: e.message,
    };
  }
};

// Lấy danh sách Store theo loại
const getStoresByType = async (type) => {
  try {
    const stores = await Store.find({ storeType: type });

    return {
      status: "OK",
      message: `Found ${stores.length} stores of type ${type}`,
      data: stores,
    };
  } catch (e) {
    return {
      status: "ERR",
      message: "Error retrieving Stores by type",
      details: e.message,
    };
  }
};

module.exports = {
  createStore,
  updateStore,
  deleteStore,
  getDetailsStore,
  getAllStores,
  getStoresByType,
};
