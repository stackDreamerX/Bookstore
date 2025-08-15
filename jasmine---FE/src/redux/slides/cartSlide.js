import { createSlice } from "@reduxjs/toolkit";

// Hàm lưu trạng thái vào localStorage
const saveToLocalStorage = (state) => {
  localStorage.setItem("cart", JSON.stringify(state));
};

// Hàm lấy trạng thái từ localStorage
const loadFromLocalStorage = () => {
  try {
    const cart = localStorage.getItem("cart");
    return cart ? JSON.parse(cart) : { products: [] };
  } catch (error) {
    console.error("Error loading cart from localStorage:", error);
    return { products: [] };
  }
};

// Tải trạng thái từ localStorage làm initialState
const initialState = loadFromLocalStorage();

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      // console.log("Action payload:", action.payload);
      const existingProduct = state.products.find(
        (product) => product.id === action.payload.id
      );

      if (existingProduct) {
        // Nếu sản phẩm đã tồn tại, tăng số lượng
        existingProduct.quantity += action.payload.quantity || 1;
      } else {
        // Nếu sản phẩm chưa tồn tại, thêm vào giỏ với số lượng ban đầu
        state.products.push({
          // ...action.payload,
          // quantity: action.payload.quantity || 1,
          id: action.payload.id, // Lưu id
          img: action.payload.img,
          title: action.payload.title,
          price: action.payload.price,
          originalPrice: action.payload.originalPrice, // Lưu giá gốc nếu có
          quantity: action.payload.quantity || 1,
        });
      }

      saveToLocalStorage(state);
    },
    updateQuantity: (state, action) => {
      const { id, quantity } = action.payload;
      const product = state.products.find((product) => product.id === id);

      if (product && quantity > 0) {
        product.quantity = quantity;
      }

      saveToLocalStorage(state); // Lưu trạng thái sau khi cập nhật số lượng
    },

    removeFromCart: (state, action) => {
      state.products = state.products.filter(
        (product) => product.id !== action.payload.id
      );
      saveToLocalStorage(state);
    },

    // Xóa các sản phẩm đã chọn khỏi giỏ hàng
    removeSelectedFromCart: (state, action) => {
      const selectedIds = action.payload.ids;
      state.products = state.products.filter(
        (product) => !selectedIds.includes(product.id)
      );
      saveToLocalStorage(state);
    },

    clearCart: (state) => {
      state.products = [];
      saveToLocalStorage(state); // Lưu trạng thái sau khi xóa toàn bộ giỏ hàng
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  clearCart,
  updateQuantity,
  removeSelectedFromCart
} = cartSlice.actions;
export default cartSlice.reducer;
