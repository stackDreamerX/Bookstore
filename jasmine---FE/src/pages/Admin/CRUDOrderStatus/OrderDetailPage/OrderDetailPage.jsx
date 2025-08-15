import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ButtonComponent from "../../../../components/ButtonComponent/ButtonComponent";
import ProductRowComponent from "../../../../components/ProductRowComponent/ProductRowComponent";
import SideMenuComponent_AdminManage from "../../../../components/SideMenuComponent_AdminManage/SideMenuComponent_AdminManage";
import * as OrderService from "../../../../services/OrderService";
import * as StatusService from "../../../../services/StatusService";
import "./OrderDetailPage.css";

const OrderDetailPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [order, setOrder] = useState(location.state);
  // const order = location.state; // Nhận dữ liệu từ state khi điều hướng
  console.log("order", order);
  const accessToken = localStorage.getItem("access_token");


  const [activeTab, setActiveTab] = useState("order");

  const handleTabClick = (tab, navigatePath) => {
    setActiveTab(tab);
    navigate(navigatePath);
  };
  // console.log("accessToken", accessToken);

  // Sử dụng useState để quản lý order

  if (!order) {
    return <p>Không có dữ liệu để hiển thị.</p>;
  }

  // Xử lý dữ liệu đơn hàng
  const shippingAddress = order.shippingAddress || {};
  const user = order.userId || {};
  const status = order.status || {};
  const products = order.orderItems.map((item) => ({
    name: item.product?.name || "Không xác định",
    price: item.product?.price || 0,
    quantity: item.quantity,
    total: item.total,
  }));

  const totalAmount = products.reduce((acc, product) => acc + product.total, 0);

  const handleExit = () => {
    navigate("/admin/order-list");
  };



  // Hàm xử lý cập nhật trạng thái
  const handleUpdateStatus = async () => {
    try {
      if (!accessToken) {
        throw new Error("Access token is missing");
      }

      const response = await StatusService.getAllStatus(accessToken);

      const allStatuses = response.data;
      if (!Array.isArray(allStatuses)) {
        throw new Error("allStatuses is not an array");
      }

      const currentIndex = allStatuses.findIndex(
        (status) => status._id === order.status._id
      );

      if (currentIndex === -1 || currentIndex === allStatuses.length - 1) {
        alert("Đây là trạng thái cuối cùng, không thể cập nhật.");
        return;
      }

      const nextStatus = allStatuses[currentIndex + 1];
      console.log("Next status:", nextStatus);

      const updatedOrder = await OrderService.updateOrderStatus(
        order._id,
        nextStatus._id, // Gửi _id thay vì statusCode
        accessToken
      );

      alert("Cập nhật trạng thái thành công!");
      console.log("Updated order:", updatedOrder);
      // navigate(0); // Reload trang
      setOrder((prev) => ({
        ...prev,
        status: nextStatus,
      }));
    } catch (error) {
      console.error("Error updating status:", error);
      alert(error.message || "Đã xảy ra lỗi khi cập nhật trạng thái.");
    }
  };

  // Hàm xử lý hủy đơn
  const handleCancelOrder = async () => {
    try {
      if (!accessToken) {
        throw new Error("Access token is missing");
      }

      const response = await StatusService.getAllStatus(accessToken);
      const allStatuses = response.data;

      const cancelStatus = allStatuses.find((s) => s.statusCode === "Cancle");
      if (!cancelStatus) {
        alert("Không tìm thấy trạng thái hủy.");
        return;
      }

      // Gọi API để cập nhật trạng thái hủy
      const updatedOrder = await OrderService.updateOrderStatus(
        order._id,
        cancelStatus._id,
        accessToken
      );

      alert("Đơn hàng đã bị hủy.");
      console.log("Order canceled:", updatedOrder);

      // Cập nhật trạng thái hủy vào state
      setOrder((prev) => ({
        ...prev,
        status: cancelStatus,
      }));
    } catch (error) {
      console.error("Error canceling order:", error);
      alert(error.message || "Đã xảy ra lỗi khi hủy đơn.");
    }
  };

  // const getNextStatus = (currentStatusCode, allStatuses) => {
  //   const index = allStatuses.findIndex(
  //     (status) => status.statusCode === currentStatusCode
  //   );
  //   if (index === -1 || index === allStatuses.length - 1) return null; // Không có trạng thái tiếp theo
  //   return allStatuses[index + 1];
  // };

  return (
    <div>
      <div className="container-xl">
        <div className="order-list__info">
          {/* side menu */}
          <div className="side-menu__order">
            <SideMenuComponent_AdminManage
              activeTab={activeTab}
              handleTabClick={handleTabClick}
            />
          </div>
          {/* order list */}
          <div className="order-list__content">
            <div className="order-list__action">
              <label className="order-list__title">
                Chi tiết đơn hàng: {order.orderCode}
              </label>
              <div className="btn__action">
                <ButtonComponent className="btn btn-exit" onClick={handleExit}>
                  Thoát
                </ButtonComponent>
                <ButtonComponent
                  className="btn btn-cancel"
                  onClick={handleCancelOrder}
                >
                  Hủy đơn
                </ButtonComponent>
                {/* <ButtonComponent className="btn btn-accept">
                  Nhận đơn
                </ButtonComponent> */}
                <ButtonComponent
                  className="btn btn-update"
                  onClick={handleUpdateStatus}
                >
                  Cập nhật
                </ButtonComponent>
              </div>
            </div>

            {/* product */}
            <label className="label-status">
              Trạng thái: {status.statusName || "Không xác định"}
            </label>

            <div className="info-customer">
              <h3 className="mb-3">Thông tin giao hàng</h3>
              <div className="info-grid">
                <div className="info-row">
                  <span className="info-title">Mã khách hàng: </span>
                  <label className="info-value">
                    {user._id || "Không xác định"}
                  </label>
                </div>
                <div className="info-row">
                  <span className="info-title">Tên khách hàng: </span>
                  <label className="info-value">
                    {user.familyName + " " + user.userName || "Không xác định"}
                  </label>
                </div>
                <div className="info-row">
                  <span className="info-title">Số điện thoại: </span>
                  <label className="info-value">
                    {shippingAddress.userPhone || "Không xác định"}
                  </label>
                </div>
                <div className="info-row">
                  <span className="info-title">Địa chỉ: </span>
                  <label className="info-value">
                    {shippingAddress.userAddress || "Không xác định"}
                  </label>
                </div>
                <div className="info-row">
                  <span className="info-title">Mã đơn: </span>
                  <label className="info-value">{order.orderCode}</label>
                </div>
                <div className="info-row">
                  <span className="info-title">Ngày đặt: </span>
                  <label className="info-value">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </label>
                </div>
                <div className="info-row">
                  <span className="info-title">Ngày giao: </span>
                  <label className="info-value">
                    {order.deliveryDate
                      ? new Date(order.deliveryDate).toLocaleDateString()
                      : "Chưa xác định"}
                    <span style={{color: '#666', fontStyle: 'italic', fontSize: '14px', marginLeft: '5px'}}>
                      (khoảng 1 tuần sau khi đặt hàng)
                    </span>
                  </label>
                </div>
                <div className="info-row">
                  <span className="info-title">Ghi chú: </span>
                  <label className="info-value">
                    {order.orderNote || "Không có ghi chú"}
                  </label>
                </div>
              </div>
            </div>

            <h3>Danh sách sản phẩm:</h3>
            <div className="product-list">
              <div className="product-header">
                <div className="header-image"></div>
                <div className="header-name">Tên sản phẩm</div>
                <div className="header-price">Đơn giá</div>
                <div className="header-quantity">Số lượng</div>
                <div className="header-total">Thành tiền</div>
              </div>
              {order.orderItems.map((item, index) => (
                <ProductRowComponent key={index} product={item} />
              ))}
            </div>

            {/* total */}
            <div className="total-cost">
              <div className="cost">
                <p className="product-cost" style={{ color: "var(--brown100" }}>
                  Tổng tiền sản phẩm: <label>{totalAmount.toLocaleString()} VND</label>
                </p>
                <p
                  className="delivery-cost"
                  style={{ color: "var(--brown100" }}
                >
                  Phí vận chuyển: <label>{order.shippingPrice.toLocaleString()} VND</label>
                </p>
              </div>
              <div className="total-bill" style={{ color: "var(--brown100" }}>
                Tổng hóa đơn: {(totalAmount + order.shippingPrice).toLocaleString()} VND
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailPage;
