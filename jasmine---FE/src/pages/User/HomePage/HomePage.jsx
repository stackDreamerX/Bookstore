import React, { useEffect, useState } from "react";
import SliderComponent from "../../../components/SliderComponent/SliderComponent";
import CardProduct from "../../../components/CardProduct/CardProduct";
import book1 from "../../../assets/img/book1.jpg";
import book2 from "../../../assets/img/book2.jpg";
import book3 from "../../../assets/img/book3.jpg";
import book5 from "../../../assets/img/book5.jpg";
import ButtonNoBGComponent from "../../../components/ButtonNoBGComponent/ButtonNoBGComponent";
import LinesEllipsis from "react-lines-ellipsis";
import CardNews from "../../../components/CardNews/CardNews";
import news from "../../../assets/img/news.jpg";
import ButtonComponent from "../../../components/ButtonComponent/ButtonComponent";
import { useNavigate } from "react-router-dom";
import {
  getAllDiscount,
  deleteDiscount,
} from "../../../services/DiscountService";
import { getAllNews } from "../../../services/NewsService";
import { getAllCategory } from "../../../services/CategoryService";
import { getAllproduct, getProductsByCategory } from "../../../services/productServices";
const text =
  "Là một hệ thống đội ngũ nhân viên và lãnh đạo chuyên nghiệp, gồm CBCNV và những người thợ đã có kinh nghiệm lâu năm trong các công ty đầu ngành. Mô hình vận hành hoạt động công ty được bố trí theo chiều ngang, làm gia tăng sự thuận tiện trong việc vận hành cỗ máy kinh doanh và gia tăng sự phối hợp thống nhất giữa các bộ phận trong công ty.";

