const NewsService = require("../services/NewsService");
const uploadCloudinary= require("../Helper/UploadCloudinary")
const News = require("../models/NewsModel");
//const Joi = require("joi");

// // Helper function: Handle errors
// const handleError = (res, error) => {
//   return res.status(500).json({
//     status: "ERR",
//     message: error.message || "Internal Server Error",
//     stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
//   });
// };

// // Helper function: Validate params
// const validateId = (id) => {
//   return Joi.string()
//     .regex(/^[0-9a-fA-F]{24}$/)
//     .validate(id);
// };

const createNews = async (req, res) => {


  // Lấy body của request
  const { body } = req;
  console.log("body", body); // In ra đối tượng body

  try {
    const {
      newsTitle,
      newsContent
    } = req.body;

    if (
      !newsTitle||
      !newsContent||
      !req.file
     )

     {

       return res.status(400).json({
         status: "ERR",
         message: "All fields are required",
       });
     }
     const newsImage= req.file.path;

    //console.log("req1233", req.body)

    // Kiểm tra input


    const newNews = {
      newsTitle,
      newsContent,
      newsImage
    };

    const response = await NewsService.createNews(newNews);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(500).json({
      message: e.message || "Something went wrong",
    });
  }
};

// Cập nhật thông tin sản phẩm
const updateNews = async (req, res) => {
  try {
    const newsId = req.params.id;
    console.log("ID",newsId)
    const data = req.body;
    console.log("data", data);
    if (!newsId) {
      return res.status(200).json({
        status: "ERR",
        message: "The newsId is required",
      });
    }

    const response = await ProductService.updateNews(newsId, data);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(500).json({
      message: e.message || "Something went wrong",
    });
  }
};

// Xóa sản phẩm
const deleteNews = async (req, res) => {
  try {
    const newsId = req.params.id;
    console.log("ID", newsId)
    if (!newsId) {
      return res.status(200).json({
        status: "ERR",
        message: "The newsId is required",
      });

    }
    // const imagePublicId = product.productImage.split("/").pop().split(".")[0]; // Assuming image URL follows Cloudinary format
    // await cloudinary.uploader.destroy(imagePublicId);
    // console.log("IMG", imagePublicId)
    const response = await NewsService.deleteNews(newsId);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(500).json({
      message: e.message || "Something went wrong",
    });
  }
};

// Lấy thông tin chi tiết sản phẩm
const getDetailsNews = async (req, res) => {
  try {
    const newsId = req.params.id;

    if (!newsId) {
      return res.status(200).json({
        status: "ERR",
        message: "The productId is required",
      });
    }

    const response = await NewsService.getDetailsNews(newsId);
    if (!response) {
      return res.status(404).json({
        status: "ERR",
        message: "Product not found",
      });
    }

    return res.status(200).json(response);
  } catch (e) {
    return res.status(500).json({
      message: e.message || "Something went wrong",
    });
  }
};

// Lấy danh sách tất cả sản phẩm
const getAllNews = async (req, res) => {
  try {
    const { limit, page, sort, filter } = req.query;

    const response = await NewsService.getAllNews(
      Number(limit),
      Number(page) ,
      sort,
      filter
    );
    return res.status(200).json(response);
  } catch (e) {
    return res.status(500).json({
      message: e.message || "Something went wrong",
    });
  }
};

module.exports = {
  createNews,
  updateNews,
  deleteNews,
  getDetailsNews,
  getAllNews,
};

