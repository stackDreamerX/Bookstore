const Order = require("../models/OrderModel");
const SearchHistory = require("../models/SearchHistoryModel");
const ProductView = require("../models/ProductViewModel");

// Trọng số: Mua hàng (3), Xem (1), Tìm kiếm (0.5)
const WEIGHTS = { purchase: 3, view: 1, search: 0.5 };

const getUserItemMatrix = async () => {
  const matrix = {};

  // Lấy dữ liệu mua hàng
  const orders = await Order.find().populate("orderItems.product");
  orders.forEach((order) => {
    //kiểm tra nếu userId tồn tại
    if (order.userId) {
      const userId = order.userId.toString();
      if (!matrix[userId]) matrix[userId] = {};

      order.orderItems.forEach((item) => {
        const productId = item.product._id.toString();
        matrix[userId][productId] =
          (matrix[userId][productId] || 0) + item.quantity * WEIGHTS.purchase;
      });
    }
  });

  // Lấy dữ liệu xem sản phẩm
  const views = await ProductView.find();
  views.forEach((view) => {
    const userId = view.userId.toString();
    const productId = view.productId.toString();
    if (!matrix[userId]) matrix[userId] = {};
    matrix[userId][productId] = (matrix[userId][productId] || 0) + WEIGHTS.view;
  });

  // Lấy dữ liệu tìm kiếm
  const searches = await SearchHistory.find();
  searches.forEach((search) => {
    const userId = search.userId.toString();
    if (!matrix[userId]) matrix[userId] = {};

    // Giả sử từ khóa tìm kiếm liên quan đến sản phẩm nào đó
    const relatedProducts = [];
    relatedProducts.forEach((productId) => {
      matrix[userId][productId] =
        (matrix[userId][productId] || 0) + WEIGHTS.search;
    });
  });

  return matrix;
};

module.exports = { getUserItemMatrix };
