import React, { useState } from "react";
import "./EnterNewPassword.css";
import img1 from "../../../assets/img/book6.png";
import img2 from "../../../assets/img/jasmine.png";
import ButtonFormComponent from "../../../components/ButtonFormComponent/ButtonFormComponent";
import FormComponent from "../../../components/FormComponent/FormComponent";
import { useNavigate, useLocation } from "react-router-dom";
import * as AuthService from "../../../services/AuthService";
import Message from "../../../components/MessageComponent/Message";
import Loading from "../../../components/LoadingComponent/Loading";

const EnterNewPassword = () => {
  const nav = useNavigate();
  const location = useLocation();
  const email = location.state?.email || ""; // Lấy email từ trang trước

  console.log("email", email);

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [statusMessage, setStatusMessage] = useState(null);
  const [showLoading, setShowLoading] = useState(false);

  const handleSendNewPassword = async (e) => {
    e.preventDefault();

    if (password.length < 2) {
      setStatusMessage({
        type: "Error",
        message: "Mật khẩu phải có ít nhất 6 ký tự.",
      });
      return;
    }

    if (password !== confirmPassword) {
      setStatusMessage({
        type: "Error",
        message: "Mật khẩu nhập lại không khớp.",
      });
      return;
    }

    setShowLoading(true);

    try {
      const response = await AuthService.resetPassword(email, password);
      if (response.success) {
        setStatusMessage({
          type: "Success",
          message:
            "Đổi mật khẩu thành công! Đang chuyển đến trang đăng nhập...",
        });
        setTimeout(() => nav("/login"), 1500);
      } else {
        setStatusMessage({
          type: "Error",
          message: response.message || "Đã xảy ra lỗi. Vui lòng thử lại.",
        });
      }
    } catch (error) {
      setStatusMessage({
        type: "Error",
        message: error.message || "Không thể kết nối đến máy chủ.",
      });
    } finally {
      setShowLoading(false);
    }
  };

  return (
    <div className="container-xl container-new-password">
      {statusMessage && (
        <Message
          type={statusMessage.type}
          message={statusMessage.message}
          duration={3000}
          onClose={() => setStatusMessage(null)}
        />
      )}

      <div className="new-password-container">
        {/* new-password right */}
        <div className="new-password-container__img">
          <img className="new-password__img" src={img1} alt="Hình cái bánh" />
          <img
            className="new-password__logo"
            src={img2}
            alt="new-password logo"
          />
        </div>
        {/* new-password left */}
        <div className="new-password__left">
          <h1 className="new-password__title">QUÊN MẬT KHẨU</h1>
          <Loading isLoading={showLoading} />
          {!showLoading && (
            <form
              className="new-password__form"
              onSubmit={handleSendNewPassword}
            >
              <FormComponent
                id="passwordInput"
                label="Password"
                type="password"
                placeholder="Nhập mật khẩu mới"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              <FormComponent
                id="passwordConfirmInput"
                label="PasswordConfirm"
                type="password"
                placeholder="Nhập lại mật khẩu"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />

              {/* back to login */}
              <ButtonFormComponent className="btn__confirm" type="submit">
                Xác nhận
              </ButtonFormComponent>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default EnterNewPassword;
