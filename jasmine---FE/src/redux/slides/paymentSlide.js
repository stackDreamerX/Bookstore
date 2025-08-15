import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as PaymentService from "../../services/PaymentService";

export const createPayment = createAsyncThunk(
  "payment/createPayment",
  async (data, { rejectWithValue }) => {
    try {
      const response = await PaymentService.createPayment(data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const paymentSlice = createSlice({
  name: "payment",
  initialState: { payments: [], status: null, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createPayment.pending, (state) => {
        state.status = "loading";
      })
      .addCase(createPayment.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.payments.push(action.payload);
      })
      .addCase(createPayment.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export default paymentSlice.reducer;
