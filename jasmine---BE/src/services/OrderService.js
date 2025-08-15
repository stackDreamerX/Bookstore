const Order = require("../models/OrderModel");
const Status = require("../models/StatusModel");
const mongoose = require("mongoose");

// Kiểm tra tồn tại đơn hàng
const checkOrderExistence = async (id) => {
  const existingOrder = await Order.findById(id);
  if (!existingOrder) {
    throw new Error("Order not found");
  }
  return existingOrder;
};

// Tạo đơn hàng mới
// const createOrder = (newOrder) => {
//   return new Promise(async (resolve, reject) => {
//     try {
//       const createdOrder = await Order.create(newOrder);
//       if (createdOrder) {
//         resolve({
//           status: "OK",
//           message: "Order created successfully",
//           data: createdOrder,
//         });
//       }
//     } catch (e) {
//       reject(e);
//     }
//   });
// };

const createOrder = async (orderData) => {
  return new Promise(async (resolve, reject) => {
    try {
      const {
        orderItems,
        shippingAddress,
        paymentMethod,
        shippingPrice = 30000,
        userId,
        deliveryDate,
        deliveryTime,
        orderNote = "",
        status = "OrderedSuccessfully",
      } = orderData;

      // Tính toán các giá trị tổng
      const totalItemPrice = orderItems.reduce(
        (sum, item) => sum + item.total,
        0
      );
      const totalPrice = totalItemPrice + shippingPrice;

      // Kiểm tra dữ liệu
      if (!orderItems || orderItems.length === 0) {
        return reject({
          status: "ERR",
          message: "Order items cannot be empty",
        });
      }

      // Validate order items details
      orderItems.forEach((item) => {
        if (!item.product) {
          return reject({
            status: "ERR",
            message: "Product is required in order items",
          });
        }
        if (!item.total || isNaN(item.total)) {
          return reject({
            status: "ERR",
            message: "Total is required and must be a number in order items",
          });
        }
      });

      if (!userId) {
        // Trường hợp khách chưa đăng nhập
        if (
          !shippingAddress ||
          !shippingAddress.familyName ||
          !shippingAddress.userName ||
          !shippingAddress.userPhone ||
          !shippingAddress.userEmail ||
          !shippingAddress.userAddress
        ) {
          return reject({
            status: "ERR",
            message: "Shipping information is required for guest orders.",
          });
        }
      }

      if (!paymentMethod) {
        return reject({
          status: "ERR",
          message: "Payment method is required",
        });
      }

      // Lấy ObjectId của trạng thái
      const statusObj = await Status.findOne({ statusCode: status });
      if (!statusObj) {
        return reject({
          status: "ERR",
          message: `Status ${status} not found`,
        });
      }

      // Tự động tính ngày giao hàng dự kiến là 1 tuần kể từ ngày đặt hàng nếu không được cung cấp
      const expectedDeliveryDate = new Date();
      expectedDeliveryDate.setDate(expectedDeliveryDate.getDate() + 7); // Thêm 7 ngày

      // Định dạng ngày thành chuỗi YYYY-MM-DD
      const formattedExpectedDate = expectedDeliveryDate.toISOString().split('T')[0];

      // Tạo đơn hàng
      const newOrder = await Order.create({
        orderCode: `ORD-${Date.now()}`,
        orderItems,
        shippingAddress,
        paymentMethod,
        userId: userId || null,
        shippingPrice,
        totalItemPrice,
        totalPrice,
        deliveryDate: deliveryDate || formattedExpectedDate,
        deliveryTime: deliveryTime || "08:00", // Mặc định 8:00 sáng nếu không được cung cấp
        status: statusObj._id,
        orderNote,
      });

      resolve({
        status: "OK",
        message: "Order created successfully",
        data: newOrder,
      });
    } catch (error) {
      reject({
        status: "ERR",
        message: error.message || "An error occurred while creating the order",
      });
    }
  });
};

// Cập nhật thông tin đơn hàng
const updateOrder = (id, data) => {
  return new Promise(async (resolve, reject) => {
    try {
      await checkOrderExistence(id); // Kiểm tra tồn tại

      const updatedOrder = await Order.findByIdAndUpdate(id, data, {
        new: true,
      });
      resolve({
        status: "OK",
        message: "Order updated successfully",
        data: updatedOrder,
      });
    } catch (e) {
      reject(e);
    }
  });
};

// Xóa đơn hàng
const deleteOrder = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      await checkOrderExistence(id); // Kiểm tra tồn tại

      await Order.findByIdAndDelete(id);
      resolve({
        status: "OK",
        message: "Order deleted successfully",
      });
    } catch (e) {
      reject(e);
    }
  });
};

// Lấy thông tin chi tiết đơn hàng
const getOrderDetails = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const order = await Order.findById(id)
        .populate("orderItems.product")
        .populate("user")
        .populate("status");
      if (!order) {
        resolve({
          status: "ERR",
          message: "Order not found",
        });
      }

      resolve({
        status: "OK",
        message: "Order details retrieved successfully",
        data: order,
      });
    } catch (e) {
      reject(e);
    }
  });
};

// Lấy danh sách tất cả đơn hàng
// const getAllOrders = () => {
//   return new Promise(async (resolve, reject) => {
//     try {
//       const orders = await Order.find()
//         .populate("orderItems.product")
//         .populate("user")
//         .populate("status");
//       resolve({
//         status: "OK",
//         message: "All orders retrieved successfully",
//         data: orders,
//       });
//     } catch (e) {
//       reject(e);
//     }
//   });
// };

// Lấy danh sách tất cả đơn hàng (có phân trang và sắp xếp)
const getAllOrders = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const orders = await Order.find()
        .populate("orderItems.product")
        .populate("userId")
        .populate("status"); // Lấy tất cả đơn hàng từ collection với populate

      resolve({
        status: "OK",
        message: "Get all Orders is SUCCESS",
        data: orders,
      });
    } catch (error) {
      reject({
        status: "ERR",
        message: error.message || "Failed to retrieve orders",
      });
    }
  });
};

// Lấy danh sách đơn hàng của người dùng
const getOrdersByUser = (userId) => {
  console.log("USERID", userId);
  return new Promise(async (resolve, reject) => {
    try {
      const orders = await Order.find({ userId: new mongoose.Types.ObjectId(userId) })
        .populate("orderItems.product")
        .populate("status");
      resolve({
        status: "OK",
        message: "Orders by user retrieved successfully",
        data: orders,
      });
    } catch (e) {
      reject(e);
    }
  });
};


// Cập nhật trạng thái đơn hàng
const updateOrderStatus = (id, statusId) => {
  return new Promise(async (resolve, reject) => {
    try {
      // Kiểm tra _id có hợp lệ không
      const status = await Status.findById(statusId);
      if (!status) {
        return reject(new Error("Invalid status ID"));
      }

      const updatedOrder = await Order.findByIdAndUpdate(
        id,
        { status: status._id },
        { new: true }
      );

      if (!updatedOrder) {
        return reject(new Error("Order not found"));
      }

      resolve(updatedOrder);
    } catch (e) {
      reject(e);
    }
  });
};


module.exports = {
  createOrder,
  updateOrder,
  deleteOrder,
  getOrderDetails,
  getAllOrders,
  getOrdersByUser,
  updateOrderStatus,
};
