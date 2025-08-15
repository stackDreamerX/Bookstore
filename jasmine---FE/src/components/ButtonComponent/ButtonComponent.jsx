import React, { useRef } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./ButtonComponent.module.css";

const ButtonComponent = ({
  to,
  children,
  className = "",
  onChange,
  accept,
  ...props
}) => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null); // Tạo tham chiếu đến input file

  const handleClick = (event) => {
    if (to) {
      event.preventDefault(); // Ngăn form hoặc hành động khác nếu có
      navigate(to); // Điều hướng đến trang chỉ định
    }
    if (props.onClick) {
      props.onClick(event); // Gọi thêm hàm onClick nếu được truyền
    }
    if (fileInputRef.current) {
      fileInputRef.current.click(); // Kích hoạt click trên input file
    }
  };

  return (
    <div>
      <button
        className={`${styles.btn__component} ${className}`}
        onClick={handleClick}
        {...props}
      >
        {children}
      </button>
      <input
        type="file"
        ref={fileInputRef} // Gắn ref vào input file
        style={{ display: "none" }} // Ẩn input file
        accept={accept}
        onChange={onChange} // Sự kiện onChange khi chọn file
      />
    </div>
  );
};

export default ButtonComponent;
