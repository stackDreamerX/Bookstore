import React from "react";
import { Link, useLocation } from "react-router-dom";
import styles from "./ButtonNoBGComponent.module.css";

const ButtonNoBGComponent = ({ to, children, className = "", ...props }) => {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link
      to={to}
      className={`${styles.btn__noBG__component} ${
        isActive ? styles.active : ""
      } ${className}`}
      {...props}
    >
      {children}
    </Link>
  );
};

export default ButtonNoBGComponent;
