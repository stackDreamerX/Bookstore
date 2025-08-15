const express = require("express");
const router = express.Router();
const bankController = require("../controllers/BankController");
const { authMiddleware } = require("../middleware/authMiddleware");

// Tạo ngân hàng (chỉ cho quản trị viên)
router.post("/create-bank", authMiddleware, bankController.createBank);

// Cập nhật ngân hàng (yêu cầu quyền hạn)
router.put("/update-bank/:id", authMiddleware, bankController.updateBank);

// Xóa ngân hàng (yêu cầu quyền hạn)
router.delete("/delete-bank/:id", authMiddleware, bankController.deleteBank);

// Lấy chi tiết ngân hàng (công khai hoặc bảo mật tùy nhu cầu)
router.get("/get-detail-bank/:id", bankController.getDetailsBank);

// Lấy danh sách tất cả ngân hàng (hỗ trợ phân trang và lọc)
router.get("/get-all-bank", bankController.getAllBank);

// Kiểm tra trạng thái ngân hàng (nếu cần)
router.get(
  "/check-bank-status/:id",
  authMiddleware,
  bankController.checkBankStatus
);

module.exports = router;
