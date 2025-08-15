import { React, useState, useEffect } from "react";
import "./NewsDetailPage.css";
import "../../../assets/css/style.css";
import { useNavigate, useLocation } from "react-router-dom";
import ButtonComponent from "../../../components/ButtonComponent/ButtonComponent";
const NewsDetailPage = () => {
    const navigate = useNavigate();
  const { state: newsData } = useLocation(); // Nhận dữ liệu từ `state`
  const [news, setNews] = useState(
    newsData || {
        newsTitle: "",
        newsContent:"",
        newsImage: null,
    }
  );


  const [imagePreview, setImagePreview] = useState(
    news.newsImage || null
  );
  return (
    <div>
      <div className="container-xl ">
        {/* title */}
        <div className="news">
          {/* news top */}
          <div className="news__top">
            <h1 className="news__title">Chi tiết tin tức</h1>
          </div>

          {/* news bot */}
          <div className="news__bot">
            {/* news left */}
            <div className="news__left">

                <img className="news__image" src={news.newsImage} alt="Ảnh cái bánh" />

              <div className="news__image--border"></div>
            </div>
            {/* news right */}
            <div className="news__right">
              <h4 className="news__paragraph--title">
                {news.newsTitle}
              </h4>
              <p className="news__paragraph--content">
               {news.newsContent}
              </p>
            </div>

          </div>

        </div>
        <ButtonComponent className="Exit_btn"
        onClick={()=>navigate("/news")}>Thoát</ButtonComponent>
      </div>
    </div>
  );
};

export default NewsDetailPage;
