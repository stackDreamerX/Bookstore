const BankService = require("../services/BankService");
const Joi = require("joi");

// Helper function: Handle errors
const handleError = (res, error) => {
  return res.status(500).json({
    status: "ERR",
    message: error.message || "Internal Server Error",
    stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
  });
};

// Create Bank
const createBank = async (req, res) => {
  const schema = Joi.object({
    bankCode: Joi.string().required(),
    bankName: Joi.string().required(),
    bankBranch: Joi.string().required(),
    bankLogo: Joi.string().uri().required(),
    isActive: Joi.boolean().required(),
  });

  const { error, value } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({
      status: "ERR",
      message: error.details[0].message,
    });
  }

  try {
    const response = await BankService.createBank(value);
    return res.status(201).json(response);
  } catch (e) {
    return handleError(res, e);
  }
};

// Update Bank
const updateBank = async (req, res) => {
  const schema = Joi.object({
    bankCode: Joi.string(),
    bankName: Joi.string(),
    bankBranch: Joi.string(),
    bankLogo: Joi.string().uri(),
    isActive: Joi.boolean(),
  });

  const { error, value } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({
      status: "ERR",
      message: error.details[0].message,
    });
  }

  try {
    const bankId = req.params.id;
    if (!bankId) {
      return res.status(400).json({
        status: "ERR",
        message: "The bankId is required",
      });
    }

    const response = await BankService.updateBank(bankId, value);
    if (!response) {
      return res.status(404).json({
        status: "ERR",
        message: "Bank not found",
      });
    }

    return res.status(200).json(response);
  } catch (e) {
    return handleError(res, e);
  }
};

// Delete Bank
const deleteBank = async (req, res) => {
  try {
    const bankId = req.params.id;
    if (!bankId) {
      return res.status(400).json({
        status: "ERR",
        message: "The bankId is required",
      });
    }

    const response = await BankService.deleteBank(bankId);
    if (!response) {
      return res.status(404).json({
        status: "ERR",
        message: "Bank not found",
      });
    }

    return res.status(200).json({
      status: "OK",
      message: "Bank deleted successfully",
    });
  } catch (e) {
    return handleError(res, e);
  }
};

// Get Details of a Bank
const getDetailsBank = async (req, res) => {
  try {
    const bankId = req.params.id;
    if (!bankId) {
      return res.status(400).json({
        status: "ERR",
        message: "The bankId is required",
      });
    }

    const response = await BankService.getDetailsBank(bankId);
    if (!response) {
      return res.status(404).json({
        status: "ERR",
        message: "Bank not found",
      });
    }

    return res.status(200).json(response);
  } catch (e) {
    return handleError(res, e);
  }
};

// Get All Banks
const getAllBank = async (req, res) => {
  try {
    const { limit, page, sort, filter } = req.query;

    const response = await BankService.getAllBank(
      Number(limit) || 10,
      Number(page) || 0,
      sort,
      filter
    );

    return res.status(200).json(response);
  } catch (e) {
    return handleError(res, e);
  }
};

// Check Bank Status
const checkBankStatus = async (req, res) => {
  try {
    const bankId = req.params.id;
    if (!bankId) {
      return res.status(400).json({
        status: "ERR",
        message: "The bankId is required",
      });
    }

    const response = await BankService.checkBankStatus(bankId);
    if (!response) {
      return res.status(404).json({
        status: "ERR",
        message: "Bank not found",
      });
    }

    return res.status(200).json(response);
  } catch (e) {
    return handleError(res, e);
  }
};

module.exports = {
  createBank,
  updateBank,
  deleteBank,
  getDetailsBank,
  getAllBank,
  checkBankStatus,
};
