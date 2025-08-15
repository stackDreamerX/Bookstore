import axios from "axios";
import api from "../APIClient";
import { data } from "jquery";

export const axiosJWT = axios.create();

// export const createDiscount = async (data) => {
//   const res = await axios.post(`${process.env.REACT_APP_API_URL_BACKEND}/Discount/create-Discount`, data)
  
//   return res.data
// };
// 
export const createCategory = async (data, access_token) => {
    console.log("DATA", data)
    try {
      const res = await axios.post(
        `${process.env.REACT_APP_API_URL_BACKEND}/category/create-category`,data,
        {
          headers: {
            //"Content-Type": "application/json",
            "Content-Type": "multipart/form-data" ,
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



export const getDetaillsCategory = async (id, access_token) => {
  try {
    const res = await axiosJWT.get(
      `${process.env.REACT_APP_API_URL_BACKEND}/category/get-detail-category/${id}`,
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
        // Discount: error.response.data?.Discount || "ERR",
        message: error.response.data?.message || "Đã xảy ra lỗi.",
      };
    } else {
      // Lỗi không có response (ví dụ lỗi mạng)
      throw { Discount: 500, message: "Không thể kết nối đến máy chủ." };
    }
  }
};

export const getAllCategory = async () => {
  try {
    const res = await axiosJWT.get(
      `${process.env.REACT_APP_API_URL_BACKEND}/category/get-all-category`,
      {
        headers: {
          "Content-Type": "application/json",
          
        },
      }
    );
    return res.data; // Trả dữ liệu nếu thành công
  } catch (error) {
    // Nếu API trả về lỗi, ném lỗi với thông tin chi tiết
    if (error.response) {
      // API trả về response
      throw {
        // Discount: error.response.data?.Discount || "ERR",
        message: error.response.data?.message || "Đã xảy ra lỗi.",
      };
    } else {
      // Lỗi không có response (ví dụ lỗi mạng)
      throw { Discount: 500, message: "Không thể kết nối đến máy chủ." };
    }
  }
};

export const updateCategory = async (id, access_token, data) => {
  try {
    for (let pair of data.entries()) {
      console.log("form",`${pair[0]}: ${pair[1]}`);
      
    }
    const res = await axios.put(
      `${process.env.REACT_APP_API_URL_BACKEND}/category/update-category/${id}`,data,
      
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
        // Discount: error.response.data?.Discount || "ERR",
        message: error.response.data?.message || "Đã xảy ra lỗi.",
      };
    } else {
      throw { Discount: 500, message: "Không thể kết nối đến máy chủ." };
    }
  }
};


export const deleteCategory = async (id, access_token) => {
  try {
    const res = await axios.delete(
      `${process.env.REACT_APP_API_URL_BACKEND}/discount/delete-category/${id}`, // Sử dụng ID của khuyến mãi
      {
        headers: {
          token: `Bearer ${access_token}`,
        },
      }
    );
    return res.data;
  } catch (error) {
    if (error.response) {
      throw {
        message: error.response.data?.message || "Đã xảy ra lỗi.",
      };
    } else {
      throw { message: "Không thể kết nối đến máy chủ." };
    }
  }
};





// services/DiscountService.js

// export const searchDiscounts = async (query) => {
//   try {
    
//     const res = await axiosJWT.get(
//       `${process.env.REACT_APP_API_URL_BACKEND}/Discount/search?search=${encodeURIComponent(query)}`,
     
//       {
//         headers: {
//           "Content-Type": "application/json",
//           // token: `Bearer ${access_token}`,
//         },
//       }
//     );
    
//     return res.data; // Trả dữ liệu nếu thành công
//   } catch (error) {
//     // Nếu API trả về lỗi, ném lỗi với thông tin chi tiết
//     if (error.response) {
//       // API trả về response
//       throw {
//         // Discount: error.response.data?.Discount || "ERR",
//         message: error.response.data?.message || "Đã xảy ra lỗi.",
//       };
//     } else {
//       // Lỗi không có response (ví dụ lỗi mạng)
//       throw { Discount: 500, message: "Không thể kết nối đến máy chủ." };
//     }
//   }
// };

// export const getDiscountsByCategory = async (categoryId) => {
//   try {
//     const res = await axiosJWT.get(
//       `${process.env.REACT_APP_API_URL_BACKEND}/discount/get-discount-by-category/${categoryId}`,
//       {
//         headers: {
//           "Content-Type": "application/json",
          
//         },
//       }
//     );
//     return res.data; // Trả dữ liệu nếu thành công
//   } catch (error) {
//     if (error.response) {
//       throw {
//         message: error.response.data?.message || "Đã xảy ra lỗi.",
//       };
//     } else {
//       throw { Discount: 500, message: "Không thể kết nối đến máy chủ." };
//     }
//   }
// };
