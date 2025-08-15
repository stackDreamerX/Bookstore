import axios from "axios";
import { axiosJWT } from "./UserService";

// Get all reviews for a specific product
export const getReviewsByProduct = async (productId) => {
  try {
    const response = await axios.get(
      `http://localhost:3001/api/review/product/${productId}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return {
      status: "ERR",
      message: "Failed to fetch reviews",
      data: []
    };
  }
};

// Create a new review
export const createReview = async (reviewData) => {
  try {
    const accessToken = localStorage.getItem("access_token");
    const userId = reviewData.userId;

    if (!accessToken) {
      return {
        status: "ERR",
        message: "You must be logged in to leave a review"
      };
    }

    // Đảm bảo reviewData có đầy đủ thông tin cần thiết
    if (!userId) {
      console.error("Missing userId in reviewData");
      return {
        status: "ERR",
        message: "Thiếu thông tin người dùng"
      };
    }

    console.log("Creating review with data:", reviewData);
    console.log("Using token:", accessToken ? "Token exists" : "No token");

    // Sử dụng endpoint chuẩn
    const response = await axios.post(
      "http://localhost:3001/api/review/create",
      reviewData,
      {
        headers: {
          "Content-Type": "application/json",
          token: `Bearer ${accessToken}`
        }
      }
    );

    console.log("Review creation successful:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error creating review:", error);

    // Kiểm tra lỗi xác thực
    if (error.response?.status === 401 || error.response?.status === 403) {
      return {
        status: "ERR",
        message: "Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại"
      };
    }

    // Trả về thông báo lỗi từ server
    if (error.response?.data) {
      return error.response.data;
    }

    return {
      status: "ERR",
      message: error.message || "Failed to create review"
    };
  }
};

// Update an existing review
export const updateReview = async (reviewId, reviewData) => {
  try {
    const accessToken = localStorage.getItem("access_token");

    if (!accessToken) {
      return {
        status: "ERR",
        message: "You must be logged in to update a review"
      };
    }

    const response = await axios.put(
      `http://localhost:3001/api/review/update/${reviewId}`,
      reviewData,
      {
        headers: {
          "Content-Type": "application/json",
          token: `Bearer ${accessToken}`
        }
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error updating review:", error);
    return {
      status: "ERR",
      message: error.response?.data?.message || "Failed to update review"
    };
  }
};

// Admin: Get all reviews
export const getAllReviews = async (page = 1, limit = 10) => {
  try {
    const accessToken = localStorage.getItem("access_token");

    if (!accessToken) {
      return {
        status: "ERR",
        message: "You must be logged in as admin"
      };
    }

    const response = await axios.get(
      `http://localhost:3001/api/review/admin/all?page=${page}&limit=${limit}`,
      {
        headers: {
          token: `Bearer ${accessToken}`
        }
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error fetching all reviews:", error);
    return {
      status: "ERR",
      message: error.response?.data?.message || "Failed to fetch reviews"
    };
  }
};

// Admin: Toggle review visibility
export const toggleReviewVisibility = async (reviewId) => {
  try {
    const accessToken = localStorage.getItem("access_token");

    if (!accessToken) {
      return {
        status: "ERR",
        message: "You must be logged in as admin"
      };
    }

    const response = await axios.put(
      `http://localhost:3001/api/review/admin/toggle-visibility/${reviewId}`,
      {},
      {
        headers: {
          token: `Bearer ${accessToken}`
        }
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error toggling review visibility:", error);
    return {
      status: "ERR",
      message: error.response?.data?.message || "Failed to toggle review visibility"
    };
  }
};

// Admin: Delete a review
export const deleteReview = async (reviewId) => {
  try {
    const accessToken = localStorage.getItem("access_token");

    if (!accessToken) {
      return {
        status: "ERR",
        message: "You must be logged in as admin"
      };
    }

    const response = await axios.delete(
      `http://localhost:3001/api/review/admin/delete/${reviewId}`,
      {
        headers: {
          token: `Bearer ${accessToken}`
        }
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error deleting review:", error);
    return {
      status: "ERR",
      message: error.response?.data?.message || "Failed to delete review"
    };
  }
};