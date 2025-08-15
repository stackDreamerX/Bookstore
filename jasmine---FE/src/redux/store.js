import { configureStore } from "@reduxjs/toolkit";
import counterReducer from "./slides/counterSlide";
import userReducer from "./slides/userSlide";
import statusReducer from "./slides/statusSlide";
import cartReducer from "./slides/cartSlide";
import productReducer from "./slides/productSlide";
import orderReducer from "./slides/orderSlide";

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    user: userReducer,
    status: statusReducer,
    product: productReducer,
    cart: cartReducer,
    order: orderReducer,
  },
});
