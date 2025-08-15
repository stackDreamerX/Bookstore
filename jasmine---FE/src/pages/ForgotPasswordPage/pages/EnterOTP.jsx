import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import img2 from "../../../assets/img/jasmine.png";
import img1 from "../../../assets/img/book4.jpg";
import ButtonFormComponent from "../../../components/ButtonFormComponent/ButtonFormComponent";
import OTPComponent from "../../../components/OTPComponent/OTPComponent";
import * as AuthService from "../../../services/AuthService";
import Message from "../../../components/MessageComponent/Message";
import Loading from "../../../components/LoadingComponent/Loading";
import "./EnterOTP.css";

const EnterOTP = () => {
  const nav = useNavigate();
  const location = useLocation();
  const email = location.state?.email || "";
  const [statusMessage, setStatusMessage] = useState(null);

  const handleSendBackOTP = async () => {
    try {
      const response = await AuthService.forgotPassword(email);
      if (response.success) {
        setStatusMessage({
          type: "Success",
          message: "OTP mới đã được gửi!",
        });
      } else {
        setStatusMessage({
          type: "Error",
          message: response.message || "Lỗi khi gửi lại OTP.",
        });
      }
    } catch (error) {
      setStatusMessage({
        type: "Error",
        message: error.message || "Đã xảy ra lỗi. Vui lòng thử lại.",
      });
    }
  };

  const handleEnterOTP = async (e) => {
    e.preventDefault();
    const otpInputs = document.querySelectorAll(".input__otp");
    const otp = Array.from(otpInputs)
      .map((input) => input.value)
      .join("");

    if (otp.length !== otpInputs.length) {
      setStatusMessage({
        type: "Warning",
        message: "Vui lòng nhập đầy đủ mã OTP!",
      });
      return;
    }

    try {
      const response = await AuthService.verifyOTP(email, otp);
      if (response.success) {
        setStatusMessage({
          type: "Success",
          message: "OTP hợp lệ! Đang chuyển đến trang đặt mật khẩu mới...",
        });
        setTimeout(() => {
          nav("/forgot-password/new-password", { state: { email } });
        }, 1500);
      } else {
        setStatusMessage({
          type: "Error",
          message: "Mã OTP không hợp lệ!",
        });
      }
    } catch (error) {
      setStatusMessage({
        type: "Error",
        message: error.message || "Mã OTP không hợp lệ!",
      });
    }
  };

  return (
    <div className="container-xl container-enter-otp">
      {statusMessage && (
        <Message
          type={statusMessage.type}
          message={statusMessage.message}
          duration={3000}
          onClose={() => setStatusMessage(null)}
        />
      )}
      <div className="enter-otp-container">
        {/* enter-otp right */}
        <div className="enter-otp-container__img">
          <img className="enter-otp__img" src={img1} alt="Hình cái bánh" />
          <img className="enter-otp__logo" src={img2} alt="enter-otp logo" />
        </div>
        {/* enter-otp left */}
        <div className="enter-otp__left">
          <h1 className="enter-otp__title">QUÊN MẬT KHẨU</h1>

          <form className="enter-otp__form" onSubmit={handleEnterOTP}>
            <div className="otp__input">
              <OTPComponent />
              <OTPComponent />
              <OTPComponent />
              <OTPComponent />
            </div>
            {/* back to login */}
            <div className="enter-otp__extend">
              <div onClick={handleSendBackOTP} className="enter-otp">
                Bạn chưa nhận được OTP? <b>Gửi lại</b>
              </div>
            </div>
            <ButtonFormComponent type="submit">Xác nhận</ButtonFormComponent>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EnterOTP;
