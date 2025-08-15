const Status = require("../models/StatusModel");

//tạo Status
const createStatus = (newStatus) => {
  return new Promise(async (resolve, reject) => {
    const { statusCode, statusName, statusDescription } = newStatus;

    try {
      //check tên Status
      const checkStatus = await Status.findOne({
        code: statusCode,
      });
      //nếu name Status đã tồn tại

      if (checkStatus !== null) {
        resolve({
          status: "OK",
          message: "The status code is already registered",
        });
      }

      const createdStatus = await Status.create({
        statusCode,
        statusName,
        statusDescription,
      });

      // console.log("createdStatus", createdStatus);

      if (createdStatus) {
        resolve({
          status: "OK",
          message: "Status successfully created",
          data: createdStatus,
        });
      }
    } catch (e) {
      if (e.code === 11000) {
        reject({
          status: "ERR",
          message: "The status code or name is already registered",
        });
      } else {
        reject({
          status: "ERR",
          message: "An error occurred while creating the status",
          error: e.message,
        });
      }
    }
  });
};

//update Status
const updateStatus = (id, data) => {
  return new Promise(async (resolve, reject) => {
    try {
      //check name created
      const checkStatus = await Status.findOne({
        _id: id,
      });
      //console.log("checkUser", checkUser);

      //nếu Status ko tồn tại
      if (checkStatus === null) {
        resolve({
          status: "OK",
          message: "The Status is not defined",
        });
      }

      const updatedStatus = await Status.findByIdAndUpdate(id, data, {
        new: true,
      });
      //console.log("updatedStatus", updatedStatus);
      resolve({
        status: "OK",
        message: "SUCCESS",
        data: updatedStatus,
      });
    } catch (e) {
      reject(e);
    }
  });
};

//delete Status
const deleteStatus = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      //check Status created
      const checkStatus = await Status.findById({ _id: id });
      // console.log("checkStatus", checkStatus);

      //nếu Status ko tồn tại
      if (checkStatus === null) {
        resolve({
          status: "OK",
          message: "The Status is not defined",
        });
      }

      await Status.findByIdAndDelete(id);
      //console.log("updatedStatus", updatedStatus);
      resolve({
        status: "OK",
        message: "DELETE Status IS SUCCESS",
      });
    } catch (e) {
      reject(e);
    }
  });
};

//get details Status
const getDetailsStatus = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const status = await Status.findOne({ _id: id });

      // console.log("status", status)

      if (!status) {
        resolve({
          status: "ERR",
          message: "The Status is not defined",
        });
      } else {
        resolve({
          status: "OK",
          message: "SUCCESS",
          data: status,
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};

//get all Status
//get all Status
const getAllStatus = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const allStatus = await Status.find(); // Lấy tất cả dữ liệu từ collection
      resolve({
        status: "OK",
        message: "Get all Status IS SUCCESS",
        data: allStatus,
      });
    } catch (e) {
      reject(e);
    }
  });
};

module.exports = {
  createStatus,
  updateStatus,
  deleteStatus,
  getDetailsStatus,
  getAllStatus,
};
