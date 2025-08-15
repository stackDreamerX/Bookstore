import { createSlice } from "@reduxjs/toolkit";

// Hàm lưu trạng thái vào localStorage
const saveToLocalStorage = (state) => {
  localStorage.setItem("orders", JSON.stringify(state));
};

// Hàm tải trạng thái từ localStorage
const loadFromLocalStorage = () => {
  try {
    const orders = localStorage.getItem("orders");
    return orders ? JSON.parse(orders) : { orders: [] };
  } catch (error) {
    console.error("Error loading orders from localStorage:", error);
    return { orders: [] };
  }
};

// Trạng thái ban đầu
const initialState = loadFromLocalStorage();

const orderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {
    // Thêm đơn hàng mới
    addOrder: (state, action) => {
      state.orders.push(action.payload);
      saveToLocalStorage(state); // Lưu vào localStorage
    },

    // Cập nhật trạng thái đơn hàng
    updateOrderStatus: (state, action) => {
      const { orderId, status } = action.payload;
      const order = state.orders.find((o) => o._id === orderId);
      if (order) {
        order.status = status;
        saveToLocalStorage(state); // Lưu vào localStorage
      }
    },

    // Xóa đơn hàng
    removeOrder: (state, action) => {
      state.orders = state.orders.filter(
        (order) => order._id !== action.payload
      );
      saveToLocalStorage(state); // Lưu vào localStorage
    },

    // Xóa tất cả đơn hàng
    clearOrders: (state) => {
      state.orders = [];
      saveToLocalStorage(state); // Lưu vào localStorage
    },

    // Thêm danh sách đơn hàng (dành cho khi load từ API)
    setOrders: (state, action) => {
      state.orders = action.payload;
      saveToLocalStorage(state); // Lưu vào localStorage
    },

    setOrderDetails: (state, action) => {
      state.selectedProducts = action.payload.selectedProducts || [];
      state.selectedProductIds = action.payload.selectedProductIds || [];
      state.shippingAddress = action.payload.shippingAddress || {};
      state.totalPrice = action.payload.totalPrice || 0;
      saveToLocalStorage(state);
    },
    clearOrder: (state) => {
      state.selectedProducts = [];
      state.selectedProductIds = [];
      state.shippingAddress = {};
      state.totalPrice = 0;
      saveToLocalStorage(state);
    },
  },
});

// Xuất các action
export const {
  addOrder,
  updateOrderStatus,
  removeOrder,
  clearOrders,
  setOrders,
  setOrderDetails,
} = orderSlice.actions;

// Xuất reducer
export default orderSlice.reducer;
