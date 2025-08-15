import React from "react";
import { useNavigate } from "react-router-dom";
import { Container, Row, Col, Button } from "react-bootstrap";
import { FaHome, FaArrowLeft } from "react-icons/fa";
import "./NotFoundPage.css";

const NotFoundPage = () => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleGoHome = () => {
    navigate("/");
  };

  return (
    <Container className="not-found-container">
      <div className="not-found-card">
        <div className="error-icon">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#e74c3c" width="48" height="48">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
          </svg>
        </div>

        <h1 className="error-code">404</h1>

        <h2 className="error-title">Trang không tìm thấy</h2>

        <p className="error-message">
          Xin lỗi, trang bạn đang tìm kiếm không tồn tại hoặc đã bị di chuyển.
        </p>

        <div className="error-actions">
          <Button
            variant="light"
            className="back-button"
            onClick={handleGoBack}
          >
            <FaArrowLeft /> Quay lại
          </Button>

          <Button
            variant="danger"
            className="home-button"
            onClick={handleGoHome}
          >
            <FaHome /> Trang chủ
          </Button>
        </div>
      </div>
    </Container>
  );
};

export default NotFoundPage;
