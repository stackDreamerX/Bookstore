import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "./ButtonFormComponent.module.css";

const ButtonFormComponent = ({ to, children, className = "", disabled = false, ...props }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (to && !disabled) {
      navigate(to); // Chuyển đến đường dẫn được truyền qua props "to"
    }
  };

  return (
    <button
      onClick={handleClick}
      className={`${styles.btn__form} ${disabled ? styles.disabled : ""} ${className}`}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};

export default ButtonFormComponent;
