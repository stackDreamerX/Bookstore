import React from "react";
import { useNavigate } from "react-router-dom";
import "./ViewProductDetailPage.css";
import SizeComponent from "../../../../components/SizeComponent/SizeComponent";
import ButtonComponent from "../../../../components/ButtonComponent/ButtonComponent";
import img1 from "../../../../assets/img/hero_2.jpg";

const ViewProductDetailPage = () => {
  const navigate = useNavigate();

  // Dữ liệu sản phẩm mẫu
  const product = {
    id: 1,
    productName: "Green Tea Flour Love",
    productPrice: "250,000 VND",
    productSize: ["20cm", "25cm"],
    productCategory: "Bánh ngọt",
    productImage: `${img1}`,
    productDescription: "Bánh ngọt với bột trà xanh đặc biệt",
  };

  const handleEdit = () => {
    navigate("/update-product", { state: product }); // Chuyển đến trang cập nhật sản phẩm và truyền dữ liệu
  };

  return (
    <div>
      <div className="container-xl mb-3">
        <h1 className="view-product-detail-title">Chi tiết sản phẩm</h1>
        {/* info top */}
        <div className="view__product-info d-flex gap-3">
          {/* top left */}
          <div className="info__left">
            <img
              className="product__image"
              src={product.productImage}
              alt="Product"
            />
          </div>
          {/* top right */}
          <div className="info__right">
            <div className="product__name">{product.productName}</div>
            <div className="product__info">
              <label>Giá:</label>
              <div className="product__price">{product.productPrice}</div>
              <label>Loại:</label>
              <div className="product__category">{product.productCategory}</div>
              <label>Kích thước:</label>
              <div className="size">
                {product.productSize.map((size, index) => (
                  <SizeComponent key={index}>{size}</SizeComponent>
                ))}
              </div>
            </div>
          </div>
        </div>
        {/* info bot */}
        <div className="info__bot">
          <label className="description">Mô Tả</label>
          <p className="product-description">{product.productDescription}</p>
        </div>

        <div className="btn__update">
          <ButtonComponent onClick={handleEdit}>Sửa</ButtonComponent>
        </div>
      </div>
    </div>
  );
};

export default ViewProductDetailPage;
