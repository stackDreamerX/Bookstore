import { jwtDecode } from "jwt-decode";

export const isJsonString = (data) => {
  try {
    JSON.parse(data);
  } catch (error) {
    return false;
  }
  return true;
};

export const getBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
};

export const isAdmin = (token) => {
  try {
    const decoded = jwtDecode(token);
    return decoded.isAdmin === true; // Giả sử bạn có trường 'role' trong token
  } catch (error) {
    return false;
  }
};

// export const getCancelStatus = (allStatuses) => {
//   if (!Array.isArray(allStatuses)) {
//     throw new Error("Danh sách trạng thái không hợp lệ.");
//   }

//   return allStatuses.find((status) => status.statusCode === "CANCEL");
// };
