import { React, useEffect, useState } from "react";
import "./OrderHistoryPage.css";
import SideMenuComponent from "../../../components/SideMenuComponent/SideMenuComponent";
import OrderHistoryCardComponent from "../../../components/OrderHistoryCardComponent/OrderHistoryCardComponent";
import { getOrdersByUser } from "../../../services/OrderService";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import * as UserService from "../../../services/UserService";
import { resetUser, updateUser } from "../../../redux/slides/userSlide";

const OrderHistoryPage = () => {
  const [showLoading, setShowLoading] = useState(false); // Thêm trạng thái riêng
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const access_token = localStorage.getItem("access_token");
  console.log("token", access_token);
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (user && user.id) {
      fetchOrderByUser();
    } else {
      console.error("User ID is missing in Redux state");
    }
  }, [user]);

  const fetchOrderByUser = async () => {
    try {
      setLoading(true);
      console.log("Fetching orders...");
      const access_token = localStorage.getItem("access_token");
      const userId = user.id;

      if (!access_token || !userId) {
        throw new Error("Missing authentication details");
      }

      const response = await getOrdersByUser(access_token, userId);
      console.log("Orders fetched:", response.data);
      setOrders(response.data);
    } catch (err) {
      console.error("Error fetching orders:", err);
      setError(err.message || "An error occurred.");
    } finally {
      setLoading(false);
    }
  };

  // const handleClickProfile=(()=>{
  //   navigate('/user-info')
  // })
  // const handleClickOrder=(()=>{
  //   navigate('/order-history')
  // })

  // const orders = [
  //   {
  //     id: 1,
  //     status: "in-progress", // Trạng thái đơn hàng: "delivered" hoặc "in-progress"
  //     products: [
  //       {
  //         name: "Tiramisu trái cây lộn xộn",
  //         size: "23 cm",
  //         price: "100000",
  //         quantity: 2,
  //         image: img,
  //       },
  //       {
  //         name: "Bánh kem bơ matcha",
  //         size: "18 cm",
  //         price: "150000",
  //         quantity: 1,
  //         image: img,
  //       },
  //     ],
  //   },
  //   {
  //     id: 2,
  //     status: "delivered",
  //     products: [
  //       {
  //         name: "Bánh cuộn sô cô la",
  //         size: "20 cm",
  //         price: "120000",
  //         quantity: 1,
  //         image: img,
  //       },
  //     ],
  //   },
  // ];
  // const handleNavigationLogin = () => {
  //     navigate("/login");
  //   };
  //   const handleLogout = async () => {
  //     setShowLoading(true);
  //     await UserService.logoutUser();
  //     localStorage.removeItem("access_token");
  //     localStorage.removeItem("refresh_token");
  //     localStorage.removeItem("cart");
  //     // console.log(
  //     //   "Access token after removal:",
  //     //   localStorage.getItem("access-token")
  //     // ); // Kiểm tra xem token đã bị xóa chưa
  //     dispatch(resetUser());
  //     setShowLoading(false);
  //     handleNavigationLogin();
  //   };

  return (
    <div>
      <div className="container-xl">
        <div className="user-info__container">
          <div className="user-info__bot">

            <div className="order-history__info">
              <h2 className="order-history__title">Lịch sử mua hàng</h2>
              {Array.isArray(orders) && orders.length > 0 ? (
                [...orders]
                  .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                  .map((order, index) => {
                    console.log(`Order ${index + 1}:`, order); // In ra từng đơn hàng trong console
                    return (
                      <OrderHistoryCardComponent key={order._id} order={order} />
                    );
                  })
              ) : (
                <div className="no-orders">Không có đơn hàng nào.</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderHistoryPage;
