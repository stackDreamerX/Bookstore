import React from "react";
import { useState } from "react";
import "./QuantityBtn.css";
import { useDispatch } from "react-redux";
import { updateQuantity } from "../../redux/slides/cartSlide";

const QuantityBtn = ({ initialQuantity, productId }) => {
  const [quantity, setQuantity] = useState(initialQuantity || 1);
  const dispatch = useDispatch();
  console.log("quantity", quantity);
  console.log("productId", productId);

  const increaseQuantity = () => {
    const newQuantity = quantity + 1;
    setQuantity(newQuantity);
    dispatch(updateQuantity({ id: productId, quantity: newQuantity }));
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      const newQuantity = quantity - 1;
      setQuantity(newQuantity);
      dispatch(updateQuantity({ id: productId, quantity: newQuantity }));
    }
  };
  return (
    <div>
      <div className="cart-item__quantity">
        <button className="Minus" onClick={decreaseQuantity}>
          -
        </button>
        <span>{quantity}</span>
        <button className="Add" onClick={increaseQuantity}>
          +
        </button>
      </div>
    </div>
  );
};

export default QuantityBtn;
