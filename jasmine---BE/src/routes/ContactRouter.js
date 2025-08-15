const express = require("express");
const router = express.Router();
const contactController = require("../controllers/ContactController");
const { authMiddleware, isAdminMiddleware } = require("../middleware/authMiddleware");

router.post("/create-contact", authMiddleware, isAdminMiddleware, contactController.createContact);

router.put("/update-contact/:id", authMiddleware, isAdminMiddleware, contactController.updateContact);

router.delete("/delete-contact/:id", authMiddleware, isAdminMiddleware, contactController.deleteContact);

router.get("/get-detail-contact/:id", contactController.getDetailsContact);

router.get("/get-all-contact", contactController.getAllContact);

router.post("/apply-contact", authMiddleware, contactController.applyContact);

router.post("/validate-contact", authMiddleware, contactController.validateContact);

router.patch("/toggle-contact-status/:id", authMiddleware, isAdminMiddleware, contactController.toggleContactStatus);


router.get("/user-contacts", authMiddleware, contactController.getUserContacts);

module.exports = router;
