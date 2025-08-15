const API_URL = "http://localhost:3001";

const defaultHeaders = {
  Accept: "application/json",
  "Content-Type": "application/json",
  "Access-Control-Allow-Credentials": true,
};

const getAuthorizationHeader = () => {
  // Lấy mã JWT từ localStorage
  const jwtToken = localStorage.getItem("access_token");
  return jwtToken ? { token: `Bearer ${jwtToken}` } : {};
};

const api = {
  get: async (endpoint) => {
    try {
      const response = await fetch(`${API_URL}${endpoint}`, {
        method: "GET",
        credentials: "include",
        headers: {
          ...defaultHeaders,
          ...getAuthorizationHeader(),
        },
      });

      const dataRes = await response.json();
      return { status: response.status, data: dataRes };
    } catch (error) {
      console.error("GET request error:", error);
      return { status: 500, data: null, error: error.message };
    }
  },

  post: async (endpoint, data) => {
    try {
      const response = await fetch(`${API_URL}${endpoint}`, {
        method: "POST",
        credentials: "include",
        headers: {
          ...defaultHeaders,
          ...getAuthorizationHeader(),
        },
        body: JSON.stringify(data),
      });

      const dataRes = await response.json();
      return { status: response.status, data: dataRes };
    } catch (error) {
      console.error("POST request error:", error);
      return { status: 500, data: null, error: error.message };
    }
  },

  put: async (endpoint, data) => {
    try {
      const response = await fetch(`${API_URL}${endpoint}`, {
        method: "PUT",
        credentials: "include",
        headers: {
          ...defaultHeaders,
          ...getAuthorizationHeader(),
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        return { status: response.status };
      }

      const dataRes = await response.json();
      return { status: response.status, data: dataRes };
    } catch (error) {
      console.error("PUT request error:", error);
      return { status: 500, data: null, error: error.message };
    }
  },

  delete: async (endpoint) => {
    try {
      const response = await fetch(`${API_URL}${endpoint}`, {
        method: "DELETE",
        credentials: "include",
        headers: {
          ...defaultHeaders,
          ...getAuthorizationHeader(),
        },
      });

      const dataRes = await response.json();
      return { status: response.status, data: dataRes };
    } catch (error) {
      console.error("DELETE request error:", error);
      return { status: 500, data: null, error: error.message };
    }
  },
};

export default api;