const HomePage = () => {
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [promos, setPromos] = useState([]);
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState("");
  const [arrImgs, setArrImg] = useState([]); // State lưu trữ mảng hình ảnh
  const [products, setProducts] = useState([]); // State lưu danh sách sản phẩm
  const [currentCategory, setCurrentCategory] = useState(null); // State lưu category hiện tại
  const [currentPage, setCurrentPage] = useState(0); // Trang hiện tại
  const [totalPages, setTotalPages] = useState(0); // Tổng số trang
  const navigate = useNavigate();
  const handleClick = (path) => {
    navigate(path);
  };
  const [newsList, setNewsList] = useState([]);

  // Fetch danh sách khuyến mãi
  useEffect(() => {
    const fetchDiscounts = async () => {
      try {
        const discounts = await getAllDiscount();
        console.log("TYU", discounts);
        if (Array.isArray(discounts.data)) {
          setPromos(discounts.data); // Lưu danh sách khuyến mãi
          console.log("HBJK");
          const images = Array.isArray(discounts.data)
            ? discounts.data
                .map((discount) => discount?.discountImage)
                .filter(Boolean)
            : [];

          console.log("IMG", images);
          setArrImg(images);
          console.log("IMFGH", arrImgs);
        } else {
          setError("Dữ liệu trả về không hợp lệ.");
        }
      } catch (err) {
        setError(err.message || "Không thể tải danh sách khuyến mãi.");
      }
    };
    fetchDiscounts();
  }, []);

  // Hàm xử lý khi click vào một ảnh slider
  const handleSliderImageClick = (clickedImage) => {
    // Tìm khuyến mãi có ảnh đó
    const promo = promos.find((promo) => promo.discountImage === clickedImage);
    console.log("PROMOS", promo);
    if (promo) {
      const categoryIds = promo.applicableCategory || [];
      console.log(categoryIds);
      // Điều hướng đến trang sản phẩm với queryParams chứa categoryIds
      navigate("/products", { state: { categoryIds } });
    }
  };

  //Lấy danh sách tin tức:
  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await getAllNews();

        if (Array.isArray(response.data)) {
          setNewsList(response.data.slice(0, 3)); // Chỉ lấy 3 tin tức đầu
        } else {
          setError("Dữ liệu trả về không hợp lệ.");
        }
      } catch (err) {
        setError(err.message || "Không thể tải danh sách tin tức.");
      }
    };
    fetchNews();
  }, []);

  //Xem chi tiet
  const handleDetailNews = (newsId) => {
    console.log("ID NEWS", newsId);
    const selectedNews = newsList.find((item) => item._id === newsId);
    console.log("VB", selectedNews);

    if (selectedNews) {
      const { newsImage, newsTitle, newsContent } = selectedNews;
      navigate("/news-detail", {
        state: { newsImage, newsTitle, newsContent },
      });
    } else {
      alert("News not found!");
    }
  };

  // Lay danh sach category
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await getAllCategory();
        console.log ("RES", response)
        // if (!response.ok) {
        //   throw new Error("Failed to fetch categories");
        // }

        // const data = await response.json();

          setCategories(response.data); // Lưu danh sách category vào state
          console.log("GGHH", categories);
          // Lấy category đầu tiên và fetch sản phẩm tương ứng
          if (response.data.length > 0) {
            const firstCategoryId = response.data[0]._id;
            setCurrentCategory(firstCategoryId); // Lưu category đầu tiên
            fetchProducts(0, 9, firstCategoryId); // Fetch sản phẩm của category đầu tiên
          }

      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, []);

  // Fetch danh sách sản phẩm khi component được mount
  const fetchProducts = async (page = 0, limit = 9, categoryId = null) => {
    try {


    const response= await getProductsByCategory(categoryId);


      console.log("FDS", response);
      console.log("GVHNJ", response.data);
      // setCurrentPage(page); // Cập nhật trang hiện tại
      // setTotalPages(Math.ceil(data.data.lenght / limit)); // Tính tổng số trang

      if (Array.isArray(response.data)) {
        setProducts(response.data.slice(0, 4));
      } else {
        console.error("Products data is not in expected format");
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  // Khi nhấn vào sản phẩm
  const handleDetailProduct = (productId) => {
    const selectedProduct = products.find(
      (product) => product._id === productId
    );

    if (selectedProduct) {
      const {
        productName,
        productSize,
        productImage,
        productCategory,
        productDescription,
        productPrice,
      } = selectedProduct;
      navigate("/view-product-detail", {
        state: {
          productId,
          productName,
          productSize,
          productImage,
          productDescription,
          productCategory,
          productPrice,
        },
      });
    } else {
      alert("Product not found!");
    }
  };

  //Click categoryName:
  const handleCategoryClick = (categoryId) => {
    console.log("Category clicked:", categoryId);
    setCurrentCategory(categoryId); // Lưu categoryId để lọc sản phẩm
    setCurrentPage(0); // Reset trang về 0 khi chuyển qua category mới
    fetchProducts(0, 9, categoryId); // Fetch sản phẩm theo category
  };

  return (
    <div>
      {/* Hero Section */}
      <div style={{
        width: "100%",
        position: "relative",
        overflow: "hidden",
        height: "600px",
        marginBottom: "50px"
      }}>
        <div style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          background: `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.5)), url(${book3})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          filter: "brightness(0.9)"
        }}></div>

        <div style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          textAlign: "center",
          width: "90%",
          maxWidth: "1000px",
          zIndex: 2
        }}>
          <h1 style={{
            color: "white",
            fontSize: "4rem",
            fontFamily: "'Playfair Display', serif",
            marginBottom: "20px",
            textShadow: "2px 2px 4px rgba(0,0,0,0.5)"
          }}>
            Chào mừng đến với Jasmine Books
          </h1>

          <p style={{
            color: "white",
            fontSize: "1.5rem",
            marginBottom: "40px",
            textShadow: "1px 1px 3px rgba(0,0,0,0.5)",
            fontWeight: "300"
          }}>
            Khám phá thế giới qua từng trang sách
          </p>

          <div style={{
            display: "flex",
            justifyContent: "center",
            gap: "20px"
          }}>
            <button style={{
              background: "white",
              color: "#334e68",
              border: "none",
              padding: "15px 30px",
              fontSize: "1.3rem",
              borderRadius: "30px",
              cursor: "pointer",
              fontWeight: "600",
              boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
              transition: "all 0.3s ease"
            }} onClick={() => handleClick("/products")}>
              Khám phá sách
            </button>

            <button style={{
              background: "transparent",
              color: "white",
              border: "2px solid white",
              padding: "15px 30px",
              fontSize: "1.3rem",
              borderRadius: "30px",
              cursor: "pointer",
              fontWeight: "600",
              transition: "all 0.3s ease"
            }} onClick={() => handleClick("/introduce")}>
              Giới thiệu
            </button>
          </div>
        </div>
      </div>

      {/* Original Banner */}
      <div>
        <SliderComponent
          arrImg={arrImgs}
          onImageClick={handleSliderImageClick}
        />
      </div>

      {/* Book Categories Section */}
      <div style={{
        padding: "70px 20px",
        maxWidth: "1200px",
        margin: "0 auto"
      }}>
        <h2 style={{
          fontSize: "2.8rem",
          color: "#2d3748",
          fontFamily: "'Playfair Display', serif",
          marginBottom: "40px",
          textAlign: "center",
          position: "relative"
        }}>
          Thể Loại Sách
          <div style={{
            height: "3px",
            width: "60px",
            background: "linear-gradient(90deg, #627d98, #334e68)",
            borderRadius: "2px",
            margin: "15px auto 0"
          }}></div>
        </h2>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "25px",
          margin: "0 auto",
          maxWidth: "1000px"
        }}>
          <div style={{
            background: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.7)), url(${book1})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            height: "280px",
            borderRadius: "15px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-end",
            cursor: "pointer",
            position: "relative",
            overflow: "hidden",
            transition: "transform 0.3s ease, box-shadow 0.3s ease",
            boxShadow: "0 10px 20px rgba(0,0,0,0.1)"
          }} onClick={() => handleClick("/products")}>
            <div style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              background: "rgba(0,0,0,0.3)",
              transition: "background 0.3s ease"
            }}></div>
            <div style={{
              padding: "25px 20px",
              position: "relative",
              zIndex: "1",
              background: "linear-gradient(transparent, rgba(0,0,0,0.8))"
            }}>
              <h3 style={{
                color: "white",
                fontSize: "1.8rem",
                fontWeight: "bold",
                textAlign: "center",
                marginBottom: "8px"
              }}>Văn Học</h3>
              <p style={{
                color: "rgba(255,255,255,0.8)",
                fontSize: "1.1rem",
                textAlign: "center",
                margin: 0
              }}>Khám phá thế giới qua từng trang sách</p>
            </div>
          </div>

          <div style={{
            background: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.7)), url(${book2})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            height: "280px",
            borderRadius: "15px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-end",
            cursor: "pointer",
            position: "relative",
            overflow: "hidden",
            transition: "transform 0.3s ease, box-shadow 0.3s ease",
            boxShadow: "0 10px 20px rgba(0,0,0,0.1)"
          }} onClick={() => handleClick("/products")}>
            <div style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              background: "rgba(0,0,0,0.3)",
              transition: "background 0.3s ease"
            }}></div>
            <div style={{
              padding: "25px 20px",
              position: "relative",
              zIndex: "1",
              background: "linear-gradient(transparent, rgba(0,0,0,0.8))"
            }}>
              <h3 style={{
                color: "white",
                fontSize: "1.8rem",
                fontWeight: "bold",
                textAlign: "center",
                marginBottom: "8px"
              }}>Kinh Tế</h3>
              <p style={{
                color: "rgba(255,255,255,0.8)",
                fontSize: "1.1rem",
                textAlign: "center",
                margin: 0
              }}>Sách kinh doanh và tài chính</p>
            </div>
          </div>

          <div style={{
            background: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.7)), url(${book5})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            height: "280px",
            borderRadius: "15px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-end",
            cursor: "pointer",
            position: "relative",
            overflow: "hidden",
            transition: "transform 0.3s ease, box-shadow 0.3s ease",
            boxShadow: "0 10px 20px rgba(0,0,0,0.1)"
          }} onClick={() => handleClick("/products")}>
            <div style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              background: "rgba(0,0,0,0.3)",
              transition: "background 0.3s ease"
            }}></div>
            <div style={{
              padding: "25px 20px",
              position: "relative",
              zIndex: "1",
              background: "linear-gradient(transparent, rgba(0,0,0,0.8))"
            }}>
              <h3 style={{
                color: "white",
                fontSize: "1.8rem",
                fontWeight: "bold",
                textAlign: "center",
                marginBottom: "8px"
              }}>Giáo Dục</h3>
              <p style={{
                color: "rgba(255,255,255,0.8)",
                fontSize: "1.1rem",
                textAlign: "center",
                margin: 0
              }}>Sách học tập và giáo trình</p>
            </div>
          </div>

          <div style={{
            background: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.7)), url(${book3})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            height: "280px",
            borderRadius: "15px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-end",
            cursor: "pointer",
            position: "relative",
            overflow: "hidden",
            transition: "transform 0.3s ease, box-shadow 0.3s ease",
            boxShadow: "0 10px 20px rgba(0,0,0,0.1)"
          }} onClick={() => handleClick("/products")}>
            <div style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              background: "rgba(0,0,0,0.3)",
              transition: "background 0.3s ease"
            }}></div>
            <div style={{
              padding: "25px 20px",
              position: "relative",
              zIndex: "1",
              background: "linear-gradient(transparent, rgba(0,0,0,0.8))"
            }}>
              <h3 style={{
                color: "white",
                fontSize: "1.8rem",
                fontWeight: "bold",
                textAlign: "center",
                marginBottom: "8px"
              }}>Lịch Sử</h3>
              <p style={{
                color: "rgba(255,255,255,0.8)",
                fontSize: "1.1rem",
                textAlign: "center",
                margin: 0
              }}>Khám phá quá khứ qua từng trang sách</p>
            </div>
          </div>
        </div>
      </div>

      {/* Sản phẩm */}
      <div style={{
        width: "100%",
        marginTop: 80,
        padding: "50px 20px 80px",
        background: "linear-gradient(135deg, #f5f7fa 0%, #e4e8f0 100%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center"
      }}>
        <h2 style={{
          fontSize: "2.8rem",
          color: "#2d3748",
          fontFamily: "'Playfair Display', serif",
          marginBottom: "40px",
          textAlign: "center",
          position: "relative"
        }}>
          SẢN PHẨM
          <div style={{
            height: "3px",
            width: "60px",
            background: "linear-gradient(90deg, #627d98, #334e68)",
            borderRadius: "2px",
            margin: "15px auto 0"
          }}></div>
        </h2>

        <div style={{
          textAlign: "center",
          maxWidth: "1000px",
          margin: "0 auto 20px",
          padding: "0 20px"
        }}>
          <p style={{
            fontSize: "2rem",
            color: "#4a5568",
            margin: "0 0 30px"
          }}>
            Khám phá bộ sưu tập sách đa dạng của chúng tôi
          </p>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            paddingBottom: 35,
            maxWidth: "1000px",
            margin: "0 auto 40px",
            flexWrap: "wrap",
            gap: "20px",
            paddingLeft: "20px",
            paddingRight: "20px"
          }}
        >
          {categories.map((category) => (
            <button
              key={category._id}
              onClick={() => handleCategoryClick(category._id)}
              style={{
                fontSize: "2.2rem",
                padding: "12px 25px",
                fontWeight: category._id === currentCategory ? "600" : "normal",
                color: category._id === currentCategory ? "#334e68" : "#627d98",
                borderBottom: "none",
                background: category._id === currentCategory ? "#f0f4f8" : "transparent",
                border: "none",
                borderRadius: category._id === currentCategory ? "5px" : "0",
                cursor: "pointer",
                transition: "all 0.3s ease",
                margin: "0 5px",
                position: "relative",
                textAlign: "center"
              }}
            >
              {category.categoryName}
              {category._id === currentCategory && (
                <div style={{
                  position: "absolute",
                  bottom: "0",
                  left: "50%",
                  transform: "translateX(-50%)",
                  width: "40px",
                  height: "3px",
                  background: "#334e68",
                  borderRadius: "3px"
                }}></div>
              )}
            </button>
          ))}
        </div>
        {/* 1 tab */}
        {/* <Row
          style={{
            maxWidth: 1000,
            margin: 'auto'

          }}>
          <Col style={{ marginTop: "10px" }}>
            <CardProduct type={"primary"} img={image1} title={"Chocolate Sweet Cream"} price={"250.000 VND"} />
          </Col>
          <Col style={{ marginTop: "10px" }}>
            <CardProduct type={"primary"} img={image1} title={"Chocolate Sweet Cream"} price={"250.000 VND"} />
          </Col>
          <Col style={{ marginTop: "10px" }}>
            <CardProduct type={"primary"} img={image1} title={"Chocolate Sweet Cream"} price={"250.000 VND"} />
          </Col>
          <Col style={{ marginTop: "10px" }}>
            <CardProduct type={"primary"} img={image1} title={"Chocolate Sweet Cream"} price={"250.000 VND"} />
          </Col>
        </Row> */}
        <div style={{
          width: "100%",
          display: "flex",
          justifyContent: "center",
          paddingLeft: "20px",
          paddingRight: "20px"
        }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              maxWidth: "1000px",
              margin: "0 auto",
              gap: "25px",
              paddingBottom: 50,
              paddingLeft: "20px",
              paddingRight: "20px",
              justifyContent: "center",
              width: "100%"
            }}
          >
            {products.map((product) => (
              <CardProduct
                key={product._id}
                id={product._id}
                type={"primary"}
                img={product.productImage}
                title={product.productName}
                price={product.productPrice}
                onClick={() => handleDetailProduct(product._id)}
              />
            ))}
          </div>
        </div>

        <div
          style={{
            marginBottom: 50,
          }}
        >
          <ButtonComponent
            onClick={() => handleClick("/products")}
            style={{
              margin: "auto",
            }}
          >
            Xem thêm{" "}
          </ButtonComponent>
        </div>
      </div>

      {/* Cau chuyen jasmine */}
      <div style={{
        padding: "80px 20px",
        background: "linear-gradient(135deg, #f0f4f8 0%, #d9e2ec 100%)"
      }}>
        <div style={{
          maxWidth: "1200px",
          margin: "0 auto"
        }}>
          <div style={{ textAlign: "center", marginBottom: "50px" }}>
            <h2 style={{
              fontSize: "3.3rem",
              color: "#2d3748",
              fontFamily: "'Playfair Display', serif",
              marginBottom: "15px"
            }}>
              Tin Tức & Sự Kiện
            </h2>
            <p style={{
              fontSize: "1.3rem",
              color: "#4a5568",
              maxWidth: "700px",
              margin: "0 auto"
            }}>
              Cập nhật những tin tức mới nhất về sách, sự kiện văn hóa đọc và các hoạt động tại Jasmine Books
            </p>
          </div>

          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "30px"
          }}>
            {newsList.map((newsItem, index) => (
              <div
                key={newsItem._id}
                style={{
                  background: "white",
                  borderRadius: "12px",
                  overflow: "hidden",
                  boxShadow: "0 10px 15px rgba(0,0,0,0.05)",
                  transition: "transform 0.3s ease",
                  cursor: "pointer"
                }}
                onClick={() => handleDetailNews(newsItem._id)}
              >
                <div style={{
                  height: "200px",
                  overflow: "hidden"
                }}>
                  <img
                    src={newsItem.newsImage || news}
                    alt={newsItem.newsTitle}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      transition: "transform 0.5s ease"
                    }}
                  />
                </div>

                <div style={{ padding: "25px" }}>
                  <div style={{
                    display: "inline-block",
                    fontSize: "0.95rem",
                    fontWeight: "600",
                    color: "#627d98",
                    background: "#f0f4f8",
                    padding: "5px 12px",
                    borderRadius: "20px",
                    marginBottom: "15px"
                  }}>
                    Tin tức
                  </div>

                  <h3 style={{
                    fontSize: "1.45rem",
                    fontWeight: "700",
                    marginBottom: "15px",
                    color: "#334e68",
                    display: "-webkit-box",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    WebkitLineClamp: "2",
                    WebkitBoxOrient: "vertical",
                    lineHeight: "1.5"
                  }}>
                    {newsItem.newsTitle}
                  </h3>

                  <p style={{
                    fontSize: "1.2rem",
                    color: "#486581",
                    marginBottom: "20px",
                    display: "-webkit-box",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    WebkitLineClamp: "3",
                    WebkitBoxOrient: "vertical",
                    lineHeight: "1.6"
                  }}>
                    {newsItem.newsContent}
                  </p>

                  <div style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    borderTop: "1px solid #e4e7eb",
                    paddingTop: "15px"
                  }}>
                    <span style={{
                      fontSize: "1.0rem",
                      color: "#829ab1"
                    }}>
                      {new Date(newsItem.createdAt || new Date()).toLocaleDateString('vi-VN')}
                    </span>

                    <button style={{
                      background: "transparent",
                      border: "none",
                      color: "#334e68",
                      fontWeight: "600",
                      fontSize: "1.1rem",
                      display: "flex",
                      alignItems: "center",
                      gap: "5px",
                      cursor: "pointer"
                    }}>
                      Đọc tiếp
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="#334e68" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div style={{ textAlign: "center", marginTop: "50px" }}>
            <button
              onClick={() => handleClick("/blogs")}
              style={{
                background: "transparent",
                color: "#334e68",
                border: "2px solid #334e68",
                borderRadius: "30px",
                padding: "12px 25px",
                fontSize: "1.2rem",
                fontWeight: "bold",
                cursor: "pointer",
                transition: "all 0.3s ease",
                display: "inline-flex",
                alignItems: "center",
                gap: "10px"
              }}
            >
              Xem tất cả tin tức
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="#334e68" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Featured Recommendations */}
      <div style={{
        padding: "80px 20px",
        background: "linear-gradient(to right, #edf2f7, #e2e8f0)"
      }}>
        <div style={{
          maxWidth: "1200px",
          margin: "0 auto"
        }}>
          <div style={{ textAlign: "center", marginBottom: "50px" }}>
            <h2 style={{
              fontSize: "2.8rem",
              color: "#2d3748",
              fontFamily: "'Playfair Display', serif",
              marginBottom: "15px"
            }}>
              Sách Đề Xuất
            </h2>
            <p style={{
              fontSize: "1.3rem",
              color: "#4a5568",
              maxWidth: "700px",
              margin: "0 auto"
            }}>
              Những cuốn sách nổi bật được độc giả yêu thích và đánh giá cao
            </p>
          </div>

          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
            gap: "30px"
          }}>
            <div style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              padding: "30px",
              background: "white",
              borderRadius: "15px",
              boxShadow: "0 10px 25px rgba(0,0,0,0.05)",
              position: "relative",
              overflow: "hidden"
            }}>
              <div style={{
                position: "absolute",
                top: "15px",
                right: "15px",
                background: "#e53e3e",
                color: "white",
                padding: "5px 12px",
                fontSize: "0.8rem",
                fontWeight: "bold",
                borderRadius: "20px",
                zIndex: "1"
              }}>
                Bestseller
              </div>

              <img
                src={book1}
                alt="Book Cover"
                style={{
                  width: "180px",
                  height: "250px",
                  objectFit: "cover",
                  borderRadius: "5px",
                  boxShadow: "0 10px 20px rgba(0,0,0,0.1)",
                  marginBottom: "20px"
                }}
              />

              <h3 style={{
                fontSize: "1.4rem",
                fontWeight: "700",
                textAlign: "center",
                marginBottom: "10px",
                color: "#2d3748"
              }}>
                Khởi Nghiệp Thông Minh
              </h3>

              <p style={{
                fontSize: "1.2rem",
                color: "#718096",
                marginBottom: "10px",
                textAlign: "center"
              }}>
                Tác giả: Nguyễn Văn A
              </p>

              <div style={{
                display: "flex",
                alignItems: "center",
                marginBottom: "15px"
              }}>
                <div style={{ display: "flex" }}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <svg key={star} width="16" height="16" viewBox="0 0 24 24" fill="#f6ad55">
                      <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                    </svg>
                  ))}
                </div>
                <span style={{ marginLeft: "5px", fontSize: "0.9rem", color: "#718096" }}>
                  (124)
                </span>
              </div>

              <p style={{
                fontSize: "1.4rem",
                fontWeight: "bold",
                color: "#c05621",
                marginBottom: "20px"
              }}>
                280.000 VND
              </p>

              <button style={{
                background: "#4a5568",
                color: "white",
                border: "none",
                borderRadius: "25px",
                padding: "10px 20px",
                fontSize: "0.9rem",
                fontWeight: "bold",
                cursor: "pointer",
                transition: "all 0.3s ease",
                width: "100%"
              }} onClick={() => handleClick("/products")}>
                Thêm vào giỏ hàng
              </button>
            </div>

            <div style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              padding: "30px",
              background: "white",
              borderRadius: "15px",
              boxShadow: "0 10px 25px rgba(0,0,0,0.05)",
              position: "relative",
              overflow: "hidden"
            }}>
              <img
                src={book2}
                alt="Book Cover"
                style={{
                  width: "180px",
                  height: "250px",
                  objectFit: "cover",
                  borderRadius: "5px",
                  boxShadow: "0 10px 20px rgba(0,0,0,0.1)",
                  marginBottom: "20px"
                }}
              />

              <h3 style={{
                fontSize: "1.4rem",
                fontWeight: "700",
                textAlign: "center",
                marginBottom: "10px",
                color: "#2d3748"
              }}>
                Sức Mạnh Của Thói Quen
              </h3>

              <p style={{
                fontSize: "1.2rem",
                color: "#718096",
                marginBottom: "10px",
                textAlign: "center"
              }}>
                Tác giả: Charles Duhigg
              </p>

              <div style={{
                display: "flex",
                alignItems: "center",
                marginBottom: "15px"
              }}>
                <div style={{ display: "flex" }}>
                  {[1, 2, 3, 4].map((star) => (
                    <svg key={star} width="16" height="16" viewBox="0 0 24 24" fill="#f6ad55">
                      <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                    </svg>
                  ))}
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="#e2e8f0">
                    <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                  </svg>
                </div>
                <span style={{ marginLeft: "5px", fontSize: "0.9rem", color: "#718096" }}>
                  (87)
                </span>
              </div>

              <p style={{
                fontSize: "1.4rem",
                fontWeight: "bold",
                color: "#c05621",
                marginBottom: "20px"
              }}>
                175.000 VND
              </p>

              <button style={{
                background: "#4a5568",
                color: "white",
                border: "none",
                borderRadius: "25px",
                padding: "10px 20px",
                fontSize: "0.9rem",
                fontWeight: "bold",
                cursor: "pointer",
                transition: "all 0.3s ease",
                width: "100%"
              }} onClick={() => handleClick("/products")}>
                Thêm vào giỏ hàng
              </button>
            </div>

            <div style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              padding: "30px",
              background: "white",
              borderRadius: "15px",
              boxShadow: "0 10px 25px rgba(0,0,0,0.05)",
              position: "relative",
              overflow: "hidden"
            }}>
              <div style={{
                position: "absolute",
                top: "15px",
                right: "15px",
                background: "#38a169",
                color: "white",
                padding: "5px 12px",
                fontSize: "0.8rem",
                fontWeight: "bold",
                borderRadius: "20px",
                zIndex: "1"
              }}>
                Mới
              </div>

              <img
                src={book3}
                alt="Book Cover"
                style={{
                  width: "180px",
                  height: "250px",
                  objectFit: "cover",
                  borderRadius: "5px",
                  boxShadow: "0 10px 20px rgba(0,0,0,0.1)",
                  marginBottom: "20px"
                }}
              />

              <h3 style={{
                fontSize: "1.4rem",
                fontWeight: "700",
                textAlign: "center",
                marginBottom: "10px",
                color: "#2d3748"
              }}>
                Đắc Nhân Tâm
              </h3>

              <p style={{
                fontSize: "1.2rem",
                color: "#718096",
                marginBottom: "10px",
                textAlign: "center"
              }}>
                Tác giả: Dale Carnegie
              </p>

              <div style={{
                display: "flex",
                alignItems: "center",
                marginBottom: "15px"
              }}>
                <div style={{ display: "flex" }}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <svg key={star} width="16" height="16" viewBox="0 0 24 24" fill="#f6ad55">
                      <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                    </svg>
                  ))}
                </div>
                <span style={{ marginLeft: "5px", fontSize: "0.9rem", color: "#718096" }}>
                  (215)
                </span>
              </div>

              <p style={{
                fontSize: "1.4rem",
                fontWeight: "bold",
                color: "#c05621",
                marginBottom: "20px"
              }}>
                200.000 VND
              </p>

              <button style={{
                background: "#4a5568",
                color: "white",
                border: "none",
                borderRadius: "25px",
                padding: "10px 20px",
                fontSize: "0.9rem",
                fontWeight: "bold",
                cursor: "pointer",
                transition: "all 0.3s ease",
                width: "100%"
              }} onClick={() => handleClick("/products")}>
                Thêm vào giỏ hàng
              </button>
            </div>

            <div style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              padding: "30px",
              background: "white",
              borderRadius: "15px",
              boxShadow: "0 10px 25px rgba(0,0,0,0.05)",
              position: "relative",
              overflow: "hidden"
            }}>
              <img
                src={book5}
                alt="Book Cover"
                style={{
                  width: "180px",
                  height: "250px",
                  objectFit: "cover",
                  borderRadius: "5px",
                  boxShadow: "0 10px 20px rgba(0,0,0,0.1)",
                  marginBottom: "20px"
                }}
              />

              <h3 style={{
                fontSize: "1.4rem",
                fontWeight: "700",
                textAlign: "center",
                marginBottom: "10px",
                color: "#2d3748"
              }}>
                Hạt Giống Tâm Hồn
              </h3>

              <p style={{
                fontSize: "1.2rem",
                color: "#718096",
                marginBottom: "10px",
                textAlign: "center"
              }}>
                Tác giả: Nhiều Tác Giả
              </p>

              <div style={{
                display: "flex",
                alignItems: "center",
                marginBottom: "15px"
              }}>
                <div style={{ display: "flex" }}>
                  {[1, 2, 3, 4].map((star) => (
                    <svg key={star} width="16" height="16" viewBox="0 0 24 24" fill="#f6ad55">
                      <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                    </svg>
                  ))}
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="#e2e8f0">
                    <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                  </svg>
                </div>
                <span style={{ marginLeft: "5px", fontSize: "0.9rem", color: "#718096" }}>
                  (67)
                </span>
              </div>

              <p style={{
                fontSize: "1.4rem",
                fontWeight: "bold",
                color: "#c05621",
                marginBottom: "20px"
              }}>
                150.000 VND
              </p>

              <button style={{
                background: "#4a5568",
                color: "white",
                border: "none",
                borderRadius: "25px",
                padding: "10px 20px",
                fontSize: "0.9rem",
                fontWeight: "bold",
                cursor: "pointer",
                transition: "all 0.3s ease",
                width: "100%"
              }} onClick={() => handleClick("/products")}>
                Thêm vào giỏ hàng
              </button>
            </div>
          </div>

          <div style={{ textAlign: "center", marginTop: "50px" }}>
            <button
              onClick={() => handleClick("/products")}
              style={{
                background: "#4a5568",
                color: "white",
                border: "none",
                borderRadius: "30px",
                padding: "12px 30px",
                fontSize: "1.2rem",
                fontWeight: "bold",
                cursor: "pointer",
                transition: "all 0.3s ease",
                display: "inline-flex",
                alignItems: "center",
                gap: "10px",
                boxShadow: "0 4px 6px rgba(0,0,0,0.1)"
              }}
            >
              Xem thêm sách
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Customer Reviews */}
      <div style={{
        padding: "80px 20px",
        background: "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)"
      }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "60px" }}>
            <h2 style={{
              fontSize: "2.8rem",
              color: "#2d3748",
              fontFamily: "'Playfair Display', serif",
              marginBottom: "15px"
            }}>
              Đánh Giá Từ Độc Giả
            </h2>
            <p style={{
              fontSize: "1.3rem",
              color: "#4a5568",
              maxWidth: "700px",
              margin: "0 auto"
            }}>
              Những cảm nhận từ độc giả đã trải nghiệm dịch vụ tại Jasmine Books
            </p>
          </div>

          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))",
            gap: "30px"
          }}>
            <div style={{
              background: "white",
              borderRadius: "15px",
              padding: "30px",
              boxShadow: "0 10px 25px rgba(0,0,0,0.05)",
              position: "relative"
            }}>
              <div style={{
                position: "absolute",
                top: "-25px",
                left: "30px",
                color: "#4a5568",
                fontSize: "3rem",
                fontFamily: "'Playfair Display', serif"
              }}>
                "
              </div>

              <p style={{
                fontSize: "1.3rem",
                lineHeight: "1.8",
                color: "#4a5568",
                marginBottom: "25px",
                position: "relative",
                zIndex: "1"
              }}>
                Jasmine Books là thiên đường dành cho những người yêu sách như tôi. Đội ngũ nhân viên rất thân thiện và có kiến thức sâu rộng về sách, giúp tôi tìm được những cuốn sách ưng ý.
              </p>

              <div style={{
                display: "flex",
                alignItems: "center"
              }}>
                <div style={{
                  width: "50px",
                  height: "50px",
                  borderRadius: "50%",
                  background: "#e2e8f0",
                  marginRight: "15px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "1.4rem",
                  fontWeight: "bold",
                  color: "#4a5568"
                }}>
                  NT
                </div>
                <div>
                  <h4 style={{
                    margin: "0 0 5px 0",
                    fontSize: "1.3rem",
                    fontWeight: "bold",
                    color: "#2d3748"
                  }}>
                    Nguyễn Thành
                  </h4>
                  <div style={{ display: "flex" }}>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <svg key={star} width="16" height="16" viewBox="0 0 24 24" fill="#f6ad55">
                        <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                      </svg>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div style={{
              background: "white",
              borderRadius: "15px",
              padding: "30px",
              boxShadow: "0 10px 25px rgba(0,0,0,0.05)",
              position: "relative"
            }}>
              <div style={{
                position: "absolute",
                top: "-25px",
                left: "30px",
                color: "#4a5568",
                fontSize: "3rem",
                fontFamily: "'Playfair Display', serif"
              }}>
                "
              </div>

              <p style={{
                fontSize: "1.3rem",
                lineHeight: "1.8",
                color: "#4a5568",
                marginBottom: "25px",
                position: "relative",
                zIndex: "1"
              }}>
                Tôi đặt sách online tại Jasmine và rất hài lòng với trải nghiệm. Sách được đóng gói cẩn thận, giao hàng đúng hẹn và chất lượng sách tuyệt vời.
              </p>

              <div style={{
                display: "flex",
                alignItems: "center"
              }}>
                <div style={{
                  width: "50px",
                  height: "50px",
                  borderRadius: "50%",
                  background: "#e2e8f0",
                  marginRight: "15px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "1.4rem",
                  fontWeight: "bold",
                  color: "#4a5568"
                }}>
                  TL
                </div>
                <div>
                  <h4 style={{
                    margin: "0 0 5px 0",
                    fontSize: "1.3rem",
                    fontWeight: "bold",
                    color: "#2d3748"
                  }}>
                    Trần Linh
                  </h4>
                  <div style={{ display: "flex" }}>
                    {[1, 2, 3, 4].map((star) => (
                      <svg key={star} width="16" height="16" viewBox="0 0 24 24" fill="#f6ad55">
                        <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                      </svg>
                    ))}
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="#e2e8f0">
                      <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            <div style={{
              background: "white",
              borderRadius: "15px",
              padding: "30px",
              boxShadow: "0 10px 25px rgba(0,0,0,0.05)",
              position: "relative"
            }}>
              <div style={{
                position: "absolute",
                top: "-25px",
                left: "30px",
                color: "#4a5568",
                fontSize: "3rem",
                fontFamily: "'Playfair Display', serif"
              }}>
                "
              </div>

              <p style={{
                fontSize: "1.3rem",
                lineHeight: "1.8",
                color: "#4a5568",
                marginBottom: "25px",
                position: "relative",
                zIndex: "1"
              }}>
                Không gian đọc sách tại Jasmine thực sự tuyệt vời và tạo cảm hứng. Tôi thường dành cả buổi chiều ở đây để đọc và thưởng thức không khí yên bình.
              </p>

              <div style={{
                display: "flex",
                alignItems: "center"
              }}>
                <div style={{
                  width: "50px",
                  height: "50px",
                  borderRadius: "50%",
                  background: "#e2e8f0",
                  marginRight: "15px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "1.4rem",
                  fontWeight: "bold",
                  color: "#4a5568"
                }}>
                  PH
                </div>
                <div>
                  <h4 style={{
                    margin: "0 0 5px 0",
                    fontSize: "1.3rem",
                    fontWeight: "bold",
                    color: "#2d3748"
                  }}>
                    Phạm Hương
                  </h4>
                  <div style={{ display: "flex" }}>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <svg key={star} width="16" height="16" viewBox="0 0 24 24" fill="#f6ad55">
                        <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                      </svg>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
