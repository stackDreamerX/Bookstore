import React from "react";
import "./ProductRowComponent.css";

const ProductRowComponent = ({ product }) => {
  const name = product.product?.productName || "Không xác định";
  const image = product.product?.productImage || "default_image_url";
  const price = product.product?.productPrice || 0;
  const quantity = product.quantity || 0;
  const totalPrice = price * quantity; // Thành tiền

  return (
    <div className="product-row">
      <img src={image} alt={name} className="product-image" />
      <div className="product-name">{name}</div>
      <div className="product-price">{price.toLocaleString()} VND</div>
      <div className="product-quantity">x{quantity}</div>
      <div className="product-total">{totalPrice.toLocaleString()} VND</div>
    </div>
  );
};

export default ProductRowComponent;
