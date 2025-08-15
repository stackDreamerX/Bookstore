const StoreService = require("../services/StoreService");

// Create Store
const createStore = async (req, res) => {
  try {
    const { storeCode, storeName, storePhone, storeEmail, storeAddress } =
      req.body;

    if (
      !storeCode ||
      !storeName ||
      !storePhone ||
      !storeEmail ||
      !storeAddress
    ) {
      return res.status(400).json({
        status: "ERR",
        message: "Missing required fields",
      });
    }

    const response = await StoreService.createStore(req.body);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(500).json({
      status: "ERR",
      message: e.message,
    });
  }
};

// Update Store
const updateStore = async (req, res) => {
  try {
    const storeId = req.params.id;

    if (!storeId) {
      return res.status(400).json({
        status: "ERR",
        message: "Store ID is required",
      });
    }

    const response = await StoreService.updateStore(storeId, req.body);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(500).json({
      status: "ERR",
      message: e.message,
    });
  }
};

// Delete Store
const deleteStore = async (req, res) => {
  try {
    const storeId = req.params.id;

    if (!storeId) {
      return res.status(400).json({
        status: "ERR",
        message: "Store ID is required",
      });
    }

    const response = await StoreService.deleteStore(storeId);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(500).json({
      status: "ERR",
      message: e.message,
    });
  }
};

// Get Details Store
const getDetailsStore = async (req, res) => {
  try {
    const storeId = req.params.id;

    if (!storeId) {
      return res.status(400).json({
        status: "ERR",
        message: "Store ID is required",
      });
    }

    const response = await StoreService.getDetailStore(storeId);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(500).json({
      status: "ERR",
      message: e.message,
    });
  }
};

// Get All Stores
const getAllStores = async (req, res) => {
  try {
    const { limit, page, sort, filterKey, filterValue } = req.query;

    const filter = filterKey && filterValue ? { [filterKey]: filterValue } : {};

    const response = await StoreService.getAllStores(
      Number(limit) || 10,
      Number(page) || 0,
      sort,
      filter
    );
    return res.status(200).json(response);
  } catch (e) {
    return res.status(500).json({
      status: "ERR",
      message: e.message,
    });
  }
};

// Toggle Store Active
const toggleStoreActive = async (req, res) => {
  try {
    const storeId = req.params.id;

    if (!storeId) {
      return res.status(400).json({
        status: "ERR",
        message: "Store ID is required",
      });
    }

    const response = await StoreService.toggleStoreStatus(storeId);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(500).json({
      status: "ERR",
      message: e.message,
    });
  }
};

const getStoresByType = async (req, res) => {
  try {
    const { type } = req.params; // Lấy type từ params

    if (!type) {
      return res.status(400).json({
        status: "ERR",
        message: "Store type is required",
      });
    }

    // Gọi service để lấy danh sách cửa hàng theo loại
    const response = await StoreService.getStoresByType(type);

    // Trả về kết quả
    return res.status(200).json(response);
  } catch (e) {
    return res.status(500).json({
      status: "ERR",
      message: e.message,
    });
  }
};

module.exports = {
  createStore,
  updateStore,
  deleteStore,
  getDetailsStore,
  getAllStores,
  toggleStoreActive,
  getStoresByType,
};
