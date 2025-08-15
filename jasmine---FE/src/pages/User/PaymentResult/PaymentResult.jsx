import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import ButtonComponent from "../../../components/ButtonComponent/ButtonComponent";
import { getPaymentResult, verifyZaloPayPayment } from '../../../services/PaymentService';
import './PaymentResult.css';
import { useDispatch, useSelector } from 'react-redux';
import { removeSelectedFromCart } from '../../../redux/slides/cartSlide';

const PaymentResult = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [codPayment, setCodPayment] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState(null);
  const orderDetails = useSelector((state) => state.order);
  const selectedProductIds = orderDetails.selectedProductIds || [];

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        // Check if this is a COD payment result (from state)
        if (location.state && location.state.paymentMethod === "COD") {
          setCodPayment({
            orderId: location.state.orderId,
            amount: location.state.amount,
            paymentMethod: "COD"
          });
          setPaymentMethod("COD");
          // Xóa sản phẩm đã chọn khỏi giỏ hàng khi COD
          if (selectedProductIds.length > 0) {
            dispatch(removeSelectedFromCart({ ids: selectedProductIds }));
          }
          setLoading(false);
          return;
        }

        const queryParams = new URLSearchParams(location.search);
        console.log("Payment result query params:", Object.fromEntries(queryParams));

        // Check for ZaloPay return - check for appid instead of app_trans_id
        if (queryParams.get('appid')) {
          setPaymentMethod("ZALOPAY");
          const response = await verifyZaloPayPayment(queryParams);
          console.log("ZaloPay verification response:", response);
          setResult(response);
          // Nếu ZaloPay thanh toán thành công, xóa sản phẩm đã chọn khỏi giỏ hàng
          if (response?.data?.status === "1" && selectedProductIds.length > 0) {
            dispatch(removeSelectedFromCart({ ids: selectedProductIds }));
          }
        }
        // Check for VNPay return
        else if (queryParams.get('vnp_ResponseCode')) {
          setPaymentMethod("VNPAY");
          const response = await getPaymentResult(queryParams);
          console.log("VNPay verification response:", response);
          setResult(response);
          // Nếu VNPay thanh toán thành công, xóa sản phẩm đã chọn khỏi giỏ hàng
          if (response?.code === "00" && selectedProductIds.length > 0) {
            dispatch(removeSelectedFromCart({ ids: selectedProductIds }));
          }
        }
        // If no payment parameters found
        else {
          console.error("No payment parameters found in URL:", location.search);
          setError("Không có thông tin thanh toán để xác thực.");
        }
      } catch (err) {
        console.error('Lỗi xác thực:', err);
        setError(err.message || 'Không thể xác thực thanh toán');
      } finally {
        setLoading(false);
      }
    };

    verifyPayment();
  }, [location.search, location.state, dispatch, selectedProductIds]);

  const getStatusText = (code, method, result) => {
    if (method === "ZALOPAY") {
      switch (result?.data?.status) {
        case "1": return "Giao dịch thành công";
        case "2": return "Giao dịch thất bại";
        case "3": return "Đang xử lý";
        case "-49": return "Giao dịch thất bại do khách hàng hủy giao dịch";
        default: return "Không xác định";
      }
    }
    // VNPay status codes
    switch (code) {
      case '00':
        return 'Giao dịch thành công';
      case '07':
        return 'Trừ tiền thành công, giao dịch bị nghi ngờ';
      case '09':
        return 'Giao dịch không thành công do Thẻ/Tài khoản không đủ số dư';
      case '10':
        return 'Giao dịch không thành công do: Khách hàng xác thực thông tin thẻ/tài khoản không đúng quá 3 lần';
      case '11':
        return 'Giao dịch không thành công do: Đã hết hạn chờ thanh toán';
      case '12':
        return 'Giao dịch không thành công do: Thẻ/Tài khoản bị khóa';
      case '24':
        return 'Giao dịch không thành công do: Khách hàng hủy giao dịch';
      case '51':
        return 'Giao dịch không thành công do: Tài khoản không đủ số dư';
      case '65':
        return 'Giao dịch không thành công do: Tài khoản đã vượt quá hạn mức giao dịch trong ngày';
      case '75':
        return 'Ngân hàng thanh toán đang bảo trì';
      case '79':
        return 'Giao dịch không thành công do: KH nhập sai mật khẩu thanh toán quá số lần quy định';
      case '99':
        return 'Các lỗi khác';
      default:
        return 'Giao dịch thất bại';
    }
  };

  const handleGoHome = () => {
    navigate('/');
  };

  const handleGoToOrders = () => {
    navigate('/order-history');
  };

  if (loading) {
    return (
      <div className="payment-result-container">
        <div className="payment-result-loading">
          <div className="spinner"></div>
          <p>Đang xác thực kết quả thanh toán...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="payment-result-container">
        <div className="payment-result-error">
          <h2>Lỗi xác thực</h2>
          <p>{error}</p>
          <div className="payment-result-buttons">
            <ButtonComponent onClick={handleGoHome}>Về trang chủ</ButtonComponent>
            <ButtonComponent onClick={() => navigate('/payment')}>Thử lại</ButtonComponent>
          </div>
        </div>
      </div>
    );
  }

  // Handle COD payment result
  if (codPayment) {
    return (
      <div className="payment-result-container">
        <div className="payment-result-card success">
          <div className="payment-result-header">
            <h2>Đặt hàng thành công</h2>
          </div>
          <div className="payment-result-body">
            <p><strong>Mã đơn hàng:</strong> {codPayment.orderId}</p>
            <p><strong>Số tiền:</strong> {codPayment.amount.toLocaleString()} VND</p>
            <p><strong>Phương thức thanh toán:</strong> Thanh toán khi nhận hàng (COD)</p>
            <p><strong>Trạng thái:</strong> Đang xử lý</p>
            <p><strong>Thời gian giao hàng dự kiến:</strong> <span style={{color: '#007bff'}}>Khoảng 1 tuần kể từ ngày đặt hàng</span></p>
            <p className="cod-instruction">
              Quý khách sẽ thanh toán khi nhận hàng. Vui lòng chuẩn bị đúng số tiền khi nhận hàng.
            </p>
          </div>
          <div className="payment-result-buttons">
            <ButtonComponent onClick={handleGoHome}>Về trang chủ</ButtonComponent>
            <ButtonComponent onClick={handleGoToOrders}>Xem đơn hàng</ButtonComponent>
          </div>
        </div>
      </div>
    );
  }

  // Handle VNPay and ZaloPay payment results
  const isSuccess = paymentMethod === "ZALOPAY"
    ? result?.data?.status === "1"  // ZaloPay: 1 = SUCCESS, 2 = FAIL, 3 = PROCESSING, -49 = CANCELED
    : result?.code === "00";        // VNPay: 00 = SUCCESS

  return (
    <div className="payment-result-container">
      <div className={`payment-result-card ${isSuccess ? 'success' : 'error'}`}>
        <div className="payment-result-header">
          <h2>{isSuccess ? 'Thanh toán thành công' : 'Thanh toán thất bại'}</h2>
        </div>
        <div className="payment-result-body">
          {result && (
            <>
              <p><strong>Mã phản hồi:</strong> {result.code}</p>
              <p><strong>Trạng thái:</strong> {getStatusText(result.code, paymentMethod, result)}</p>
              <p><strong>Phương thức thanh toán:</strong> {paymentMethod}</p>
              {isSuccess && <p><strong>Thời gian giao hàng dự kiến:</strong> <span style={{color: '#007bff'}}>Khoảng 1 tuần kể từ ngày đặt hàng</span></p>}
              {paymentMethod === "VNPAY" && result.data && (
                <>
                  <p><strong>Mã giao dịch:</strong> {result.data.vnp_TxnRef}</p>
                  <p><strong>Số tiền:</strong> {parseInt(result.data.vnp_Amount) / 100} VND</p>
                  <p><strong>Nội dung thanh toán:</strong> {result.data.vnp_OrderInfo}</p>
                  <p><strong>Mã ngân hàng:</strong> {result.data.vnp_BankCode || 'N/A'}</p>
                  <p><strong>Thời gian:</strong> {result.data.vnp_PayDate}</p>
                </>
              )}
              {paymentMethod === "ZALOPAY" && result.data && (
                <>
                  <p><strong>Mã giao dịch:</strong> {result.data.app_trans_id}</p>
                  <p><strong>Số tiền:</strong> {result.data.amount} VND</p>
                  <p><strong>Thời gian:</strong> {result.data.payDate}</p>
                  <p><strong>Trạng thái ZaloPay:</strong> {
                    result.data.status === "1" ? "Thành công" :
                    result.data.status === "2" ? "Thất bại" :
                    result.data.status === "3" ? "Đang xử lý" :
                    result.data.status === "-49" ? "Đã hủy giao dịch" : "Không xác định"
                  }</p>
                </>
              )}
            </>
          )}
        </div>
        <div className="payment-result-buttons">
          <ButtonComponent onClick={handleGoHome}>Về trang chủ</ButtonComponent>
          {isSuccess && (
            <ButtonComponent onClick={handleGoToOrders}>Xem đơn hàng</ButtonComponent>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentResult;
