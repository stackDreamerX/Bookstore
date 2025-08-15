import React from "react";
import styles from "./TagPriceComponent.module.css";

const TagPriceComponent = ({ children, className = "", ...props }) => {
  return (
    <button className={`${styles.btn__component} ${className}`} {...props}>
      {children}
    </button>
  );
};

export default TagPriceComponent;
