import React, { useState } from "react";
import "./CartPage.css";
import ButtonComponent from "../../../components/ButtonComponent/ButtonComponent";
import { useNavigate } from "react-router-dom";
import ProductInfor from "../../../components/ProductInfor/ProductInfor";
import QuantityBtn from "../../../components/QuantityBtn/QuantityBtn";
import DeleteBtn from "../../../components/DeleteBtn/DeleteBtn";
import CheckboxComponent from "../../../components/CheckboxComponent/CheckboxComponent";
import BackIconComponent from "../../../components/BackIconComponent/BackIconComponent";
import { useDispatch, useSelector } from "react-redux";
import {
  removeFromCart,
  updateQuantity,
} from "../../../redux/slides/cartSlide";

const CartPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleNavigate = (path) => {
    navigate(path);
  };

  const products = useSelector((state) => state.cart.products);

  const calculatePrice = (price) => {
    if (typeof price !== 'string') {
      price = String(price);
    }
    return parseFloat(price.replace(/[^0-9.-]+/g, ""));
  };

  const [selectedProducts, setSelectedProducts] = useState([]);

  // Tính tổng tiền dựa trên các sản phẩm đã chọn
  const totalAmount = products.reduce((acc, product) => {
    if (selectedProducts.includes(product.id)) {
      return acc + calculatePrice(product.price) * product.quantity;
    }
    return acc;
  }, 0);

  // Check if a product is selected
  const isSelected = (productId) => selectedProducts.includes(productId);

  // Toggle select/deselect product
  const toggleSelectRow = (productId) => {
    setSelectedProducts((prev) => {
      const updated = prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId];
      return updated;
    });
  };

  // Handle "Buy Now" button click
  const handleBuyNow = () => {
    const selectedProductDetails = products.filter((product) =>
      selectedProducts.includes(product.id)
    );

    navigate("/order-information", { state: { selectedProductDetails } });
  };

  // Toggle select/deselect all products
  const toggleSelectAll = () => {
    setSelectedProducts(
      selectedProducts.length === products.length
        ? []
        : products.map((product) => product.id)
    );
  };

  // Remove product from cart
  const handleRemoveProduct = (id) => {
    dispatch(removeFromCart({ id }));
    // Also remove from selected products if selected
    setSelectedProducts(prev => prev.filter(productId => productId !== id));
  };

  // Empty cart message
  if (products.length === 0) {
    return (
      <div className="container-xl cart-container">
        <div className="titleHolderCart">
          <button className="back_btn" onClick={() => handleNavigate("/products")}>
            <BackIconComponent />
          </button>
          <h1 className="titleCart">Giỏ hàng</h1>
        </div>

        <div className="empty-cart">
          <h2>Giỏ hàng của bạn đang trống</h2>
          <p>Vui lòng thêm sản phẩm vào giỏ hàng</p>
          <ButtonComponent onClick={() => handleNavigate("/products")}>
            Mua sắm ngay
          </ButtonComponent>
          <button
            className="track-orders-btn ml-2"
            onClick={() => handleNavigate("/order-tracking")}
          >
            Theo dõi đơn hàng
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container-xl cart-container">
      <div className="titleHolderCart">
        <button
          className="back_btn"
          onClick={() => handleNavigate("/products")}
        >
          <BackIconComponent />
        </button>
        <h1 className="titleCart">Giỏ hàng</h1>
      </div>

      <div className="product_area">
        <table>
          <thead>
            <tr className="HeaderHolder">
              <th width="5%">
                <CheckboxComponent
                  isChecked={selectedProducts.length === products.length && products.length > 0}
                  onChange={toggleSelectAll}
                />
              </th>
              <th className="ProductInforHear" width="45%">Thông tin sản phẩm</th>
              <th className="PriceHeader" width="15%">Đơn giá</th>
              <th className="QuantityHeader" width="15%">Số lượng</th>
              <th className="MoneyHeader" width="15%">Thành tiền</th>
              <th width="5%"></th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id} className="LineProduct">
                <td>
                  <CheckboxComponent
                    isChecked={isSelected(product.id)}
                    onChange={() => toggleSelectRow(product.id)}
                  />
                </td>
                <td className="ProductInfor">
                  <ProductInfor
                    image={product.img}
                    name={product.title}
                    size={product.size}
                  />
                </td>
                <td className="PriceProduct">
                  <p className="Price">
                    {product.originalPrice && product.originalPrice !== product.price ? (
                      <>
                        <span className="original-price">{product.originalPrice} VND</span>
                        <br />
                        <span className="discounted-price">{product.price} VND</span>
                      </>
                    ) : (
                      `${product.price} VND`
                    )}
                  </p>
                </td>
                <td className="QuantityBtn">
                  <QuantityBtn
                    initialQuantity={product.quantity}
                    productId={product.id}
                  />
                </td>
                <td className="Money">
                  <p className="MoneyProduct">
                    {(
                      calculatePrice(product.price) * product.quantity
                    ).toLocaleString()}{" "}
                    VND
                  </p>
                </td>
                <td className="DeleteBtn">
                  <DeleteBtn onClick={() => handleRemoveProduct(product.id)} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="Btnarea">
          <div className="total-holder">
            <p className="tong">Tổng tiền:</p>
            <p className="total">{totalAmount.toLocaleString()} VND</p>
          </div>
          <div className="Btnholder">
            <button
              className="Buy_more"
              onClick={() => handleNavigate("/products")}
            >
              Mua thêm
            </button>
            <button
              className="Track_orders"
              onClick={() => handleNavigate("/order-tracking")}
            >
              Theo dõi đơn hàng
            </button>
            <ButtonComponent
              className="Buy_btn"
              onClick={handleBuyNow}
              disabled={selectedProducts.length === 0}
            >
              Mua ngay
            </ButtonComponent>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
