import { useLocation, useNavigate } from "react-router-dom";
import SideMenuComponent from "../../../components/SideMenuComponent/SideMenuComponent";
import ProductRowComponent from "../../../components/ProductRowComponent/ProductRowComponent";
import "./OrderDetailHistoryPage.css";
import * as UserService from "../../../services/UserService";
import { resetUser } from "../../../redux/slides/userSlide";
import { React, useState } from "react";
import { useDispatch } from "react-redux";
import { updateOrderStatus } from "../../../services/OrderService";

const OrderDetailHistoryPage = () => {
  const deliveryCost = 30000;
  const location = useLocation();
  const navigate = useNavigate();
  const order = location.state?.order;
  const [showLoading, setShowLoading] = useState(false);
  const dispatch = useDispatch();

  if (!order) {
    return <div>Không tìm thấy thông tin đơn hàng!</div>;
  }

  const firstOrderItem = order?.orderItems?.[0];
  if (!firstOrderItem) {
    return <div>Không có sản phẩm nào trong đơn hàng.</div>;
  }

  const totalAmount = order.orderItems?.reduce((acc, orderItem) => {
    return acc + parseInt(orderItem.total) || 0;
  }, 0) || 0;

  const handleClickProfile = () => {
    navigate('/user-info');
  };
  const handleClickOrder = () => {
    navigate('/order-history');
  };

  const handleNavigationLogin = () => {
    navigate("/login");
  };

  const handleLogout = async () => {
    setShowLoading(true);
    await UserService.logoutUser();
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("cart");
    dispatch(resetUser());
    setShowLoading(false);
    handleNavigationLogin();
  };

  const handleConfirmDelivery = async () => {
    try {
        alert('Xác nhận nhận hàng thành công!');
        window.location.reload();
    } catch (error) {
      console.error('Error confirming delivery:', error);
      alert('Đã xảy ra lỗi. Vui lòng thử lại.');
    }
  };

  // Helper
  const formatPrice = (price) => price ? price.toLocaleString() + " VND" : "0 VND";
  const formatDate = (date) => date ? new Date(date).toLocaleString('vi-VN') : '';

  return (
    <div className="order-detail-history-page-bg">
      <div className="container-xl order-detail-history-layout">
        <div className="user-info__container order-detail-flex">
          {/* Side menu */}
          <div className="side-menu__info order-detail-sidemenu">
            <SideMenuComponent onClick={handleClickProfile}>Thông tin cá nhân</SideMenuComponent>
            <SideMenuComponent onClick={handleClickOrder}>Đơn hàng</SideMenuComponent>
            <SideMenuComponent onClick={handleLogout}>Đăng xuất</SideMenuComponent>
          </div>
          {/* Main content */}
          <div className="order-detail-main-content">
            <div className="detail__content">
              <h2 className="detail__title">Chi tiết đơn hàng</h2>
              <div className="row">
                <label><strong>ID đơn hàng:</strong> {order.orderCode}</label>
              </div>
              <div className="row">
                <label><strong>Trạng thái:</strong> {order.status.statusName}</label>
              </div>

              {/* Thông tin thanh toán */}
              <div className="payment-info-block">
                <h3>Thông tin thanh toán</h3>
                <p><strong>Phương thức:</strong> {order.paymentMethod || 'N/A'}</p>
                <p><strong>Trạng thái:</strong> {order.isPaid ? 'Đã thanh toán' : 'Chưa thanh toán'}</p>
                {order.isPaid && order.paidAt && (
                  <p><strong>Thời gian thanh toán:</strong> {formatDate(order.paidAt)}</p>
                )}
              </div>

              {/* Danh sách sản phẩm */}
              <h3>Sản phẩm:</h3>
              <div className="product-list">
                {Array.isArray(order.orderItems) && order.orderItems.length > 0 ? (
                  order.orderItems.map((item, index) => (
                    <ProductRowComponent key={index} product={item} />
                  ))
                ) : (
                  <div>Không có sản phẩm nào trong đơn hàng này.</div>
                )}
              </div>

              {/* Tổng tiền đơn hàng */}
              <div className="total-cost">
                <div className="cost">
                  <label className="product-cost">
                    Tổng tiền sản phẩm: {totalAmount.toLocaleString()} VND
                  </label>
                  <label className="delivery-cost">
                    Phí vận chuyển: {deliveryCost.toLocaleString()} VND
                  </label>
                </div>
                <div className="total-bill">
                  Tổng hóa đơn: {(totalAmount + deliveryCost).toLocaleString()} VND
                </div>
              </div>

              {/* Thông tin giao hàng */}
              <div className="info-delivery">
                <div className="info-customer">
                  <label>Thông tin giao hàng</label>
                  <p>Tên: {order.shippingAddress.familyName} {order.shippingAddress.userName}</p>
                  <p>Số điện thoại: {order.shippingAddress.userPhone}</p>
                  <p>Địa chỉ: {order.shippingAddress?.userAddress}</p>
                </div>
                <div className="info-journey">
                  <label>Hành trình giao hàng</label>
                  <p>Ngày giao hàng dự kiến: {order.deliveryDate ? new Date(order.deliveryDate).toLocaleDateString() : 'N/A'} <span style={{color: '#666', fontStyle: 'italic'}}>(khoảng 1 tuần sau khi đặt hàng)</span></p>
                  <p>Thanh toán: {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'N/A'}</p>
                  <p>Xác nhận đơn hàng: {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'N/A'}</p>
                  <p>Đặt hàng: {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'N/A'}</p>
                </div>
              </div>

              {/* Nút xác nhận nhận hàng */}
              {order?.status?.statusCode === 'DELIVERED' && !order?.isDelivered && (
                <div className="delivery-confirmation-block">
                  <button onClick={handleConfirmDelivery} className="confirm-delivery-btn">
                    Xác nhận đã nhận hàng
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      {/* CSS bổ sung */}
      <style>{`
        .order-detail-history-page-bg {
          background: #f0f2f5;
          min-height: 100vh;
          padding: 20px 0;
        }
        .order-detail-history-layout {
          padding: 40px 0;
          max-width: 1200px;
          margin: 0 auto;
        }
        .order-detail-flex {
          display: flex;
          gap: 40px;
          align-items: flex-start;
        }
        .order-detail-sidemenu {
          min-width: 280px;
          background: #fff;
          border-radius: 12px;
          box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
          padding: 20px;
          position: sticky;
          top: 20px;
        }
        .order-detail-main-content {
          flex: 1;
          min-width: 0;
        }
        .detail__content {
          background: #fff;
          border-radius: 16px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
          padding: 40px;
          transition: all 0.3s ease;
        }
        .detail__title {
          font-size: 2rem;
          margin-bottom: 32px;
          color: #1a1a1a;
          font-weight: 600;
        }
        .payment-info-block {
          background: #f8f9fa;
          border-radius: 12px;
          padding: 24px;
          margin: 32px 0;
          border: 1px solid #e9ecef;
        }
        .payment-info-block h3 {
          margin-bottom: 16px;
          font-size: 1.3rem;
          color: #2c3e50;
          font-weight: 600;
        }
        .delivery-confirmation-block {
          margin-top: 40px;
          text-align: center;
        }
        .confirm-delivery-btn {
          background: #2ecc71;
          color: #fff;
          border: none;
          border-radius: 8px;
          padding: 14px 36px;
          font-size: 1.1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 4px 12px rgba(46, 204, 113, 0.2);
        }
        .confirm-delivery-btn:hover {
          background: #27ae60;
          transform: translateY(-2px);
          box-shadow: 0 6px 16px rgba(46, 204, 113, 0.3);
        }
        .info-delivery {
          background: #f8f9fa;
          border-radius: 12px;
          padding: 24px;
          margin-top: 32px;
          border: 1px solid #e9ecef;
        }
        .info-customer, .info-journey {
          margin-bottom: 24px;
        }
        .info-customer label, .info-journey label {
          font-size: 1.2rem;
          font-weight: 600;
          color: #2c3e50;
          margin-bottom: 16px;
          display: block;
        }
        .total-cost {
          background: #f8f9fa;
          border-radius: 12px;
          padding: 24px;
          margin: 32px 0;
          border: 1px solid #e9ecef;
        }
        .total-bill {
          font-size: 1.3rem;
          font-weight: 600;
          color: #2c3e50;
          margin-top: 16px;
          padding-top: 16px;
          border-top: 1px solid #e9ecef;
        }
        .product-list {
          margin: 24px 0;
        }
        @media (max-width: 1024px) {
          .order-detail-flex {
            flex-direction: column;
          }
          .order-detail-sidemenu {
            min-width: unset;
            margin-bottom: 24px;
            position: relative;
            top: 0;
          }
          .detail__content {
            padding: 24px;
          }
        }
        @media (max-width: 600px) {
          .detail__content {
            padding: 16px;
          }
          .detail__title {
            font-size: 1.5rem;
          }
          .confirm-delivery-btn {
            width: 100%;
            padding: 12px 24px;
          }
        }
      `}</style>
    </div>
  );
};

export default OrderDetailHistoryPage;
