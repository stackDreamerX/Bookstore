import React from "react";
import "./SideMenuItem.css";

const SideMenuItem = ({ value, onClick, isActive, children, icon }) => {
  return (
    <div className={`side-menu-item ${isActive ? "active" : ""}`} onClick={() => onClick(value)}>
      <div className="menu-item-content">
        {icon && <span className="item-icon">{icon}</span>}
        <span className="item-text">{children}</span>
      </div>
    </div>
  );
};

export default SideMenuItem;