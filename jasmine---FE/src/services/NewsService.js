import axios from "axios";
import api from "../APIClient";
import { data } from "jquery";

export const axiosJWT = axios.create();

// export const createnews = async (data) => {
//   const res = await axios.post(`${process.env.REACT_APP_API_URL_BACKEND}/news/create-news`, data)
  
//   return res.data
// };
// 
export const createNews = async (data, access_token) => {
  console.log("DATA", data)
  try {
    const res = await axios.post(
      `${process.env.REACT_APP_API_URL_BACKEND}/news/create-news`,
      data,
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



export const getDetailsNews = async (id, access_token) => {
  try {
    const res = await axiosJWT.get(
      `${process.env.REACT_APP_API_URL_BACKEND}/news/get-detail-news/${id}`,
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
        // news: error.response.data?.news || "ERR",
        message: error.response.data?.message || "Đã xảy ra lỗi.",
      };
    } else {
      // Lỗi không có response (ví dụ lỗi mạng)
      throw { news: 500, message: "Không thể kết nối đến máy chủ." };
    }
  }
};

export const getAllNews = async () => {
  try {
    const res = await axiosJWT.get(
      `${process.env.REACT_APP_API_URL_BACKEND}/news/get-all-news`,
      {
        headers: {
          "Content-Type": "application/json",
          //token: `Bearer ${access_token}`,
        },
      }
    );
    return res.data; // Trả dữ liệu nếu thành công
  } catch (error) {
    // Nếu API trả về lỗi, ném lỗi với thông tin chi tiết
    if (error.response) {
      // API trả về response
      throw {
        // news: error.response.data?.news || "ERR",
        message: error.response.data?.message || "Đã xảy ra lỗi.",
      };
    } else {
      // Lỗi không có response (ví dụ lỗi mạng)
      throw { news: 500, message: "Không thể kết nối đến máy chủ." };
    }
  }
};

export const updateNews = async (id, access_token, data) => {
  try {
    const res = await axios.put(
      `${process.env.REACT_APP_API_URL_BACKEND}/news/update-news/${id}`,data,
      
      {
        headers: {
          "Content-Type": "multipart/form-data" ,
          token: `Bearer ${access_token}`,
        },
      }
    );
    return res.data;
  } catch (error) {
    if (error.response) {
      throw {
        // news: error.response.data?.news || "ERR",
        message: error.response.data?.message || "Đã xảy ra lỗi.",
      };
    } else {
      throw { news: 500, message: "Không thể kết nối đến máy chủ." };
    }
  }
};

export const deleteNews = async (newsId,access_token) => {
  try {
    const res = await axios.delete(
      `${process.env.REACT_APP_API_URL_BACKEND}/news/delete-news/${newsId}`,
      
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
        // news: error.response.data?.news || "ERR",
        message: error.response.data?.message || "Đã xảy ra lỗi.",
      };
    } else {
      throw { news: 500, message: "Không thể kết nối đến máy chủ." };
    }
  }
};
