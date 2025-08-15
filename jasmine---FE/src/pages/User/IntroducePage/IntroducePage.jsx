import React from "react";
import "./IntroducePage.css";
import "../../../assets/css/style.css";
import book11 from "../../../assets/img/book8.jpg";
import book8 from "../../../assets/img/book8.jpg";
import book9 from "../../../assets/img/book9.jpg";
import book10 from "../../../assets/img/book10.jpg";
import { FaBookOpen, FaRegLightbulb, FaRegHeart } from "react-icons/fa";

const IntroducePage = () => {
  return (
    <div>
      <div className="container-xl introduce-container">
        {/* Hero Section */}
        <div className="introduce-hero">
          <div className="hero-overlay"></div>
          <div className="hero-content">
            <h1 className="hero-title">Chào mừng đến với Jasmine</h1>
            <p className="hero-subtitle">Nơi mỗi cuốn sách là một cuộc phiêu lưu</p>
          </div>
        </div>

        {/* Main Content */}
        <div className="introduce">
          {/* Our Story Section */}
          <div className="introduce-section">
            <div className="section-header">
              <h2 className="section-title">Giới thiệu về chúng tôi</h2>
              <div className="title-underline"></div>
            </div>

            <div className="introduce__bot">
              <div className="introduce__left">
                <div className="introduce__image animate-hover">
                  <img src={book8} alt="Tủ sách tại Jasmine" />
                  <div className="image-caption">Không gian đọc sách tại Jasmine</div>
                </div>
              </div>
              <div className="introduce__right">
                <p className="introduce__paragraph--content elegant-text">
                  Jasmine Bookstore ra đời từ niềm đam mê sách vô bờ và khát khao tạo nên một không gian
                  văn hóa đọc đích thực tại Việt Nam. Chúng tôi tin rằng mỗi cuốn sách không chỉ là trang giấy
                  và mực in, mà là những cánh cửa mở ra vô vàn thế giới kỳ diệu.
                </p>
                <p className="introduce__paragraph--content elegant-text">
                  Từ những ngày đầu tiên với một kệ sách nhỏ, Jasmine đã phát triển thành một thương hiệu
                  được yêu mến với bộ sưu tập đa dạng từ văn học kinh điển đến những tác phẩm đương đại,
                  từ sách chuyên ngành học thuật đến sách giải trí cho mọi lứa tuổi.
                </p>
              </div>
            </div>
          </div>

          {/* Book Collection Showcase */}
          <div className="book-showcase">
            <h2 className="showcase-title">Bộ sưu tập sách đặc sắc</h2>
            <div className="showcase-grid">
              <div className="book-item">
                <img src={book11} alt="Book collection" />
                <div className="book-overlay">
                  <div className="book-category">Văn học</div>
                </div>
              </div>
              <div className="book-item">
                <img src={book8} alt="Book collection" />
                <div className="book-overlay">
                  <div className="book-category">Kinh tế</div>
                </div>
              </div>
              <div className="book-item">
                <img src={book9} alt="Book collection" />
                <div className="book-overlay">
                  <div className="book-category">Kỹ năng sống</div>
                </div>
              </div>
              <div className="book-item">
                <img src={book10} alt="Book collection" />
                <div className="book-overlay">
                  <div className="book-category">Sách thiếu nhi</div>
                </div>
              </div>
            </div>
          </div>

          {/* Mission & Vision */}
          <div className="introduce-section vision-section">
            <div className="section-header">
              <h2 className="section-title">Sứ mệnh & Tầm nhìn</h2>
              <div className="title-underline"></div>
            </div>

            <div className="values-container">
              <div className="value-card">
                <div className="value-icon"><FaBookOpen /></div>
                <h3>Lan tỏa văn hóa đọc</h3>
                <p>Chúng tôi cam kết lan tỏa niềm đam mê đọc sách đến mọi người, mọi nhà.</p>
              </div>

              <div className="value-card">
                <div className="value-icon"><FaRegLightbulb /></div>
                <h3>Truyền cảm hứng</h3>
                <p>Mỗi cuốn sách là nguồn cảm hứng cho sự sáng tạo và đổi mới trong cuộc sống.</p>
              </div>

              <div className="value-card">
                <div className="value-icon"><FaRegHeart /></div>
                <h3>Kết nối cộng đồng</h3>
                <p>Tạo nên cộng đồng những người yêu sách, nơi chia sẻ và phát triển cùng nhau.</p>
              </div>
            </div>

            <div className="introduce__bot reversed">
              <div className="introduce__right">
                <p className="introduce__paragraph--content elegant-text">
                  Với đội ngũ nhân viên am hiểu sâu sắc về sách và văn học, chúng tôi không chỉ bán sách
                  mà còn kiến tạo trải nghiệm đọc sách trọn vẹn. Jasmine nỗ lực trở thành điểm đến
                  lý tưởng cho những tâm hồn yêu sách, nơi mà mỗi khách hàng đều tìm thấy những câu chuyện
                  đồng điệu với tâm hồn mình.
                </p>
                <p className="introduce__paragraph--content elegant-text">
                  Chúng tôi tin rằng việc đọc sách thay đổi cuộc sống, và Jasmine tự hào được đồng hành
                  trên hành trình khám phá tri thức này cùng bạn.
                </p>
              </div>
              <div className="introduce__left">
                <div className="introduce__image animate-hover">
                  <img src={book9} alt="Không gian đọc sách" />
                  <div className="image-caption">Không gian Jasmine Bookstore</div>
                </div>
              </div>
            </div>
          </div>

          {/* Quote Section */}
          <div className="quote-section">
            <blockquote>
              "Một cuốn sách hay cho ta một điều tốt, một người bạn tốt cho ta một điều hay"
              <cite>— Gustavé Lebon</cite>
            </blockquote>
          </div>

          {/* Invitation */}
          <div className="invitation-section">
            <h3>Hãy đến với Jasmine Bookstore và bắt đầu hành trình đọc sách của bạn ngay hôm nay!</h3>
            <button className="explore-button">Khám phá bộ sưu tập</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IntroducePage;
