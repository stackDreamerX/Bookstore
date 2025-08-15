import React from "react";
import "./SideMenuComponent.css";

const SideMenuComponent = ({ value, onClick, isActive, children, icon }) => {
  return (
    <div className={`SideMenuComponent ${isActive ? "active" : ""}`} onClick={() => onClick(value)}>
      <div className="menu-content">
        {icon && <span className="menu-item-icon">{icon}</span>}
        <span className="menu-item-text">{children}</span>
      </div>
    </div>
  );
};

export default SideMenuComponent;
