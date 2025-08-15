const Bank = require("../models/BankModel");

// Tạo Bank
const createBank = (newBank) => {
  return new Promise(async (resolve, reject) => {
    try {
      const { bankCode, bankName, bankBranch, bankLogo, isActive } = newBank;

      const checkBank = await Bank.findOne({ name: bankName });
      if (checkBank) {
        return resolve({
          status: "ERR",
          message: "The name of Bank is already used",
        });
      }

      const createdBank = await Bank.create({
        bankCode,
        bankName,
        bankBranch,
        bankLogo,
        isActive,
      });
      resolve({
        status: "OK",
        message: "Bank created successfully",
        data: createdBank,
      });
    } catch (e) {
      reject(e);
    }
  });
};

// Cập nhật Bank
const updateBank = (id, data) => {
  return new Promise(async (resolve, reject) => {
    try {
      const existingBank = await Bank.findById(id);
      if (!existingBank) {
        return resolve({
          status: "ERR",
          message: "The bank does not exist",
        });
      }

      if (!existingBank.isActive) {
        return resolve({
          status: "ERR",
          message: "The bank is not active",
        });
      }

      const updatedBank = await Bank.findByIdAndUpdate(id, data, { new: true });
      resolve({
        status: "OK",
        message: "Bank updated successfully",
        data: updatedBank,
      });
    } catch (e) {
      reject(e);
    }
  });
};

// Xóa Bank
const deleteBank = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const existingBank = await Bank.findById(id);
      if (!existingBank) {
        return resolve({
          status: "ERR",
          message: "The bank does not exist",
        });
      }

      if (!existingBank.isActive) {
        return resolve({
          status: "ERR",
          message: "Cannot delete an inactive bank",
        });
      }

      await Bank.findByIdAndDelete(id);
      resolve({
        status: "OK",
        message: "Bank deleted successfully",
      });
    } catch (e) {
      reject(e);
    }
  });
};

// Lấy chi tiết Bank
const getDetailsBank = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const bank = await Bank.findById(id);
      if (!bank) {
        return resolve({
          status: "ERR",
          message: "The bank does not exist",
        });
      }

      if (!bank.isActive) {
        return resolve({
          status: "ERR",
          message: "The bank is not active",
        });
      }

      resolve({
        status: "OK",
        message: "Bank details retrieved successfully",
        data: bank,
      });
    } catch (e) {
      reject(e);
    }
  });
};

// Lấy tất cả Bank
const getAllBank = (limit, page, sort, filter) => {
  return new Promise(async (resolve, reject) => {
    try {
      const query = { isActive: true };
      const totalBank = await Bank.countDocuments(query);

      if (filter) {
        const [field, value] = filter.split(":");
        query[field] = { $regex: value, $options: "i" };
      }

      const banks = await Bank.find(query)
        .sort(
          sort
            ? { [sort.split(":")[1]]: sort.split(":")[0] === "asc" ? 1 : -1 }
            : {}
        )
        .limit(limit)
        .skip(page * limit);

      resolve({
        status: "OK",
        message: "Banks retrieved successfully",
        data: banks,
        total: totalBank,
        currentPage: Number(page + 1),
        totalPages: Math.ceil(totalBank / limit),
      });
    } catch (e) {
      reject(e);
    }
  });
};

// Kiểm tra trạng thái của Bank
const checkBankStatus = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const bank = await Bank.findById(id);
      if (!bank) {
        return resolve({
          status: "ERR",
          message: "The bank does not exist",
        });
      }

      resolve({
        status: "OK",
        message: "Bank status retrieved successfully",
        isActive: bank.isActive,
      });
    } catch (e) {
      reject(e);
    }
  });
};

module.exports = {
  createBank,
  updateBank,
  deleteBank,
  getDetailsBank,
  getAllBank,
  checkBankStatus,
};
