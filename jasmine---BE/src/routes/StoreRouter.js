const express = require("express");
const router = express.Router();
const storeController = require("../controllers/StoreController");
const { authMiddleware } = require("../middleware/authMiddleware");

// Tạo cửa hàng mới
router.post("/create-store", authMiddleware, storeController.createStore);

// Cập nhật thông tin cửa hàng
router.put("/update-store/:id", authMiddleware, storeController.updateStore);

// Xóa cửa hàng
router.delete("/delete-store/:id", authMiddleware, storeController.deleteStore);

// Lấy thông tin chi tiết cửa hàng
router.get("/get-detail-store/:id", storeController.getDetailsStore);

// Lấy danh sách cửa hàng
router.get("/get-all-stores", storeController.getAllStores);

// Kích hoạt/Ngừng hoạt động cửa hàng
router.patch(
  "/toggle-store-active/:id",
  authMiddleware,
  storeController.toggleStoreActive
);

// Lọc cửa hàng theo loại (ví dụ: cửa hàng chính, chi nhánh)
router.get("/get-stores-by-type/:type", storeController.getStoresByType);

module.exports = router;
