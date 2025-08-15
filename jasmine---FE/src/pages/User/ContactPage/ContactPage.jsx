import React from "react";
import "./ContactPage.css";
import address from "../../../assets/img/address.png";
import { FaMapMarkerAlt, FaEnvelope, FaGlobe, FaPhone, FaHeadset } from "react-icons/fa";

const ContactPage = () => {
  return (
    <div className="contact-container">
      <div className="contact-header">
        <h1>LIÊN HỆ</h1>
        <div className="contact-header-line"></div>
      </div>

      <div className="contact-content">
        <div className="contact-info">
          <div className="company-info">
            <h2>Công ty TNHH jasmine</h2>

            <div className="info-item">
              <FaMapMarkerAlt className="info-icon" />
              <span>6 Lê Văn Miếu, Thảo Điền, Thủ Đức, Hồ Chí Minh</span>
            </div>

            <div className="info-item">
              <FaEnvelope className="info-icon" />
              <span>Jasmine@gmail.com</span>
            </div>

            <div className="info-item">
              <FaGlobe className="info-icon" />
              <span>jasmine.com</span>
            </div>
          </div>

          <div className="hotline-info">
            <h2>Hotline</h2>

            <div className="info-item">
              <FaPhone className="info-icon" />
              <span>123456789</span>
            </div>

            <div className="info-item">
              <FaHeadset className="info-icon" />
              <span>CSKH: 0999999999</span>
            </div>
          </div>

          <div className="contact-form">
            <h2>Gửi thông tin liên hệ</h2>
            <form>
              <input type="text" placeholder="Họ và tên" />
              <input type="email" placeholder="Email" />
              <input type="tel" placeholder="Số điện thoại" />
              <textarea placeholder="Nội dung"></textarea>
              <button type="submit">Gửi</button>
            </form>
          </div>
        </div>

        <div className="map-container">
          <a href="https://maps.app.goo.gl/qNAEBGWq3mkNYbC29" target="_blank" rel="noopener noreferrer">
            <img src={address} alt="Địa chỉ công ty" />
          </a>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
