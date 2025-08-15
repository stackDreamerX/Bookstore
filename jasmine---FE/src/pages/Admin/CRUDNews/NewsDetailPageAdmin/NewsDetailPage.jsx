import { React, useState, useEffect } from "react";
import "./NewsDetailPage.css";
// import "../../../assets/css/style.css";
import { useNavigate, useLocation } from "react-router-dom";
// import img1 from "../../../assets/img/hero_2.jpg";
import ButtonComponent from "../../../../components/ButtonComponent/ButtonComponent";
import { deleteNews } from "../../../../services/NewsService";
const NewsDetailPage = () => {
  const accessToken = localStorage.getItem("access_token");
    const navigate = useNavigate();
  const { state: newsData } = useLocation(); // Nhận dữ liệu từ `state`
  const [news, setNews] = useState(
    newsData || {
        newsTitle: "",
        newsContent:"",
        newsImage: null,
        newsId:""
    }
  );


  const [imagePreview, setImagePreview] = useState(
    news.newsImage || null
  );

  const handleClickDelete = async (id) => {
    try {
      if (!id) return alert("Không tìm thấy ID của tin tức.");
      
      // Xác nhận trước khi xóa
      const confirmDelete = window.confirm("Bạn có chắc chắn muốn xóa tin tức này?");
      if (!confirmDelete) return;

      await deleteNews(id, accessToken);
      alert("Tin tức đã được xóa thành công.");
      navigate("/admin/news");
    } catch (error) {
      alert("Có lỗi xảy ra khi xóa tin tức.");
    }
  };
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
        <div className="btn_holder">
        <ButtonComponent className="Exit_btn"
        onClick={()=>handleClickDelete(news._id)}>Xoá</ButtonComponent>
        <ButtonComponent 
        onClick={()=>navigate("/admin/news")}>Thoát</ButtonComponent>
        </div>
      </div>
    </div>
  );
};

export default NewsDetailPage;
