import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./OrderDetailHistory.css";
import ButtonComponent from "../../../components/ButtonComponent/ButtonComponent";
import ProductInforCustom from "../../../components/ProductInfor/ProductInforCustom";
import { getOrderById } from "../../../services/OrderService";
import { updateOrderStatus } from "../../../services/OrderService";

const OrderDetailHistory = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [orderDetails, setOrderDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrderDetails();
  }, [orderId]);

  const fetchOrderDetails = async () => {
    try {
      const response = await getOrderById(orderId);
      if (response?.status === "OK") {
        setOrderDetails(response.data);
      }
    } catch (error) {
      console.error("Error fetching order details:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmDelivery = async () => {
    try {
      const response = await updateOrderStatus(orderId, 'DELIVERED');
      if (response.status === 'OK') {
        fetchOrderDetails();
        alert('Xác nhận nhận hàng thành công!');
      } else {
        alert('Không thể xác nhận nhận hàng. Vui lòng thử lại.');
      }
    } catch (error) {
      console.error('Error confirming delivery:', error);
      alert('Đã xảy ra lỗi. Vui lòng thử lại.');
    }
  };

  const getPaymentStatusText = (paymentMethod, paymentResult) => {
    if (!paymentResult) return 'Chưa thanh toán';

    if (paymentMethod === 'ZALOPAY') {
      return paymentResult.status === 'COMPLETED' ? 'Đã thanh toán qua ZaloPay' : 'Chưa thanh toán';
    }
    if (paymentMethod === 'VNPAY') {
      return paymentResult.status === 'COMPLETED' ? 'Đã thanh toán qua VNPay' : 'Chưa thanh toán';
    }
    if (paymentMethod === 'COD') {
      return 'Thanh toán khi nhận hàng';
    }
    return 'Chưa thanh toán';
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!orderDetails) {
    return <div>Không tìm thấy thông tin đơn hàng</div>;
  }

  return (
    <div className="container-xl">
      <div className="container-xl-order">
        {/* Order Status Section */}
        <div className="order-status-section">
          <h3>Trạng thái đơn hàng</h3>
          <div className="status-info">
            <p><strong>Mã đơn hàng:</strong> {orderDetails?.orderCode}</p>
            <p><strong>Trạng thái:</strong> {orderDetails?.status?.statusName}</p>
            <p><strong>Phương thức thanh toán:</strong> {orderDetails?.paymentMethod}</p>
            <p><strong>Trạng thái thanh toán:</strong> {getPaymentStatusText(orderDetails?.paymentMethod, orderDetails?.paymentResult)}</p>
            {orderDetails?.paymentResult && (
              <>
                <p><strong>Mã giao dịch:</strong> {orderDetails?.paymentResult?.id}</p>
                <p><strong>Thời gian thanh toán:</strong> {orderDetails?.paymentResult?.update_time}</p>
              </>
            )}
            {orderDetails?.status?.statusCode === 'DELIVERED' && !orderDetails?.isDelivered && (
              <div className="delivery-confirmation">
                <p className="delivery-notice">Đơn hàng đã được giao. Vui lòng xác nhận khi bạn đã nhận được hàng.</p>
                <ButtonComponent onClick={handleConfirmDelivery}>
                  Xác nhận đã nhận hàng
                </ButtonComponent>
              </div>
            )}
          </div>
        </div>

        {/* Order Items Section */}
        <div className="order-items-section">
          <h3>Chi tiết đơn hàng</h3>
          {orderDetails?.orderItems?.map((item, index) => (
            <ProductInforCustom
              key={index}
              image={item.product?.img}
              name={item.product?.title}
              price={item.price.toLocaleString() + " VND"}
              quantity={item.quantity}
            />
          ))}
        </div>

        {/* Order Summary Section */}
        <div className="order-summary-section">
          <h3>Tổng kết đơn hàng</h3>
          <div className="summary-info">
            <p><strong>Tạm tính:</strong> {orderDetails?.totalItemPrice?.toLocaleString()} VND</p>
            <p><strong>Phí vận chuyển:</strong> {orderDetails?.shippingPrice?.toLocaleString()} VND</p>
            <p><strong>Tổng cộng:</strong> {orderDetails?.totalPrice?.toLocaleString()} VND</p>
          </div>
        </div>

        {/* Shipping Information Section */}
        <div className="shipping-info-section">
          <h3>Thông tin giao hàng</h3>
          <div className="shipping-details">
            <p><strong>Người nhận:</strong> {orderDetails?.shippingAddress?.familyName} {orderDetails?.shippingAddress?.userName}</p>
            <p><strong>Số điện thoại:</strong> {orderDetails?.shippingAddress?.userPhone}</p>
            <p><strong>Email:</strong> {orderDetails?.shippingAddress?.userEmail}</p>
            <p><strong>Địa chỉ:</strong> {orderDetails?.shippingAddress?.userAddress}, {orderDetails?.shippingAddress?.userWard}, {orderDetails?.shippingAddress?.userDistrict}, {orderDetails?.shippingAddress?.userCity}</p>
            {orderDetails?.deliveryDate && (
              <p><strong>Ngày giao hàng:</strong> {orderDetails?.deliveryDate}</p>
            )}
            {orderDetails?.deliveryTime && (
              <p><strong>Thời gian giao hàng:</strong> {orderDetails?.deliveryTime}</p>
            )}
          </div>
        </div>

        {/* Order Note Section */}
        {orderDetails?.orderNote && (
          <div className="order-note-section">
            <h3>Ghi chú đơn hàng</h3>
            <p>{orderDetails.orderNote}</p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="action-buttons">
          <ButtonComponent onClick={() => navigate('/order-history')}>
            Quay lại
          </ButtonComponent>
          {orderDetails?.status?.statusCode === 'DELIVERED' && !orderDetails?.isDelivered && (
            <ButtonComponent onClick={handleConfirmDelivery}>
              Xác nhận đã nhận hàng
            </ButtonComponent>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderDetailHistory;