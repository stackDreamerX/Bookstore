const { getUserItemMatrix } = require("./GetUserItemMatrixService");
const cosineSimilarity = require("compute-cosine-similarity");
const Product = require('../models/ProductModel');
const User = require('../models/UserModel');

const recommend = async (userId) => {
  const matrix = await getUserItemMatrix();
  const users = Object.keys(matrix);
  if (!matrix[userId]) return [];
  const similarities = {};

  // Hàm chuyển đổi dữ liệu thành vector
  const userVector = (user, allProducts) => {
    return allProducts.map((product) => matrix[user][product] || 0);
  };

  const allProducts = [
    ...new Set(users.flatMap((user) => Object.keys(matrix[user]))),
  ];
  const targetVector = userVector(userId, allProducts);

  // Tính độ tương đồng với user khác
  for (let otherUser of users) {
    if (otherUser !== userId) {
      const otherVector = userVector(otherUser, allProducts);
      similarities[otherUser] =
        cosineSimilarity(targetVector, otherVector) || 0;
    }
  }

  // Lấy top 5 user tương tự
  const similarUsers = Object.entries(similarities)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([user]) => user);

  // Đề xuất sản phẩm
  const recommendations = {};
  similarUsers.forEach((similarUser) => {
    for (let product in matrix[similarUser]) {
      if (!matrix[userId][product]) {
        recommendations[product] =
          (recommendations[product] || 0) + matrix[similarUser][product];
      }
    }
  });

  // Trả về top 5 sản phẩm
  return Object.entries(recommendations)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([productId]) => productId);
};

const getRecommendedProductsForUser = async (userId) => {
  try {
    if (!userId) {
      throw new Error('User ID is required');
    }

    // Get user's order history to find previously purchased or viewed products
    const user = await User.findById(userId);

    if (!user) {
      throw new Error('User not found');
    }

    // In a real implementation, this would analyze user preferences and history
    // For now, we'll return a simple recommendation based on popular books

    // Get popular products (those with high ratings)
    const popularProducts = await Product.find({
      averageRating: { $gte: 4 }
    })
    .sort({ averageRating: -1, reviewCount: -1 })
    .limit(5);

    if (popularProducts.length === 0) {
      // If no highly rated products, return newest products
      return await Product.find({})
        .sort({ createdAt: -1 })
        .limit(5);
    }

    return popularProducts;
  } catch (error) {
    console.error('Error in getRecommendedProductsForUser:', error);
    throw error;
  }
};

const getSimilarProducts = async (productId) => {
  try {
    if (!productId) {
      throw new Error('Product ID is required');
    }

    // Get the product
    const product = await Product.findById(productId);

    if (!product) {
      throw new Error('Product not found');
    }

    // Find products in the same category
    const similarProducts = await Product.find({
      _id: { $ne: productId }, // Exclude the current product
      productCategory: product.productCategory
    })
    .limit(4);

    return similarProducts;
  } catch (error) {
    console.error('Error in getSimilarProducts:', error);
    throw error;
  }
};

module.exports = {
  recommend,
  getRecommendedProductsForUser,
  getSimilarProducts
};
