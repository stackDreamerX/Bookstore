const News = require("../models/NewsModel");

// Tạo News
const createNews = (newNews) => {
  return new Promise(async (resolve, reject) => {
    try {
      const {
        newsTitle,
        newsContent,
        newsImage,
      } = newNews;

      // Check for duplicate productCode or productName
      const checkNews = await News.findOne({
        $or: [ { newsTitle }],
      });

      if (checkNews) {
        return resolve({
          status: "ERR",
          message: "News already exists.",
        });
      }

      const createdNews = await News.create(newNews);

      resolve({
        status: "OK",
        message: "News created successfully",
        data: createdNews,
      });
    } catch (e) {
      reject({
        status: "ERR",
        message: e.message || "Failed to create product",
      });
    }
  });
};

// Cập nhật News
const updateNews = (id, data) => {
  return new Promise(async (resolve, reject) => {
    try {
      const existingNews = await News.findById(id);
      if (!existingNews) {
        return resolve({
          status: "ERR",
          message: "The News does not exist",
        });
      }

      const updatedNews = await News.findByIdAndUpdate(id, data, { new: true });
      resolve({
        status: "OK",
        message: "News updated successfully",
        data: updatedNews,
      });
    } catch (e) {
      reject(e);
    }
  });
};

// Xóa News
const deleteNews = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const existingNews = await News.findById(id);
      if (!existingNews) {
        return resolve({
          status: "ERR",
          message: "The News does not exist",
        });
      }

      await News.findByIdAndDelete(id);
      resolve({
        status: "OK",
        message: "News deleted successfully",
      });
    } catch (e) {
      reject(e);
    }
  });
};

// Lấy chi tiết News
const getDetailsNews = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const newsDetails = await News.findById(id);
      if (!newsDetails) {
        return resolve({
          status: "ERR",
          message: "The News does not exist",
        });
      }

      resolve({
        status: "OK",
        message: "News details retrieved successfully",
        data: newsDetails,
      });
    } catch (e) {
      reject(e);
    }
  });
};

// Lấy tất cả News
const getAllNews = (limit, page, sort, filter) => {
  return new Promise(async (resolve, reject) => {
    try {
      const query = {};
      if (filter) {
        const [field, value] = filter.split(":");
        query[field] = { $regex: value, $options: "i" };
      }

      const totalNews = await News.countDocuments(query);
      const newsList = await News.find(query)
        .sort(
          sort
            ? { [sort.split(":")[1]]: sort.split(":")[0] === "asc" ? 1 : -1 }
            : {}
        )
        .limit(Number(limit))
        .skip(Number(page) * Number(limit));

      resolve({
        status: "OK",
        message: "News retrieved successfully",
        data: newsList,
        total: totalNews,
        currentPage: Number(page) + 1,
        totalPages: Math.ceil(totalNews / limit),
      });
    } catch (e) {
      reject(e);
    }
  });
};

// Kiểm tra trạng thái của News
const checkNewsStatus = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const newsDetails = await News.findById(id);
      if (!newsDetails) {
        return resolve({
          status: "ERR",
          message: "The News does not exist",
        });
      }

      resolve({
        status: "OK",
        message: "News status retrieved successfully",
        isActive: newsDetails.isActive,
      });
    } catch (e) {
      reject(e);
    }
  });
};

// Cập nhật trạng thái News
const updateStatusNews = (id, isActive) => {
  return new Promise(async (resolve, reject) => {
    try {
      const updatedNews = await News.findByIdAndUpdate(
        id,
        { isActive },
        { new: true }
      );
      if (!updatedNews) {
        return resolve({
          status: "ERR",
          message: "The News does not exist",
        });
      }

      resolve({
        status: "OK",
        message: "News status updated successfully",
        data: updatedNews,
      });
    } catch (e) {
      reject(e);
    }
  });
};

module.exports = {
  createNews,
  updateNews,
  deleteNews,
  getDetailsNews,
  getAllNews,
  checkNewsStatus,
  updateStatusNews,
};
