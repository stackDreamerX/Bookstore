const ContactService = require("../services/ContactService");

//create Contact
const createContact = async (req, res) => {
  try {
    //test input data
    const {
        contactCode,
        contactName,
        contactPhone,
        contactEmail,
        contactAddress,
        ContactImage,
        contactType,
        isActive,
    } = req.body;
    //console.log("req.body", req.body);

    if (
        !contactCode||
        !contactName||
        !contactPhone||
        !contactEmail||
        !contactAddress||
        !ContactImage||
        !contactType||
        !isActive
    ) {
      //check have
      return res.status(200).json({
        status: "ERR",
        message: "The input is required",
      });
    }

    const response = await ContactService.createContact(req.body);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};

//update Contact
const updateContact = async (req, res) => {
  try {
    const ContactId = req.params.id;
    if (!ContactId) {
      return res.status(400).json({
        status: "ERR",
        message: "Contact ID is required",
      });
    }
    const response = await ContactService.updateContact(ContactId, req.body);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(400).json({
      status: "ERR",
      message: e.message,
    });
  }
};

//delete Contact
const deleteContact = async (req, res) => {
  try {
    const ContactId = req.params.id;
    if (!ContactId) {
      return res.status(400).json({
        status: "ERR",
        message: "Contact ID is required",
      });
    }
    const response = await ContactService.deleteContact(ContactId);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(400).json({
      status: "ERR",
      message: e.message,
    });
  }
};

//get details Contact
const getDetailsContact = async (req, res) => {
  try {
    const ContactId = req.params.id;
    if (!ContactId) {
      return res.status(400).json({
        status: "ERR",
        message: "Contact ID is required",
      });
    }
    const response = await ContactService.getDetailsContact(ContactId);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(400).json({
      status: "ERR",
      message: e.message,
    });
  }
};

//get all Contact
const getAllContact = async (req, res) => {
  try {
    const { limit, page, sort, filter } = req.query;
    const response = await ContactService.getAllContact(
      Number(limit) || 8,
      Number(page) || 0,
      sort,
      filter
    );
    return res.status(200).json(response);
  } catch (e) {
    return res.status(400).json({
      status: "ERR",
      message: e.message,
    });
  }
};

// Áp dụng mã giảm giá vào đơn hàng
const applyContact = async (req, res) => {
  try {
    const { ContactCode, totalPrice } = req.body;
    if (!ContactCode || !totalPrice) {
      return res.status(400).json({
        status: "ERR",
        message: "Contact code and total price are required",
      });
    }
    const response = await ContactService.applyContact(
      ContactCode,
      totalPrice
    );
    return res.status(200).json(response);
  } catch (e) {
    return res.status(400).json({
      status: "ERR",
      message: e.message,
    });
  }
};

// Kiểm tra tính hợp lệ của mã giảm giá
const validateContact = async (req, res) => {
  try {
    const { ContactCode } = req.body;
    if (!ContactCode) {
      return res.status(400).json({
        status: "ERR",
        message: "Contact code is required",
      });
    }
    const response = await ContactService.validateContact(ContactCode);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(400).json({
      status: "ERR",
      message: e.message,
    });
  }
};

// Kích hoạt hoặc vô hiệu hóa mã giảm giá
const toggleContactStatus = async (req, res) => {
  try {
    const ContactId = req.params.id;
    if (!ContactId) {
      return res.status(400).json({
        status: "ERR",
        message: "Contact ID is required",
      });
    }
    const response = await ContactService.toggleContactStatus(ContactId);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(400).json({
      status: "ERR",
      message: e.message,
    });
  }
};

//lấy mã giảm giá cho ng dùng cụ thể
const getUserContacts = async (req, res) => {
  try {
    const userId = req.user.id; // Lấy ID người dùng từ token (do `authMiddleware` cung cấp)

    // Gọi service để lấy danh sách mã giảm giá dành riêng cho người dùng
    const response = await ContactService.getUserContacts(userId);

    return res.status(200).json({
      status: "OK",
      data: response,
    });
  } catch (e) {
    return res.status(400).json({
      status: "ERR",
      message: e.message,
    });
  }
};

module.exports = {
  createContact,
  updateContact,
  deleteContact,
  getDetailsContact,
  getAllContact,
  applyContact,
  validateContact,
  toggleContactStatus,
  getUserContacts,
};
