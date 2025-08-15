import React from "react";
import "./SideMenuComponent_AdminManage.css";
import { FaStoreAlt, FaShoppingCart, FaTag, FaCheck, FaList, FaUsers, FaChartBar, FaStar } from "react-icons/fa";

const SideMenuComponent_AdminManage = ({ activeTab, handleTabClick }) => {
    const tabs = [
        { id: "store-info", label: "Thông tin cửa hàng", path: "/admin/store-info", icon: <FaStoreAlt /> },
        { id: "order", label: "Đơn hàng", path: "/admin/order-list", icon: <FaShoppingCart /> },
        { id: "discount", label: "Khuyến mãi", path: "/admin/discount-list", icon: <FaTag /> },
        { id: "status", label: "Trạng thái", path: "/admin/status-list", icon: <FaCheck /> },
        { id: "category", label: "Loại sản phẩm", path: "/admin/category-list", icon: <FaList /> },
        { id: "user", label: "Danh sách người dùng", path: "/admin/user-list", icon: <FaUsers /> },
        { id: "report", label: "Thống kê", path: "/admin/report", icon: <FaChartBar /> },
    ];

    return (
        <div className="side-menu sticky-left">
            {tabs.map((tab) => (
                <div
                    key={tab.id}
                    className={`btn__side-menu ${activeTab === tab.id ? "active" : ""}`}
                    role="group"
                    aria-label="Vertical button group"
                >
                    <button
                        className={`btn__component ${activeTab === tab.id ? "active-btn" : ""}`}
                        onClick={() => handleTabClick(tab.id, tab.path)}
                    >
                        <span className="menu-icon">{tab.icon}</span>
                        <span className="menu-label">{tab.label}</span>
                    </button>
                </div>
            ))}
        </div>
    );
};

export default SideMenuComponent_AdminManage;
