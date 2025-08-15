import { React, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import CardNews from '../../../../components/CardNews/CardNews'
import news from '../../../../assets/img/news.jpg'
import './NewsPage.css'
import DropdownComponent from '../../../../components/DropdownComponent/DropdownComponent'
import AddBtn from '../../../../components/AddBtn(+)/AddBtn'
const NewsPageAdmin = () => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(0); // Trang hiện tại
  const [totalPages, setTotalPages] = useState(0);   // Tổng số trang

  const [news, setnews] = useState([]); // State lưu danh sách sản phẩm
  // const [categories, setCategories] = useState([]); // State lưu danh sách category
  // const [showModal, setShowModal] = useState(false);
  const [selectednews, setSelectednews] = useState(null); // Lưu ID sản phẩm cần xóa
  const [loading, setLoading] = useState(false);

  //Phan trang
  const Pagination = ({ currentPage, totalPages, onPageChange }) => {
    const pages = Array.from({ length: totalPages }, (_, index) => index);

    return (
      <div>
        {pages.map((page) => (
          <button className="pageNumber"
            key={page}
            onClick={() => onPageChange(page)}
            style={{ fontWeight: currentPage === page ? "bold" : "normal" }}
          >
            {page + 1}
          </button>
        ))}
      </div>
    );
  };

  // Fetch danh sách sản phẩm khi component được mount
  const fetchnews = async (page = 0, limit = 15) => {
    try {

      const response = await fetch(`http://localhost:3001/api/news/get-all-news?page=${page}&limit=${limit}`, {
        method: "GET", // Phương thức GET để lấy danh sách category
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch newss");
      }

      const data = await response.json(); // Chuyển đổi dữ liệu từ JSON
      console.log("newss:", data.data);
      setCurrentPage(page);  // Cập nhật trang hiện tại
      setTotalPages(Math.ceil(data.total / limit));  // Tính tổng số trang

      // Kiểm tra và gán mảng categories từ data.data
      if (Array.isArray(data.data)) {
        setnews(data.data); // Lưu danh sách category vào state
      } else {
        console.error("newss data is not in expected format");
      }
    } catch (error) {
      console.error("Error fetching newss:", error);
    }
  };




  useEffect(() => {
    fetchnews();
  }, []);

  //Xem chi tiet
  const handleDetail = (newsId) => {
    console.log("ID NEWS", newsId)
    const selectedNews = news.find((news) => news._id === newsId);

    if (selectedNews) {
      const {  newsImage, newsTitle, newsContent, _id } = selectedNews;
      console.log("DETAIL", _id)
      navigate("/admin/news-detail", {
        state: { newsImage, newsTitle, newsContent, _id },
      });
    } else {
      alert("News not found!");
    }
  };

  return (
    <div>
      <div className="productadmin__top">
        <h1 className="productadmin__title">TIN TỨC</h1>
      </div>
      <div style={{ marginLeft: 1222 }}>
        <AddBtn path={"/admin/news/add-news"} />
      </div>
      <div className='container-xl' 
              style={{
                display:'flex'
              }}>
      <div className='news-grid'>
        
        {news.length > 0 ? (
          news.map((news) => {
            const imageUrl = news.newsImage.startsWith("http")
              ? news.newsImage
              : `https://res.cloudinary.com/dlyl41lgq/image/upload/v2/${news.newsImage.replace("\\", "/")}`;

            //console.log("news image URL:", imageUrl);  // Debug URL ảnh
            return (
              
              <div key={news._id} className="news-grid-item">
             
              <CardNews
                 // Dùng _id làm key cho mỗi sản phẩm
                className="col productadmin__item"
                // type={"primary"}
                img={imageUrl} // Sử dụng URL ảnh đã xử lý
                title={news.newsTitle} // Hiển thị tên sản phẩm
                detail={news.newsContent}
                onClick={()=>handleDetail(news._id)}
                newsId={news._id}
              //description={news.newsDescription} // Mô tả sản phẩm
              />
              </div>
            );
          })

        ) : (
          <p>Không có tin tức nào</p>
        )}
        


          </div>
          </div>

          {/* <div style={{display:'inline-flex', marginTop:50, marginLeft:120}}>
       <DropdownComponent placeholder='Danh mục bài viết'
       className='CustomDropDown'
       ></DropdownComponent>
      </div> */}
        <div className="PageNumberHolder">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={(page) => fetchnews(page, 15)}
          />
        </div>
      </div>
    
  )
}

export default NewsPageAdmin