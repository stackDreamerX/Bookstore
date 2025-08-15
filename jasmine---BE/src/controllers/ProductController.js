const Product = require("../models/ProductModel");
const ProductService = require("../services/ProductService");
const uploadCloudinary= require("../Helper/UploadCloudinary")

// Tạo sản phẩm mới
const createProduct = async (req, res) => {
  
 
  // Lấy body của request
  const { body } = req;
  console.log("body", body); // In ra đối tượng body
  
  try {
    const {
     // productCode,
      productName,
      productPrice,
      productCategory,
      bookFormat,
      author,
      publisher,
      publicationDate,
      ISBN,
      pageCount,
      language,
      //productQuantity,
      productDescription,
    } = req.body;

    if (
       !productName ||
       !productPrice ||
       !req.file ||
       !productCategory ||
       !bookFormat ||
       !author ||
       !publisher ||
       !productDescription
     ) 
    
     {
       
       return res.status(400).json({
         status: "ERR",
         message: "All fields are required",
       });
     }
     const productImage= req.file.path;
    
    // Kiểm tra input
   

    const newProduct = {
      productName,
      productPrice,
      productImage,
      productCategory,
      bookFormat,
      author,
      publisher,
      publicationDate,
      ISBN,
      pageCount,
      language,
      productDescription,
    };

    const response = await ProductService.createProduct(newProduct);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(500).json({
      message: e.message || "Something went wrong",
    });
  }
};

// Cập nhật thông tin sản phẩm
const updateProduct = async (req, res) => {
  try {
    const productId = req.params.id;

    if (!productId) {
      return res.status(400).json({
        status: "ERR",
        message: "The productId is required",
      });
    }

    const data = req.body;

    // Kiểm tra nếu có file mới để upload
    if (req.file) {
      data.productImage = req.file.path; // Lưu URL ảnh mới từ Cloudinary
    }

    const response = await ProductService.updateProduct(productId, data);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(500).json({
      message: e.message || "Something went wrong",
    });
  }
};


// Xóa sản phẩm
const deleteProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    console.log("ID", productId)
    if (!productId) {
      return res.status(200).json({
        status: "ERR",
        message: "The productId is required",
      });
      
    }
    // const imagePublicId = product.productImage.split("/").pop().split(".")[0]; // Assuming image URL follows Cloudinary format
    // await cloudinary.uploader.destroy(imagePublicId);
    // console.log("IMG", imagePublicId)
    const response = await ProductService.deleteProduct(productId);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(500).json({
      message: e.message || "Something went wrong",
    });
  }
};

// Lấy thông tin chi tiết sản phẩm
const getDetailsProduct = async (req, res) => {
  try {
    const productId = req.params.id;

    if (!productId) {
      return res.status(200).json({
        status: "ERR",
        message: "The productId is required",
      });
    }

    const response = await ProductService.getDetailsProduct(productId);
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
const getAllProduct = async (req, res) => {
  try {
    const { limit, page, sort, filter } = req.query;

    const response = await ProductService.getAllProduct(
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

// Tìm kiếm sản phẩm
const searchProducts = async (req, res) => {
  try {
    const { search } = req.query; // Lấy từ khóa tìm kiếm từ query parameters
    if (!search) {
      return res.status(400).json({
        status: "ERR",
        message: "Search query is required",
      });
    }

    const response = await ProductService.searchProducts(search); // Gọi hàm searchProducts từ ProductService
    return res.status(200).json(response);
  } catch (e) {
    return res.status(500).json({
      message: e.message || "Something went wrong",
    });
  }
};

// Lấy sản phẩm theo danh mục
const getProductsByCategory = async (req, res) => {
  try {
    const { categoryId } = req.params; // Lấy categoryId từ URL params

    if (!categoryId) {
      return res.status(400).json({
        status: "ERR",
        message: "Category ID is required",
      });
    }

    const response = await ProductService.getProductsByCategory(categoryId); // Gọi hàm từ ProductService
    return res.status(200).json(response);
  } catch (e) {
    return res.status(500).json({
      message: e.message || "Something went wrong",
    });
  }
};

module.exports = {
  createProduct,
  updateProduct,
  deleteProduct,
  getDetailsProduct,
  getAllProduct,
  searchProducts,
  getProductsByCategory, // Thêm phương thức mới vào module.exports
};


