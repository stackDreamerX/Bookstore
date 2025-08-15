import React, { useState } from "react";
import { useSelector } from "react-redux";
import styles from "./UserTab.module.css";
import SideMenuComponent from "../../../components/SideMenuComponent/SideMenuComponent";
import UserInfoPage from "../UserInfoPage/UserInfoPage";
import OrderHistoryPage from "../OrderHistoryPage/OrderHistoryPage";
import OrderTrackingPage from "../OrderHistoryPage/OrderTrackingPage";

const UserTab = () => {
  const user = useSelector((state) => state.user);
  const [activeTab, setActiveTab] = useState("profile"); // Mặc định là trang Thông tin cá nhân

  if (!user) {
    return <div>Loading...</div>;
  }

  const renderContent = () => {
    switch (activeTab) {
      case "profile":
        return <UserInfoPage />;
      case "order":
        return <OrderHistoryPage />;
      case "tracking":
        return <OrderTrackingPage />;
      default:
        return <div>Chọn một tab để xem nội dung</div>;
    }
  };

  return (
    <div className={`container-xl`}>
      <div className={styles.userTabContainer}>
        <div className={styles.userTabSide}>
          <div className={styles.userProfile}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="100"
              height="100"
              viewBox="0 0 140 140"
              fill="none"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M70.0001 11.6667C37.7826 11.6667 11.6667 37.7826 11.6667 70.0001C11.6667 102.218 37.7826 128.333 70.0001 128.333C102.218 128.333 128.333 102.218 128.333 70.0001C128.333 37.7826 102.218 11.6667 70.0001 11.6667ZM49.5834 55.4167C49.5834 52.7356 50.1115 50.0807 51.1375 47.6036C52.1636 45.1266 53.6675 42.8758 55.5633 40.98C57.4592 39.0841 59.7099 37.5802 62.187 36.5542C64.664 35.5282 67.3189 35.0001 70.0001 35.0001C72.6812 35.0001 75.3361 35.5282 77.8132 36.5542C80.2903 37.5802 82.541 39.0841 84.4368 40.98C86.3327 42.8758 87.8366 45.1266 88.8626 47.6036C89.8887 50.0807 90.4167 52.7356 90.4167 55.4167C90.4167 60.8316 88.2657 66.0246 84.4368 69.8535C80.608 73.6824 75.4149 75.8334 70.0001 75.8334C64.5852 75.8334 59.3922 73.6824 55.5633 69.8535C51.7344 66.0246 49.5834 60.8316 49.5834 55.4167ZM106.505 99.0734C102.137 104.565 96.5855 108.999 90.2647 112.045C83.9438 115.091 77.0167 116.671 70.0001 116.667C62.9834 116.671 56.0564 115.091 49.7355 112.045C43.4146 108.999 37.8631 104.565 33.4951 99.0734C42.9509 92.2892 55.8542 87.5001 70.0001 87.5001C84.1459 87.5001 97.0492 92.2892 106.505 99.0734Z"
                fill="#3A060E"
              />
            </svg>
            <h2 className={styles.userTopName}>
              {user.familyName + " " + user.userName}
            </h2>
          </div>
          <div className={styles.sideMenuInfo}>
            <SideMenuComponent
              onClick={() => setActiveTab("profile")}
              isActive={activeTab === "profile"}
            >
              Thông tin cá nhân
            </SideMenuComponent>
            <SideMenuComponent
              onClick={() => setActiveTab("order")}
              isActive={activeTab === "order"}
            >
              Đơn hàng
            </SideMenuComponent>
            <SideMenuComponent
              onClick={() => setActiveTab("tracking")}
              isActive={activeTab === "tracking"}
              icon={<i className="fas fa-truck"></i>}
            >
              Theo dõi đơn hàng
            </SideMenuComponent>
            <SideMenuComponent
              onClick={() => {
                localStorage.removeItem("access_token");
                localStorage.removeItem("refresh_token");
                localStorage.removeItem("cart");
                window.location.href = "/login";
              }}
            >
              Đăng xuất
            </SideMenuComponent>
          </div>
        </div>

        <div className={styles.userTabContent}>{renderContent()}</div>
      </div>
    </div>
  );
};

export default UserTab;
