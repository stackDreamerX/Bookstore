const Product = require("../models/ProductModel");

/**
 * Create a new product
 */
const createProduct = (newProduct) => {
  return new Promise(async (resolve, reject) => {
    try {
      const {
        //  productCode,
        productName,
        productImage,
        productCategory,
        productPrice,
        //productQuantity,
        // productExpiry,
        // productRating,
        productDescription,
      } = newProduct;

      // Check for duplicate productCode or productName
      const checkProduct = await Product.findOne({
        $or: [{ productName }],
      });

      if (checkProduct) {
        return resolve({
          status: "ERR",
          message: "Product name already exists.",
        });
      }

      const createdProduct = await Product.create(newProduct);

      resolve({
        status: "OK",
        message: "Product created successfully",
        data: createdProduct,
      });
    } catch (e) {
      reject({
        status: "ERR",
        message: e.message || "Failed to create product",
      });
    }
  });
};

/**
 * Update an existing product
 */
const updateProduct = (id, data) => {
  return new Promise(async (resolve, reject) => {
    try {
      // Check if product exists
      const checkProduct = await Product.findById(id);

      if (!checkProduct) {
        return resolve({
          status: "ERR",
          message: "Product not found",
        });
      }

      // Check for duplicate productName (excluding the current product)
      const duplicateProduct = await Product.findOne({
        productName: data.productName,
        _id: { $ne: id },
      });

      if (duplicateProduct) {
        return resolve({
          status: "ERR",
          message: "Product name already exists",
        });
      }

      const updatedProduct = await Product.findByIdAndUpdate(id, data, {
        new: true,
      });

      resolve({
        status: "OK",
        message: "Product updated successfully",
        data: updatedProduct,
      });
    } catch (e) {
      reject({
        status: "ERR",
        message: e.message || "Failed to update product",
      });
    }
  });
};

/**
 * Delete a product
 */
const deleteProduct = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const checkProduct = await Product.findById(id);

      if (!checkProduct) {
        return resolve({
          status: "ERR",
          message: "Product not found",
        });
      }

      await Product.findByIdAndDelete(id);

      resolve({
        status: "OK",
        message: "Product deleted successfully",
      });
    } catch (e) {
      reject({
        status: "ERR",
        message: e.message || "Failed to delete product",
      });
    }
  });
};

/**
 * Get details of a single product
 */
const getDetailsProduct = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const product = await Product.findById(id).populate("productCategory");

      if (!product) {
        return resolve({
          status: "ERR",
          message: "Product not found",
        });
      }

      resolve({
        status: "OK",
        message: "Product retrieved successfully",
        data: product,
      });
    } catch (e) {
      reject({
        status: "ERR",
        message: e.message || "Failed to get product details",
      });
    }
  });
};

/**
 * Get all products with pagination, filtering, and sorting
 */
const getAllProduct = (limit, page, sort, filter) => {
  return new Promise(async (resolve, reject) => {
    try {
      const query = {};

      // Add filtering condition
      if (filter) {
        const [field, value] = filter;
        query[field] = { $regex: value, $options: "i" }; // Case-insensitive partial match
      }

      const totalProduct = await Product.countDocuments(query);

      // Add sorting condition
      const sortCondition = sort ? { [sort[1]]: sort[0] } : {};

      const allProduct = await Product.find(query)
        .limit(limit)
        .skip(page * limit)
        .sort(sortCondition);

      resolve({
        status: "OK",
        message: "Products retrieved successfully",
        data: allProduct,
        total: totalProduct,
        pageCurrent: Number(page) + 1,
        totalPage: Math.ceil(totalProduct / limit),
      });
    } catch (e) {
      reject({
        status: "ERR",
        message: e.message || "Failed to get products",
      });
    }
  });
};

/**
 * Search for products by name
 */
const searchProducts = async (query) => {
  try {
    if (!query) {
      throw {
        status: "ERR",
        message: "Search query is required",
      };
    }

    const products = await Product.find({
      productName: { $regex: query, $options: "i" }, // Case-insensitive partial match
    });

    if (products.length === 0) {
      return {
        status: "ERR",
        message: "No matching products found",
      };
    }

    return {
      status: "OK",
      message: "Products retrieved successfully",
      data: products,
    };
  } catch (e) {
    console.error("Error searching products:", e);
    throw {
      status: "ERR",
      message: e.message || "Failed to search products",
    };
  }
};

/**
 * Get products by category
 */
const getProductsByCategory = (categoryId) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!categoryId) {
        return resolve({
          status: "ERR",
          message: "Category ID is required",
        });
      }

      const products = await Product.find({ productCategory: categoryId });

      if (products.length === 0) {
        return resolve({
          status: "ERR",
          message: "No products found for this category",
        });
      }

      resolve({
        status: "OK",
        message: "Products retrieved successfully",
        data: products,
      });
    } catch (e) {
      reject({
        status: "ERR",
        message: e.message || "Failed to get products by category",
      });
    }
  });
};

module.exports = {
  createProduct,
  updateProduct,
  deleteProduct,
  getDetailsProduct,
  getAllProduct,
  searchProducts,
  getProductsByCategory, // Export the new function
};
