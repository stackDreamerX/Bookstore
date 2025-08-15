import React, { useState } from "react";
import "./EnterEmail.css";
import img1 from "../../../assets/img/book6.png";
import img2 from "../../../assets/img/jasmine.png";
import ButtonFormComponent from "../../../components/ButtonFormComponent/ButtonFormComponent";
import FormComponent from "../../../components/FormComponent/FormComponent";
import { useNavigate } from "react-router-dom";
import * as AuthService from "../../../services/AuthService";
import Message from "../../../components/MessageComponent/Message";
import Loading from "../../../components/LoadingComponent/Loading";

const ForgotPassword = () => {
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [showLoading, setShowLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState(null);

  const handleChange = (e) => {
    setEmail(e.target.value);
  };

  const handleBackLogin = () => {
    nav("/login");
  };

  const handleSendEmail = async (e) => {
    e.preventDefault();
    setShowLoading(true);

    try {
      const response = await AuthService.forgotPassword(email);
      if (response.success) {
        setStatusMessage({
          type: "Success",
          message: "OTP đã được gửi! Đang chuyển đến trang nhập OTP...",
        });
        setTimeout(() => {
          nav("/forgot-password/enter-otp", { state: { email } });
        }, 1500);
      } else {
        setStatusMessage({
          type: "Error",
          message: response.message || "Đã xảy ra lỗi. Vui lòng thử lại.",
        });
      }
    } catch (error) {
      setStatusMessage({
        type: "Error",
        message: error.message || "Đã xảy ra lỗi. Vui lòng thử lại.",
      });
    } finally {
      setShowLoading(false);
    }
  };

  const isValid = () => {
    return email.trim() !== "" && /\S+@\S+\.\S+/.test(email);
  };

  return (
    <div className="container-xl container-forgot-password">
      {statusMessage && (
        <Message
          type={statusMessage.type}
          message={statusMessage.message}
          duration={3000}
          onClose={() => setStatusMessage(null)}
        />
      )}
      <div className="forgot-password-container">
        {/* forgot-password right */}
        <div className="forgot-password-container__img">
          <img
            className="forgot-password__img"
            src={img1}
            alt="Hình cái bánh"
          />
          <img
            className="forgot-password__logo"
            src={img2}
            alt="forgot-password logo"
          />
        </div>
        {/* forgot-password left */}
        <div className="forgot-password__left">
          <h1 className="forgot-password__title">QUÊN MẬT KHẨU</h1>
          <Loading isLoading={showLoading} />
          {!showLoading && (
            <form className="forgot-password__form" onSubmit={handleSendEmail}>
              <FormComponent
                id="emailInput"
                label="Email"
                type="email"
                placeholder="Nhập email"
                value={email}
                onChange={handleChange}
              />

              {/* back to login */}
              <div className="forgot-password__extend">
                <div onClick={handleBackLogin} className="forgot-password">
                  Quay lại đăng nhập
                </div>
              </div>
              <ButtonFormComponent type="submit" disabled={!isValid()}>
                Gửi
              </ButtonFormComponent>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
