import React, { useEffect, useMemo, useState } from "react";
import ProductInfor from "../../../components/ProductInfor/ProductInfor";
import "./OrderInformation.css";
import { Link, useLocation, useNavigate } from "react-router-dom";
import ButtonComponent from "../../../components/ButtonComponent/ButtonComponent";
import BackIconComponent from "../../../components/BackIconComponent/BackIconComponent";
import FormComponent from "../../../components/FormComponent/FormComponent";
import { useDispatch, useSelector } from "react-redux";
import { useMutationHook } from "../../../hooks/useMutationHook";
import * as OrderService from "../../../services/OrderService";
import * as UserService from "../../../services/UserService";
import { addOrder, setOrderDetails } from "../../../redux/slides/orderSlide";

const OrderInformationPage = () => {
  const location = useLocation();
  const selectedProducts = Array.isArray(location.state?.selectedProductDetails)
    ? location.state.selectedProductDetails
    : [];
  console.log("selectedProducts1", selectedProducts);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const mutation = useMutationHook((data) => OrderService.createOrder(data));
  const shippingPrice = 30000; // Phí vận chuyển cố định

  const user = useSelector((state) => state.user); // Lấy thông tin user từ Redux
  const isLoggedIn = !!user?.userEmail;

  const handleClickBack = () => {
    navigate("/cart");
  };

  const handleClickNext = async () => {
    // Basic validation for required fields
    if (!shippingAddress.familyName || !shippingAddress.userName ||
        !shippingAddress.userAddress || !shippingAddress.userPhone ||
        !shippingAddress.userEmail) {
      alert("Vui lòng điền đầy đủ thông tin giao hàng!");
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(shippingAddress.userEmail)) {
      alert("Email không hợp lệ. Vui lòng nhập lại!");
      return;
    }

    // Phone validation (simple check for numeric and length)
    if (!/^\d{8,11}$/.test(shippingAddress.userPhone.replace(/\s/g, ''))) {
      alert("Số điện thoại không hợp lệ. Vui lòng nhập lại!");
      return;
    }

    // Tự động tính ngày giao hàng dự kiến là 1 tuần kể từ ngày đặt hàng
    const expectedDeliveryDate = new Date();
    expectedDeliveryDate.setDate(expectedDeliveryDate.getDate() + 7); // Thêm 7 ngày

    const orderData = {
      orderItems: selectedProducts.map((product) => ({
        product: product.id, // Gắn ID của sản phẩm vào trường `product`
        quantity: product.quantity, // Số lượng
        total:
          typeof product.price === "number"
            ? product.price * product.quantity
            : parseFloat(product.price.replace(/[^0-9.-]+/g, "")) *
              product.quantity,
      })),
      shippingAddress,
      paymentMethod: "Online Payment",
      userId: user?.id || null,
      deliveryDate: expectedDeliveryDate.toISOString().split('T')[0], // Format: YYYY-MM-DD
      deliveryTime: "08:00", // Giờ giao hàng mặc định
      orderNote,
      shippingPrice: 30000,
      totalItemPrice,
      totalPrice,
    };

    console.log("orderData", orderData);

    try {
      // Gửi đến API và lấy phản hồi
      const response = await mutation.mutateAsync(orderData);

      if (response?.data?._id) {
        // Thêm orderId vào orderData
        const fullOrderData = { ...orderData, orderId: response.data._id };

        // Lưu vào Redux store
        dispatch(addOrder(fullOrderData));

        // Điều hướng đến trang thanh toán
        navigate("/payment", {
          state: { ...fullOrderData },
        });
      } else {
        console.error("Failed to create order:", response);
        alert("Không thể tạo đơn hàng. Vui lòng thử lại sau!");
      }
    } catch (error) {
      console.error("Error creating order:", error);
      alert(`Lỗi khi tạo đơn hàng: ${error.message || "Đã xảy ra lỗi không xác định"}`);
    }
  };

  const [shippingAddress, setShippingAddress] = useState({
    familyName: "",
    userName: "",
    userAddress: "",
    userPhone: "",
    userEmail: "",
    userWard: "",
    userDistrict: "",
    userCity: "",
  });

  console.log("user", user);
  console.log("shippingAddress", shippingAddress);

  const [orderNote, setOrderNote] = useState("");

  // Tổng tiền hàng
  console.log("selectedPro", selectedProducts);

  const totalItemPrice = Array.isArray(selectedProducts)
    ? selectedProducts.reduce((acc, product) => {
        console.log("produtcccc", product);
        console.log("typeof product.price:", typeof product.price);
        const price =
          typeof product.price === "number"
            ? product.price
            : parseFloat(product.price.replace(/[^0-9.-]+/g, ""));
        return acc + price * product.quantity;
      }, 0)
    : 0;

  console.log("totalItemPrice", totalItemPrice);

  const totalPrice = useMemo(
    () => totalItemPrice + shippingPrice,
    [totalItemPrice]
  );

  console.log("totalPrice", totalPrice);

  // Lưu danh sách ID sản phẩm đã chọn vào Redux
  useEffect(() => {
    if (selectedProducts.length > 0) {
      // Lưu thông tin đơn hàng vào Redux store
      dispatch(setOrderDetails({
        selectedProducts: selectedProducts,
        selectedProductIds: selectedProducts.map(product => product.id),
        totalPrice: totalItemPrice + shippingPrice
      }));
    }
  }, [selectedProducts, totalItemPrice, shippingPrice, dispatch]);

  useEffect(() => {
    if (isLoggedIn) {
      setShippingAddress((prev) => ({
        ...prev,
        familyName: user.familyName || "",
        userName: user.userName || "",
        userAddress: user.userAddress || "",
        userPhone: user.userPhone || "",
        userEmail: user.userEmail || "",
        userWard: user.userWard || "",
        userDistrict: user.userDistrict || "",
        userCity: user.userCity || "",
      }));
    }
  }, [isLoggedIn, user]);

  const handleInputChange = (field) => (e) => {
    const value = e.target.value;
    if (typeof value === "string" && value.trim().length >= 0) {
      setShippingAddress((prev) => ({ ...prev, [field]: value }));
    }
  };

  // Hàm cập nhật ghi chú
  const handleOrderNoteChange = (e) => setOrderNote(e.target.value);

  return (
    <div className="container-xl cart-container">
      <div className="titleHolder">
        <div>
          <BackIconComponent className="back_btn" onClick={handleClickBack} />
        </div>
        <div>
          <h1 className="title"> Thông tin đơn hàng</h1>
        </div>
      </div>
      <div className="product_area">
        <table>
          <thead>
            <tr className="HeaderHolder">
              <th className="ProductInforHear">Thông tin sản phẩm</th>
              <th className="PriceHeader">Đơn giá</th>
              <th className="QuantityHeader">Số lượng</th>
              <th className="MoneyHeader">Thành tiền</th>
            </tr>
          </thead>
          <tbody>
            {selectedProducts.map((product) => (
              <tr key={product.id} className="LineProduct">
                <td className="ProductInfor">
                  <ProductInfor
                    image={product.img}
                    name={product.title}
                    size={product.size || "N/A"}
                  />
                </td>
                <td className="PriceProduct">{product.price}</td>
                <td className="QuantityBtn">x {product.quantity}</td>
                <td className="Money">
                  <p className="MoneyProduct">
                    {(
                      (typeof product.price === "number"
                        ? product.price
                        : parseFloat(product.price.replace(/[^0-9.-]+/g, ""))) *
                      product.quantity
                    ).toLocaleString()}{" "}
                    VND
                  </p>
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="LineProduct">
              <td colSpan="3">Phí vận chuyển:</td>
              <td>{shippingPrice.toLocaleString()} VND</td>
            </tr>
            <tr className="total-price">
              <td colSpan="3" className="text-end">
                Tổng tiền:
              </td>
              <td className="text-end">
                {totalPrice.toLocaleString()} VND
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
      <div className="question">
        <p className="login-question">
          Bạn đã có tài khoản?{" "}
          <Link to="./login" target="_blank" className="login-link">
            Đăng nhập
          </Link>
        </p>
      </div>

      <div>
        {/* =====Dia chi giao hang===== */}
        <div className="shipping-info">
          <div className="input-name">
            <div
              style={{
                display: "flex",
                padding: "10px 50px",
                justifyContent: "space-between",
              }}
            >
              <div>
                <h2>Họ</h2>
                <FormComponent
                  className="input-familyName"
                  name="family"
                  type="text"
                  placeholder="Nhập họ"
                  value={shippingAddress.familyName}
                  onChange={handleInputChange("familyName")}
                ></FormComponent>
              </div>
              <div>
                <h2>Tên</h2>
                <FormComponent
                  className="input-name"
                  type="text"
                  placeholder="Nhập tên"
                  value={shippingAddress.userName}
                  onChange={handleInputChange("userName")}
                ></FormComponent>
              </div>
            </div>
          </div>
          <div className="input-phone-email">
            <div
              style={{
                display: "flex",
                padding: "10px 50px",
                justifyContent: "space-between",
              }}
            >
              <div>
                <h2>Số điện thoại</h2>
                <FormComponent
                  className="input-phone"
                  type="text"
                  placeholder="Nhập số điện thoại"
                  value={shippingAddress.userPhone}
                  onChange={handleInputChange("userPhone")}
                ></FormComponent>
              </div>
              <div>
                <h2>Email</h2>
                <FormComponent
                  className="input-email"
                  type="text"
                  placeholder="Nhập email"
                  value={shippingAddress.userEmail}
                  onChange={handleInputChange("userEmail")}
                ></FormComponent>
              </div>
            </div>
          </div>
          <div className="address" style={{ padding: "10px 50px" }}>
            <h2>Địa chỉ</h2>
            <FormComponent
              type="text"
              placeholder="Nhập địa chỉ giao hàng: Số nhà, hẻm, đường,..."
              style={{ width: "100%" }}
              value={shippingAddress.userAddress}
              onChange={handleInputChange("userAddress")}
            ></FormComponent>
          </div>
        </div>

        {/* =====Thoi gian giao hang==== */}
        <div className="DeliveryTimeHolder">
          <p className="ThoiGian">Thời gian giao hàng dự kiến:</p>
          <div className="delivery-message" style={{ margin: "20px 0", padding: "10px", backgroundColor: "#f8f9fa", borderRadius: "5px" }}>
            <p style={{ fontSize: "16px", color: "#333", marginBottom: "0" }}>
              Đơn hàng của bạn sẽ được giao trong vòng <strong>1 tuần</strong> kể từ ngày đặt hàng.
            </p>
          </div>
        </div>
        {/* ============Ghi chu don hang======== */}
        <div className="Note">
          <div>
            <h2>Ghi chú đơn hàng:</h2>
            <div>
              <textarea
                rows="5"
                cols="50"
                placeholder="Nhập ghi chú đơn hàng....."
                className="inputNote"
                value={orderNote}
                onChange={handleOrderNoteChange}
              ></textarea>
            </div>
          </div>
        </div>

        {/* ================= Button======== */}
        <div className="Button-area">
          <button className="chinhsachBtn">
            <a href="/chinhsach" target="_blank" className="chinhsach">
              Chính sách đơn hàng
            </a>
          </button>
          <div className="Btn_holder">
            <div>
              <ButtonComponent onClick={handleClickBack}>
                Giỏ hàng
              </ButtonComponent>
            </div>
            <ButtonComponent className="Next_btn" onClick={handleClickNext}>
              Thanh toán
            </ButtonComponent>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderInformationPage;
