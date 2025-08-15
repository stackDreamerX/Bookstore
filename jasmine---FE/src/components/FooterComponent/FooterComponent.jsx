import React from "react";
import "./FooterComponent.css";
import img1 from "../../assets/img/jasmine.png";

const FooterComponent = () => {
  return (
    <footer className="bookstore-footer">
      <div className="container">
        <div className="footer-grid">
          {/* Company Info */}
          <div className="footer-column company-info">
            <div className="footer-logo">
              <a href="/">
                <img src={img1} alt="BookStore Logo" />
              </a>
            </div>
            <p className="company-description">
              Tận hưởng niềm vui đọc sách với BookStore - Nơi mang đến thế giới văn học đa dạng với hàng ngàn đầu sách từ kinh điển đến đương đại.
            </p>
            <div className="footer-contact-info">
              <div className="contact-item">
                <i className="icon-location"></i>
                <p>6 Lê Văn Miếu, Thảo Điền, Thủ Đức, Hồ Chí Minh</p>
                  </div>
              <div className="contact-item">
                <i className="icon-phone"></i>
                <p>0999.888.777</p>
                  </div>
              <div className="contact-item">
                <i className="icon-mail"></i>
                <p>contact@bookstore.vn</p>
                  </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="footer-column quick-links">
            <h3 className="footer-heading">Khám Phá</h3>
            <ul className="footer-links">
              <li><a href="/sach-moi">Sách Mới</a></li>
              <li><a href="/bestsellers">Sách Bán Chạy</a></li>
              <li><a href="/authors">Tác Giả</a></li>
              <li><a href="/blog">Blog & Đánh Giá</a></li>
              <li><a href="/events">Sự Kiện</a></li>
              <li><a href="/promotions">Khuyến Mãi</a></li>
            </ul>
          </div>

          {/* Book Categories */}
          <div className="footer-column book-categories">
            <h3 className="footer-heading">Thể Loại Sách</h3>
            <ul className="footer-links">
              <li><a href="/category/van-hoc">Văn Học</a></li>
              <li><a href="/category/kinh-te">Kinh Tế</a></li>
              <li><a href="/category/tam-ly">Tâm Lý - Kỹ Năng Sống</a></li>
              <li><a href="/category/nuoi-day-con">Nuôi Dạy Con</a></li>
              <li><a href="/category/sach-thieu-nhi">Sách Thiếu Nhi</a></li>
              <li><a href="/category/ngoai-ngu">Sách Học Ngoại Ngữ</a></li>
            </ul>
            </div>

          {/* Customer Service */}
          <div className="footer-column customer-service">
            <h3 className="footer-heading">Dịch Vụ & Hỗ Trợ</h3>
            <ul className="footer-links">
              <li><a href="/account">Tài Khoản</a></li>
              <li><a href="/shipping">Vận Chuyển</a></li>
              <li><a href="/returns">Chính Sách Đổi Trả</a></li>
              <li><a href="/faq">Câu Hỏi Thường Gặp</a></li>
              <li><a href="/privacy">Chính Sách Bảo Mật</a></li>
              <li><a href="/terms">Điều Khoản Sử Dụng</a></li>
              </ul>
            </div>

          {/* Newsletter */}
          <div className="footer-column newsletter">
            <h3 className="footer-heading">Đăng Ký Nhận Tin</h3>
            <p>Nhận thông tin về sách mới, sự kiện và ưu đãi đặc biệt</p>
            <div className="newsletter-form">
              <input
                type="email"
                placeholder="Email của bạn"
                className="newsletter-input"
              />
              <button className="newsletter-button">Đăng Ký</button>
            </div>
            <div className="social-links">
              <h4>Kết Nối Với Chúng Tôi</h4>
              <div className="social-icons">
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
                  <i className="icon-facebook"></i>
                </a>
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
                  <i className="icon-instagram"></i>
                </a>
                <a href="https://tiktok.com" target="_blank" rel="noopener noreferrer">
                  <i className="icon-tiktok"></i>
                </a>
                <a href="https://youtube.com" target="_blank" rel="noopener noreferrer">
                  <i className="icon-youtube"></i>
                </a>
              </div>
            </div>
            </div>
          </div>

        {/* Payment Methods */}
        <div className="payment-methods">
          <h4>Phương Thức Thanh Toán</h4>
          <div className="payment-icons">
            <span className="payment-icon visa"></span>
            <span className="payment-icon mastercard"></span>
            <span className="payment-icon momo"></span>
            <span className="payment-icon zalopay"></span>
            <span className="payment-icon cod"></span>
            <span className="payment-icon banking"></span>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="footer-bottom">
          <div className="copyright">
            <p>© 2024 BookStore. Tất cả quyền được bảo lưu.</p>
          </div>
          <div className="footer-bottom-links">
            <a href="/sitemap">Sơ Đồ Trang</a>
            <a href="/accessibility">Trợ Năng</a>
            <a href="/contact">Liên Hệ</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default FooterComponent;
