import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  _id: "",
  productName: "",
  productPrice: "",
  productCategory: "",
  productSize: "",
  productImage: "",
  productDescription: "",
  access_token: "",
  isLoggedIn: false,
};
export const productSlice = createSlice({
  name: "product", // Tên của slice (sẽ được sử dụng để định danh reducer trong store)
  initialState, // Trạng thái ban đầu
  reducers: {
    // Chứa các hàm reducer để cập nhật state
    updateproduct: (state, action) => {
      const {
        _id = "",
        productName = "",
        productPrice = "",
        productCategory = "",
        productSize = "",
        productImage = "",
        productDescription = "",
        access_token = "",
      } = action?.payload;

      state.id = _id;
      state.productName = productName;
      state.productPrice = productPrice;
      state.productCategory = productCategory;
      state.productSize = productSize;
      state.productImage = productImage;
      state.productDescription = productDescription;
      state.access_token = access_token;
      state.isLoggedIn = !!access_token; // Kiểm tra xem token có tồn tại hay không
    },
    resetproduct: (state) => {
      state.id = "";
      state.productName = "";
      state.productPrice = "";
      state.productCategory = "";
      state.productSize = "";
      state.productImage = "";
      state.productDescription = "";
      state.access_token = "";
      state.isLoggedIn = false;
    },
    setProducts: (state, action) => action.payload,
  },
});
export const { updateproduct, resetproduct, setProducts } =
  productSlice.actions;

export default productSlice.reducer;
