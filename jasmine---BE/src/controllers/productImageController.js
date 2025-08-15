const productImage = require("../models/ProductImageModel");
const productImageService = require("../services/productImageService");

//create productImage

const createProductImg = async(req, res) => {
  console.log("req.file", req.body);
    try {
         // Thông tin file upload
        if (!req.body) {
          return res.status(400).json({
            status: "ERR",
            message: "The file input is required",
          });
        }
    
        // Giả sử bạn muốn trả về đường dẫn file sau khi upload
        const filePath = req.body;
    
        return res.status(200).json({
          status: "OK",
          message: "File uploaded successfully",
          data: {
            filePath,
          },
        });
      } catch (e) {
        return res.status(500).json({
          status: "ERR",
          message: e.message,
        });
      }
    };

//update productImage
const updateproductImage = async (req, res) => {
  try {
    const productImageId = req.params.id;
    const data = req.body;
    if (!productImageId) {
      return res.status(200).json({
        status: "ERR",
        message: "The productImageId is required",
      });
    }

    const response = await productImageService.updateproductImage(productImageId, data);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};

//delete productImage
const deleteproductImage = async (req, res) => {
  try {
    const productImageId = req.params.id;
    //const token = req.headers;

    if (!productImageId) {
      return res.status(200).json({
        status: "ERR",
        message: "The productImageId is required",
      });
    }

    const response = await productImageService.deleteproductImage(productImageId);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};

//get details productImage
const getDetailsproductImage = async (req, res) => {
  try {
    const productImageId = req.params.id;

    if (!productImageId) {
      return res.status(200).json({
        status: "ERR",
        message: "The productImageId is required",
      });
    }

    const response = await productImageService.getDetailsproductImage(productImageId);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};

//get all productImage
const getAllproductImage = async (req, res) => {
  try {
    const { limit, page, sort, filter } = req.query;
    const response = await productImageService.getAllproductImage(Number(limit) || 8, Number(page) || 0, sort, filter);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};

module.exports = {
    createProductImg,
  updateproductImage,
  deleteproductImage,
  getDetailsproductImage,
  getAllproductImage,
};
