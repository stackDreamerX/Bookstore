import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  id: "",
  statusCode: "",
  statusName: "",
  statusDescription: "",
  access_token: "",
  // isAdmin: false,
  allStatus: [], // Danh sách tất cả các status
  detailStatus: {}, // Chi tiết một status cụ thể
};

export const statusSlice = createSlice({
  name: "status",
  initialState,
  reducers: {
    updateStatus: (state, action) => {
      const {
        _id = "",
        statusCode = "",
        statusName = "",
        statusDescription = "",
        access_token = "",
      } = action?.payload;
      // console.log("action", action.payload);
      state.id = _id;
      state.statusCode = statusCode;
      state.statusName = statusName;
      state.statusDescription = statusDescription;
      state.access_token = access_token;
    },
    resetStatus: (state) => {
      state.id = "";
      state.statusCode = "";
      state.statusName = "";
      state.statusDescription = "";
      state.access_token = "";
    },
    setAllStatus: (state, action) => {
      state.allStatus = action.payload; // Lưu danh sách status từ API
    },
    setDetailStatus: (state, action) => {
      state.detailStatus = action.payload;
    }, // Lưu chi tiết một status từ API
  },
});

// Action creators are generated for each case reducer function
export const { updateStatus, resetStatus, setAllStatus, setDetailStatus } =
  statusSlice.actions;

export default statusSlice.reducer;
