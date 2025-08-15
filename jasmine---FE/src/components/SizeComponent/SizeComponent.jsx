import React from "react";
import "./SizeComponent.css";

const SizeComponent = ({ children, className = "", ...props }) => {
  return (
    <button className={`size-component ${className}`} {...props}>
      {children}
    </button>
  );
};

export default SizeComponent;
