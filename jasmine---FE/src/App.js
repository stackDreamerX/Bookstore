import "@glints/poppins";
import axios from "axios";
import React, { Fragment, useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import WebFont from "webfontloader";
import "./../node_modules/bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-datepicker/dist/css/bootstrap-datepicker.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import "bootstrap-datepicker";
import "./assets/css/reset.css";
import "./assets/css/style.css";
import DefaultComponent from "./components/DefaultComponent/DefaultComponent";
import FooterComponent from "./components/FooterComponent/FooterComponent";
import ChatbotComponent from "./components/ChatbotComponent/ChatbotComponent";
import { routes } from "./routes";
import { AuthProvider } from "./context/AuthContext";
import { isJsonString } from "./utils";
import { jwtDecode } from "jwt-decode";
import { updateUser } from "./redux/slides/userSlide";
import * as UserService from "./services/UserService";
import { useDispatch, useSelector } from "react-redux";
import Loading from "./components/LoadingComponent/Loading";

function App() {
  const dispatch = useDispatch();
  const [showLoading, setShowLoading] = useState(false);
  const user = useSelector((state) => state.user);
  // console.log("user", user);

  useEffect(() => {
    WebFont.load({
      google: {
        families: ["Poppins"],
      },
    });
  }, []);

  const handleDecoded = () => {
    let storageData = localStorage.getItem("access_token");
    // console.log("storageData", storageData);

    let decoded = {};
    if (storageData) {
      try {
        decoded = jwtDecode(storageData);
        console.log("decoded", decoded);
      } catch (error) {
        console.error("Token không hợp lệ", error);
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        storageData = null;
      }
    }
    return { decoded, storageData };
  };

  useEffect(() => {
    const initAuth = async () => {
      setShowLoading(true);
      let { storageData, decoded } = handleDecoded();
      // let newAccessToken = storageData;
      // Nếu không có token hoặc token hết hạn, thử refresh
      if (!decoded || decoded.exp < Date.now() / 1000) {
        try {
          const data = await UserService.refreshToken();
          storageData = data?.access_token;
          localStorage.setItem("access_token", storageData);
          decoded = jwtDecode(storageData);
        } catch (error) {
          console.warn("Không thể refresh token, yêu cầu đăng nhập lại.");
          localStorage.removeItem("access_token");
          localStorage.removeItem("refresh_token");
          setShowLoading(false);
          return;
        }
      }

      if (decoded?.id) {
        await handleGetDetailsUser(decoded.id, storageData);
      }
      setShowLoading(false);
    };

    initAuth();
  }, []);

  //token hết hạn
  UserService.axiosJWT.interceptors.request.use(
    async (config) => {
      let { decoded, storageData } = handleDecoded();
      let newAccessToken = storageData; // Fix lỗi 'storageData' undefined

      if (!decoded || decoded.exp < Date.now() / 1000) {
        try {
          let data = await UserService.refreshToken(); // Fix lỗi 'data' undefined
          newAccessToken = data?.access_token;
          localStorage.setItem("access_token", newAccessToken);
          decoded = jwtDecode(newAccessToken);
        } catch (error) {
          console.error("Lỗi khi làm mới token", error);
          return Promise.reject(error);
        }
      }

      config.headers["token"] = `Bearer ${newAccessToken}`;
      return config;
    },
    (error) => Promise.reject(error)
  );

  const handleGetDetailsUser = async (id, token) => {
    try {
      const res = await UserService.getDetailsUser(id, token);
      dispatch(updateUser({ ...res?.data, access_token: token }));
    } catch (error) {
      console.error("Lỗi lấy thông tin người dùng:", error);
    }
  };

  // useEffect(() => {
  //   fetchApi();
  // }, []);

  // console.log(
  //   "REACT_APP_API_URL_BACKEND: ",
  //   process.env.REACT_APP_API_URL_BACKEND
  // );

  // const fetchApi = async () => {
  //   const res = await axios.get(
  //     `${process.env.REACT_APP_API_URL_BACKEND}/user/get-all-user`
  //   );
  //   return res.data;
  // };

  // const query = useQuery({ queryKey: ["todos"], queryFn: fetchApi });
  // console.log("query: ", query);

  return (
    <div style={{ fontFamily: "poppins" }}>
      <Loading isLoading={showLoading} />
      {!showLoading && (
        <Router>
          <AuthProvider>
            <Routes>
              {routes.map((route) => {
                const Page = route.page;
                const isCheckAuth = !route.isPrivate || user.isAdmin;
                // console.log(`Route: ${route.path}, isCheckAuth: ${isCheckAuth}`);

                const Header = route.isShowHeader ? DefaultComponent : Fragment;
                const Footer = route.isShowFooter ? FooterComponent : Fragment;
                return (
                  <Route
                    key={route.path}
                    path={isCheckAuth ? route.path : undefined}
                    // path={route.path}
                    element={
                      <div>
                        <Header />
                        <Page />
                        <Footer />
                      </div>
                    }
                  />
                );
              })}
            </Routes>
            <ChatbotComponent />
          </AuthProvider>
        </Router>
      )}
      {/* </Loading> */}
    </div>
  );
}

export default App;
