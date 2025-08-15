import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./PaymentPage.css";
import ButtonComponent from "../../../components/ButtonComponent/ButtonComponent";
import ProductInforCustom from "../../../components/ProductInfor/ProductInforCustom";
import { useDispatch, useSelector } from "react-redux";
import * as PaymentService from "../../../services/PaymentService";
import { removeSelectedFromCart } from "../../../redux/slides/cartSlide";

const PaymentPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const orderDetails = useSelector((state) => state.order);
  console.log("orderDetails", orderDetails);
  const cart = useSelector((state) => state.cart); // Lấy danh sách sản phẩm từ Redux
  const selectedProductIds = orderDetails.selectedProductIds || [];

  const lastOrder = orderDetails.orders?.[orderDetails.orders.length - 1] || {};
  const {
    orderItems = [],
    totalPrice,
    shippingAddress,
    paymentMethod,
  } = lastOrder;
  console.log("lastOrder", lastOrder);

  // Tìm thông tin chi tiết của sản phẩm từ `cart.products` dựa trên `orderItems`
  const resolvedOrderItems = orderItems.map((item) => {
    const product = cart.products.find((p) => p.id === item.product);
    return {
      ...item,
      img: product?.img || "default_image_url",
      name: product?.title || "Unknown Product",
      price:
        typeof product?.price === "number"
          ? product.price
          : parseFloat((product?.price || "0").replace(/[^0-9.-]+/g, "")) || 0,
    };
  });

  const [vnpayOptions, setVnpayOptions] = useState({
    bankCode: "",
    language: "vn"
  });

  // Thêm state cho phương thức thanh toán
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("vnpay");

  const handleVnpayOptionChange = (field) => (e) => {
    setVnpayOptions((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handlePaymentMethodChange = (method) => {
    setSelectedPaymentMethod(method);
  };

  //Su kien click
  const handleClickBack = () => {
    navigate("/order-information", { state: { ...location.state } });
  };
  console.log("orderId", lastOrder?.orderId);

  // Xử lý thanh toán COD
  const handleCodPayment = async () => {
    try {
      // Tạo dữ liệu thanh toán COD
      const codPaymentData = {
        orderId: lastOrder?.orderId,
        amount: lastOrder.totalItemPrice + lastOrder.shippingPrice,
        paymentMethod: "COD"
      };

      console.log("Gửi dữ liệu thanh toán COD:", codPaymentData);

      // Gọi API để cập nhật trạng thái đơn hàng thành "đang xử lý" với phương thức COD
      const response = await PaymentService.processCodPayment(codPaymentData);

      if (response?.status === "OK") {
        // Xóa các sản phẩm đã chọn khỏi giỏ hàng khi thanh toán COD thành công
        if (selectedProductIds.length > 0) {
          dispatch(removeSelectedFromCart({ ids: selectedProductIds }));
        }

        // Chuyển hướng đến trang đặt hàng thành công
        navigate("/payment/result", {
          state: {
            orderId: lastOrder?.orderId,
            paymentMethod: "COD",
            amount: lastOrder.totalItemPrice + lastOrder.shippingPrice
          }
        });
      } else {
        alert("Không thể xử lý đơn hàng COD. Vui lòng thử lại.");
      }
    } catch (error) {
      console.error("Error in handleCodPayment:", error);
      alert("Đã xảy ra lỗi khi xử lý COD. Vui lòng thử lại.");
    }
  };

  // Xử lý thanh toán ZaloPay
  const handleZaloPayPayment = async () => {
    try {
      const paymentData = {
        orderId: lastOrder?.orderId,
        amount: lastOrder.totalItemPrice + lastOrder.shippingPrice,
        description: `Thanh_toan_don_hang_${lastOrder?.orderId}`
      };

      console.log("Gửi dữ liệu thanh toán ZaloPay:", paymentData);
      const response = await PaymentService.createZaloPayPayment(paymentData);
      console.log("Kết quả tạo thanh toán ZaloPay:", response);

      if (response?.status === "OK") {
        // Không xóa giỏ hàng ở đây, việc xóa sẽ được thực hiện ở trang PaymentResult
        // sau khi xác nhận thanh toán thành công
        window.location.href = response.data.orderUrl;
      } else {
        alert("Không thể tạo thanh toán ZaloPay. Vui lòng thử lại.");
      }
    } catch (error) {
      console.error("Error in handleZaloPayPayment:", error);
      alert("Đã xảy ra lỗi. Vui lòng thử lại.");
    }
  };

  // Xử lý kết quả thanh toán
  const handlePaymentResult = async (params) => {
    try {
      console.log("Xử lý kết quả thanh toán:", params);
      const { app_trans_id, status, message } = params;

      if (status === "1") {
        // Thanh toán thành công
        navigate("/payment/result", {
          state: {
            orderId: lastOrder?.orderId,
            paymentMethod: "ZALOPAY",
            amount: lastOrder.totalItemPrice + lastOrder.shippingPrice,
            status: "success",
            message: "Thanh toán thành công"
          }
        });
      } else {
        // Thanh toán thất bại
        navigate("/payment/result", {
          state: {
            orderId: lastOrder?.orderId,
            paymentMethod: "ZALOPAY",
            amount: lastOrder.totalItemPrice + lastOrder.shippingPrice,
            status: "failed",
            message: message || "Thanh toán thất bại"
          }
        });
      }
    } catch (error) {
      console.error("Error in handlePaymentResult:", error);
      alert("Đã xảy ra lỗi khi xử lý kết quả thanh toán. Vui lòng thử lại.");
    }
  };

  const handleClickPay = async () => {
    if (selectedPaymentMethod === "cod") {
      await handleCodPayment();
      return;
    }

    if (selectedPaymentMethod === "vnpay") {
      try {
        const paymentData = {
          orderId: lastOrder?.orderId,
          amount: Math.round(lastOrder.totalItemPrice + lastOrder.shippingPrice),
          bankCode: vnpayOptions.bankCode || '',
          language: vnpayOptions.language || 'vn',
          orderInfo: `Thanh_toan_don_hang_${lastOrder?.orderId}`
        };

        console.log("Sending VNPay payment data:", paymentData);
        const response = await PaymentService.createPayment(paymentData);
        if (response?.status === "OK") {
          // Không xóa giỏ hàng ở đây, việc xóa sẽ được thực hiện ở trang PaymentResult
          // sau khi xác nhận thanh toán thành công
          window.location.href = response.data;
        } else {
          alert("Không thể tạo thanh toán VNPay. Vui lòng thử lại.");
        }
      } catch (error) {
        console.error("Error in handleClickPay:", error);
        alert("Đã xảy ra lỗi. Vui lòng thử lại.");
      }
    }

    if (selectedPaymentMethod === "zalopay") {
      await handleZaloPayPayment();
    }
  };

  return (
    <div className="container-xl">
      <div className="container-xl-pay">
        {/* =========================THONG TIN THANH TOAN=========================        */}
        <div className="PaymentInfor">
          <p className="pThongtin">Thông tin thanh toán</p>

          {/* Payment Method Selection */}
          <div className="payment-method-selection">
            <div className="payment-method-option">
              <input
                type="radio"
                id="vnpay"
                name="paymentMethod"
                value="vnpay"
                checked={selectedPaymentMethod === "vnpay"}
                onChange={() => handlePaymentMethodChange("vnpay")}
              />
              <label htmlFor="vnpay">Thanh toán qua VNPay</label>
            </div>

            <div className="payment-method-option">
              <input
                type="radio"
                id="zalopay"
                name="paymentMethod"
                value="zalopay"
                checked={selectedPaymentMethod === "zalopay"}
                onChange={() => handlePaymentMethodChange("zalopay")}
              />
              <label htmlFor="zalopay">Thanh toán qua ZaloPay</label>
            </div>

            <div className="payment-method-option">
              <input
                type="radio"
                id="cod"
                name="paymentMethod"
                value="cod"
                checked={selectedPaymentMethod === "cod"}
                onChange={() => handlePaymentMethodChange("cod")}
              />
              <label htmlFor="cod">Thanh toán khi nhận hàng (COD)</label>
            </div>
          </div>

          {/* VNPay Options - Only show if VNPay is selected */}
          {selectedPaymentMethod === "vnpay" && (
            <div className="VnpayHolder">
              <h3 className="VnpayTitle">Thanh toán qua VNPay</h3>
              <p className="VnpayDescription">
                Quý khách sẽ được chuyển đến cổng thanh toán VNPay để hoàn tất quá trình thanh toán
              </p>
              <select
                className="BankCode"
                name="BankCode"
                value={vnpayOptions.bankCode}
                onChange={handleVnpayOptionChange("bankCode")}
                style={{
                  width: "100%",
                  margin: "15px 0",
                }}
              >
                <option value="">Hiển thị cổng thanh toán VNPay</option>
                <option value="NCB">NCB</option>
                <option value="VIETCOMBANK">VIETCOMBANK</option>
                <option value="VIETINBANK">VIETINBANK</option>
                <option value="BIDV">BIDV</option>
                <option value="AGRIBANK">AGRIBANK</option>
                <option value="SACOMBANK">SACOMBANK</option>
                <option value="TECHCOMBANK">TECHCOMBANK</option>
                <option value="MBBANK">MBBANK</option>
                <option value="TPBANK">TPBANK</option>
              </select>
              <select
                className="Language"
                name="Language"
                value={vnpayOptions.language}
                onChange={handleVnpayOptionChange("language")}
                style={{
                  width: "100%",
                  margin: "10px 0 20px",
                }}
              >
                <option value="vn">Tiếng Việt</option>
                <option value="en">Tiếng Anh</option>
              </select>
            </div>
          )}

          {/* COD Information - Only show if COD is selected */}
          {selectedPaymentMethod === "cod" && (
            <div className="CodHolder">
              <h3 className="CodTitle">Thanh toán khi nhận hàng (COD)</h3>
              <p className="CodDescription">
                Quý khách sẽ thanh toán khi nhận hàng. Vui lòng chuẩn bị đúng số tiền khi nhận hàng.
              </p>
              <div className="CodInfo">
                <p><strong>Người nhận:</strong> {shippingAddress?.familyName} {shippingAddress?.userName}</p>
                <p><strong>Số điện thoại:</strong> {shippingAddress?.userPhone}</p>
                <p><strong>Địa chỉ:</strong> {shippingAddress?.userAddress}, {shippingAddress?.userWard}, {shippingAddress?.userDistrict}, {shippingAddress?.userCity}</p>
                <p><strong>Email:</strong> {shippingAddress?.userEmail}</p>
                <p><strong>Thời gian giao hàng dự kiến:</strong> <span style={{color: '#007bff'}}>Khoảng 1 tuần kể từ ngày đặt hàng</span></p>
              </div>
            </div>
          )}

          {/* Delivery Information - Show for all payment methods */}
          {selectedPaymentMethod !== "cod" && (
            <div className="delivery-info" style={{marginTop: '20px', padding: '15px', backgroundColor: '#f8f9fa', borderRadius: '5px'}}>
              <h3 style={{marginBottom: '10px', color: '#333'}}>Thông tin giao hàng</h3>
              <p><strong>Người nhận:</strong> {shippingAddress?.familyName} {shippingAddress?.userName}</p>
              <p><strong>Địa chỉ:</strong> {shippingAddress?.userAddress}, {shippingAddress?.userWard}, {shippingAddress?.userDistrict}, {shippingAddress?.userCity}</p>
              <p><strong>Thời gian giao hàng dự kiến:</strong> <span style={{color: '#007bff'}}>Khoảng 1 tuần kể từ ngày đặt hàng</span></p>
            </div>
          )}

          {/* ==================Button=========== */}
          <div className="Button-area-pay">
            <div className="button1">
              <ButtonComponent onClick={handleClickBack}>
                Quay lại
              </ButtonComponent>
            </div>
            <div className="button2">
              <ButtonComponent
                className="customBtn2"
                onClick={() => {
                  if (selectedPaymentMethod === "vnpay") {
                    handleClickPay();
                  } else if (selectedPaymentMethod === "zalopay") {
                    handleZaloPayPayment();
                  } else if (selectedPaymentMethod === "cod") {
                    handleCodPayment();
                  }
                }}
              >
                {selectedPaymentMethod === "vnpay"
                  ? "Thanh toán qua VNPay"
                  : selectedPaymentMethod === "zalopay"
                  ? "Thanh toán qua ZaloPay"
                  : "Xác nhận đặt hàng COD"}
              </ButtonComponent>
            </div>
          </div>
        </div>

        {/* ======================= THONG TIN DON HANG (CO PHI VAN CHUYEN)===============       */}
        <div className="final-order">
          {resolvedOrderItems.length > 0 ? (
            resolvedOrderItems.map((product, index) => (
              <ProductInforCustom
                key={index}
                // id={product._id}
                image={product.img}
                name={product.name}
                price={(product.price || 0).toLocaleString() + " VND"}
                quantity={product.quantity}
              />
            ))
          ) : (
            <p>Không có sản phẩm nào trong đơn hàng</p>
          )}
          {/* ===============TIEN CAN THANH TOAN============   */}
          <div className="footerAreaPayment">
            <div className="tamtinh" style={{ marginBottom: "10px" }}>
              <label style={{ paddingLeft: "10px" }}>Tạm tính:</label>
              <p className="tamtinh2">
                {lastOrder.totalItemPrice.toLocaleString()} VND
              </p>
            </div>
            <div className="tamtinhVanChuyen">
              <label style={{ paddingLeft: "10px" }}>
                Tổng tiền (gồm phí vận chuyển):
              </label>
              <p className="tamtinhVanChuyen2">
                {(
                  lastOrder.totalItemPrice + lastOrder.shippingPrice
                ).toLocaleString()}{" "}
                VND
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;
