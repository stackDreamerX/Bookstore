import axios from "axios";

export const getRecommendedProducts = async (userId) => {
  if (!userId || typeof userId !== "string") {
    throw new Error("userId không hợp lệ");
  }

  console.log(`Gọi API lấy sản phẩm khuyến nghị cho user: ${userId}`);
  try {
    const res = await axios.get(
      `${process.env.REACT_APP_API_URL_BACKEND}/recommendation/get-recommend/${userId}`,
      {
        headers: {
          "Content-Type": "application/json",
        },
        timeout: 10000, // 10 giây timeout
      }
    );
    console.log("Kết quả API:", res.data);
    return res.data;
  } catch (error) {
    if (error.response) {
      throw {
        message: error.response.data?.message || "Đã xảy ra lỗi.",
      };
    } else {
      throw { status: 500, message: "Không thể kết nối đến máy chủ." };
    }
  }
};
