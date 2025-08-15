import axios from "axios";
import api from "../APIClient";
import { data } from "jquery";

export const axiosJWT = axios.create();

// export const createproduct = async (data) => {
//   const res = await axios.post(`${process.env.REACT_APP_API_URL_BACKEND}/product/create-product`, data)

//   return res.data
// };
//
export const createProduct = async (data, access_token) => {
  console.log("DATA", data);
  try {
    const res = await axios.post(
      `${process.env.REACT_APP_API_URL_BACKEND}/product/create-product`,
      data,
      {
        headers: {
          //"Content-Type": "application/json",
          "Content-Type": "multipart/form-data",
          token: `Bearer ${access_token}`,
        },
      }
    );
    return res.data;
  } catch (error) {
    if (error.response) {
      console.log("err", error);
      throw {
        // status: error.response.data?.status || "ERR",
        message: error.response.data?.message || "Đã xảy ra lỗi.",
      };
    } else {
      throw { status: 500, message: "Không thể kết nối đến máy chủ." };
    }
  }
};

export const getDetailsproduct = async (id, access_token) => {
  try {
    const res = await axiosJWT.get(
      `${process.env.REACT_APP_API_URL_BACKEND}/product/get-detail-product/${id}`,
      {
        headers: {
          "Content-Type": "application/json",
          token: `Bearer ${access_token}`,
        },
      }
    );
    return res.data; // Trả dữ liệu nếu thành công
  } catch (error) {
    // Nếu API trả về lỗi, ném lỗi với thông tin chi tiết
    if (error.response) {
      // API trả về response
      throw {
        // product: error.response.data?.product || "ERR",
        message: error.response.data?.message || "Đã xảy ra lỗi.",
      };
    } else {
      // Lỗi không có response (ví dụ lỗi mạng)
      throw { product: 500, message: "Không thể kết nối đến máy chủ." };
    }
  }
};

export const getAllproduct = async (access_token) => {
  try {
    const res = await axiosJWT.get(
      `${process.env.REACT_APP_API_URL_BACKEND}/product/get-all-product`,
      {
        headers: {
          "Content-Type": "application/json",
          token: `Bearer ${access_token}`,
        },
      }
    );
    return res.data; // Trả dữ liệu nếu thành công
  } catch (error) {
    // Nếu API trả về lỗi, ném lỗi với thông tin chi tiết
    if (error.response) {
      // API trả về response
      throw {
        // product: error.response.data?.product || "ERR",
        message: error.response.data?.message || "Đã xảy ra lỗi.",
      };
    } else {
      // Lỗi không có response (ví dụ lỗi mạng)
      throw { product: 500, message: "Không thể kết nối đến máy chủ." };
    }
  }
};

export const updateproduct = async (id, access_token, data) => {
  try {
    for (let pair of data.entries()) {
      console.log("form", `${pair[0]}: ${pair[1]}`);
    }
    const res = await axios.put(
      `${process.env.REACT_APP_API_URL_BACKEND}/product/update-product/${id}`,
      data,

      {
        headers: {
          // "Content-Type": "multipart/form-data" ,
          token: `Bearer ${access_token}`,
        },
      }
    );
    return res.data;
  } catch (error) {
    if (error.response) {
      throw {
        // product: error.response.data?.product || "ERR",
        message: error.response.data?.message || "Đã xảy ra lỗi.",
      };
    } else {
      throw { product: 500, message: "Không thể kết nối đến máy chủ." };
    }
  }
};

export const deleteProduct = async (productId, access_token) => {
  try {
    const res = await axios.delete(
      `${process.env.REACT_APP_API_URL_BACKEND}/product/delete-product/${productId}`,

      {
        headers: {
          "Content-Type": "application/json",
          token: `Bearer ${access_token}`,
        },
      }
    );
    return res.data;
  } catch (error) {
    if (error.response) {
      throw {
        // product: error.response.data?.product || "ERR",
        message: error.response.data?.message || "Đã xảy ra lỗi.",
      };
    } else {
      throw { product: 500, message: "Không thể kết nối đến máy chủ." };
    }
  }
};

// services/ProductService.js

export const searchProducts = async (query) => {
  try {
    const res = await axiosJWT.get(
      `${
        process.env.REACT_APP_API_URL_BACKEND
      }/product/search?search=${encodeURIComponent(query)}`,

      {
        headers: {
          "Content-Type": "application/json",
          // token: `Bearer ${access_token}`,
        },
      }
    );

    return res.data; // Trả dữ liệu nếu thành công
  } catch (error) {
    // Nếu API trả về lỗi, ném lỗi với thông tin chi tiết
    if (error.response) {
      // API trả về response
      throw {
        // product: error.response.data?.product || "ERR",
        message: error.response.data?.message || "Đã xảy ra lỗi.",
      };
    } else {
      // Lỗi không có response (ví dụ lỗi mạng)
      throw { product: 500, message: "Không thể kết nối đến máy chủ." };
    }
  }
};

export const getProductsByCategory = async (categoryId) => {
  try {
    // Nếu không có categoryId, trả về tất cả sản phẩm
    if (!categoryId) {
      console.log("CategoryId is null, returning all products");
      return getAllproduct();
    }
    
    console.log("Fetching products for category ID:", categoryId);
    const res = await axiosJWT.get(
      `${process.env.REACT_APP_API_URL_BACKEND}/product/get-product-by-category/${categoryId}`,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    console.log("API response for category products:", res.data);
    return res.data; // Trả dữ liệu nếu thành công
  } catch (error) {
    console.error("Error in getProductsByCategory:", error);
    if (error.response) {
      throw {
        message: error.response.data?.message || "Đã xảy ra lỗi.",
      };
    } else {
      throw { product: 500, message: "Không thể kết nối đến máy chủ." };
    }
  }
};
