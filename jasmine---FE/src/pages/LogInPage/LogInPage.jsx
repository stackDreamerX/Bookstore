import React, { useEffect, useState } from "react";
import ButtonFormComponent from "../../components/ButtonFormComponent/ButtonFormComponent";
import FormComponent from "../../components/FormComponent/FormComponent";
import styles from "./LogInPage.css";
import img1 from "../../assets/img/book13.png";
import img2 from "../../assets/img/jasmine.png";
import { Link, useNavigate } from "react-router-dom";
import ForgotPassword from "../ForgotPasswordPage/pages/EnterEmail";
import { useMutation } from "@tanstack/react-query";
import * as UserService from "../../services/UserService";
import { useMutationHook } from "../../hooks/useMutationHook";
import Loading from "../../components/LoadingComponent/Loading";
import Message from "../../components/MessageComponent/Message";
import { jwtDecode } from "jwt-decode";
import { useDispatch } from "react-redux";
import { updateUser } from "../../redux/slides/userSlide";

const LogInPage = () => {
  const [formData, setFormData] = useState({
    userEmail: "",
    userPassword: "",
  });

  const dispatch = useDispatch();

  const [showLoading, setShowLoading] = useState(false); // Thêm trạng thái riêng
  // const [errorMessage, setErrorMessage] = useState("");
  const [statusMessage, setStatusMessage] = useState(null);

  const navigate = useNavigate();
  const handleForgotPassword = () => {
    navigate("/forgot-password");
  };

  const mutation = useMutationHook((data) => UserService.loginUser(data));
  const { data, isSuccess, isError } = mutation;

  useEffect(() => {
    if (mutation.isSuccess) {
      setShowLoading(false);
      setStatusMessage({
        type: "Success",
        message: "Đăng nhập thành công! Đang chuyển đến trang chủ...",
      });
      setTimeout(() => {
        navigate("/");
      }, 1500);

      // console.log("data", data);

      localStorage.setItem("access_token", data?.access_token);
      // console.log("data?.access_token", data?.access_token);

      if (data?.access_token) {
        const decoded = jwtDecode(data?.access_token);
        // console.log("decoded", decoded);

        if (decoded?.id) {
          handleGetDetailsUser(decoded?.id, data?.access_token);
        }
      }
    } else if (mutation.isError) {
      // setShowLoading(false);
      const errorMessage =
        mutation.error?.message?.message ||
        "Đăng nhập thất bại. Vui lòng thử lại.";
      setStatusMessage({
        type: "Error",
        message:
          typeof errorMessage === "object"
            ? JSON.stringify(errorMessage)
            : errorMessage,
      });
      setTimeout(() => setShowLoading(false), 500); // Ẩn loading nếu lỗi
    }
  }, [mutation.isSuccess, mutation.isError, mutation.error, navigate]);

  // Check if all fields are filled to enable the button
  const isFormValid =
    formData.userEmail.trim() !== "" && formData.userPassword.trim() !== "";

  const handleGetDetailsUser = async (id, token) => {
    const res = await UserService.getDetailsUser(id, token);
    // console.log("res", res);
    dispatch(updateUser({ ...res?.data, access_token: token }));
  };

  // const handleChange = ({ name, value }) => {
  //   setFormData((prevData) => ({
  //     ...prevData,
  //     [name]: value, // Cập nhật theo name và value
  //   }));
  // };

  const handleUserEmailChange = (e) => {
    const value = e.target.value;
    if (typeof value === "string" && value.trim().length >= 0) {
      setFormData((prevData) => ({ ...prevData, userEmail: value }));
    }
  };

  const handleUserPasswordChange = (e) => {
    const value = e.target.value;
    if (typeof value === "string" && value.trim().length >= 0) {
      setFormData((prevData) => ({ ...prevData, userPassword: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setShowLoading(true);
    mutation.mutate(formData);
  };

  return (
    <div className="container-xl container-login">
      {statusMessage && (
        <Message
          type={statusMessage.type}
          message={statusMessage.message}
          duration={3000}
          onClose={() => setStatusMessage(null)}
        />
      )}
      <div className="login-container">
        {/* logIn right */}
        <div className="login-container__img">
          <img className="login__img" src={img1} alt="Hình cuốn sách" />
          {/* <img className="login__logo" src={img2} alt="Jasmine logo" /> */}
        </div>
        {/* logIn left */}
        <div className="login__left">
          <h1 className="login__title">ĐĂNG NHẬP</h1>
          {/* Hiển thị spinner loading */}
          <Loading isLoading={showLoading} />
          {!showLoading && (
            <form onSubmit={handleSubmit}>
              <FormComponent
                // id="emailInput"
                name="userEmail"
                label="Email"
                type="email"
                placeholder="Nhập email"
                value={formData.userEmail}
                // onChange={handleChange}
                onChange={handleUserEmailChange}
              />
              <FormComponent
                // id="passwordInput"
                name="userPassword"
                label="Password"
                type="password"
                placeholder="Nhập mật khẩu"
                value={formData.userPassword}
                // onChange={handleChange}
                onChange={handleUserPasswordChange}
              />
              {/* hiện thông báo lỗi */}
              {/* {errorMessage && (
                <span
                  style={{
                    color: "red",
                    display: "block",
                    fontSize: "16px",
                    marginTop: "10px",
                  }}
                >
                  {errorMessage}
                </span>
              )} */}

              {/* Thêm phần checkbox */}
              <div className="login__extend">
                <label className="remember__password">
                  <input className="remember__checkbox" type="checkbox" />
                  Ghi nhớ mật khẩu
                </label>
                <div
                  onClick={handleForgotPassword}
                  className="forgot__password"
                >
                  Quên mật khẩu?
                </div>
              </div>
              <ButtonFormComponent type="submit" disabled={!isFormValid}>
                Đăng nhập
              </ButtonFormComponent>
            </form>
          )}
          <div className="case__signup">
            Bạn chưa có tài khoản?
            <u>
              <Link to="/signup" className="btn__goto__signup">
                Đăng ký
              </Link>
            </u>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LogInPage;
