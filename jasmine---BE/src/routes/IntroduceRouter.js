const express = require("express");
const router = express.Router();
const introduceController = require("../controllers/IntroduceController");
const { authMiddleware, isAdminMiddleware } = require("../middleware/authMiddleware");

// Tạo mới Introduce (chỉ Admin)
router.post("/create-introduce", authMiddleware, isAdminMiddleware, introduceController.createIntroduce);

// Cập nhật Introduce (chỉ Admin)
router.put("/update-introduce/:id", authMiddleware, isAdminMiddleware, introduceController.updateIntroduce);

// Xóa Introduce (chỉ Admin)
router.delete("/delete-introduce/:id", authMiddleware, isAdminMiddleware, introduceController.deleteIntroduce);

// Lấy chi tiết Introduce
router.get("/get-detail-introduce/:id", introduceController.getDetailsIntroduce);

// Lấy danh sách tất cả Introduces (hỗ trợ phân trang, lọc, sắp xếp)
router.get("/get-all-introduce", introduceController.getAllIntroduce);

router.post("/apply-introduce", authMiddleware, introduceController.applyIntroduce);

router.post("/validate-introduce", authMiddleware, introduceController.validateIntroduce);

router.patch("/toggle-introduce-status/:id", authMiddleware, isAdminMiddleware, introduceController.toggleIntroduceStatus);


router.get("/user-introduces", authMiddleware, introduceController.getUserIntroduces);

module.exports = router;
