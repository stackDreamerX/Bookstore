import React, { useEffect, useState } from "react";
import { Dropdown, DropdownButton, Badge } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import ButtonComponent from "../../../components/ButtonComponent/ButtonComponent";
import SideMenuComponent from "../../../components/SideMenuComponent/SideMenuComponent";
import * as OrderService from "../../../services/OrderService";
import * as StatusService from "../../../services/StatusService";
import "./OrderTrackingPage.css";
import { useSelector } from "react-redux";

const OrderTrackingPage = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [loadingStatuses, setLoadingStatuses] = useState(false);

  const navigate = useNavigate();
  const user = useSelector((state) => state.user);

  const handleDetail = (order) => {
    navigate("/order-detail-history/" + order._id, { state: { order } });
  };

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("access_token");
      const userId = user.id;

      if (!token || !userId) {
        throw new Error("Vui lòng đăng nhập để xem đơn hàng");
      }

      const response = await OrderService.getOrdersByUser(token, userId);
      console.log("Orders response:", response);
      setOrders(response?.data || []);
      setFilteredOrders(response?.data || []);
    } catch (err) {
      setError(err.message || "Đã xảy ra lỗi khi tải danh sách đơn hàng.");
    } finally {
      setLoading(false);
    }
  };

  const fetchStatuses = async () => {
    setLoadingStatuses(true);
    try {
      const token = localStorage.getItem("access_token");
      if (!token) {
        throw new Error("Vui lòng đăng nhập để xem trạng thái đơn hàng");
      }

      const response = await StatusService.getAllStatus(token);
      console.log("Status API response:", response);

      if (response && response.data && Array.isArray(response.data)) {
        // Extract unique statuses from orders if API doesn't return all statuses
        const orderStatuses = orders
          .filter(order => order.status && order.status.statusName && order.status.statusCode)
          .map(order => ({
            statusName: order.status.statusName,
            statusCode: order.status.statusCode
          }));

        // Remove duplicates
        const uniqueOrderStatuses = [];
        const seenStatusCodes = new Set();

        orderStatuses.forEach(status => {
          if (!seenStatusCodes.has(status.statusCode)) {
            seenStatusCodes.add(status.statusCode);
            uniqueOrderStatuses.push(status);
          }
        });

        console.log("Unique order statuses:", uniqueOrderStatuses);

        // Combine API statuses and order statuses
        let allStatuses = [...response.data];

        // Add any order statuses not in the API response
        uniqueOrderStatuses.forEach(orderStatus => {
          if (!allStatuses.some(s => s.statusCode === orderStatus.statusCode)) {
            allStatuses.push(orderStatus);
          }
        });

        const statusOptions = [
          { label: "Tất cả", value: null },
          ...allStatuses.map((status) => ({
            label: status.statusName,
            value: status.statusCode,
          })),
        ];

        console.log("Final status options:", statusOptions);
        setStatuses(statusOptions);
      } else {
        console.error("Không có dữ liệu trạng thái hợp lệ:", response);

        // Fallback: Extract statuses from orders
        const orderStatuses = orders
          .filter(order => order.status && order.status.statusName && order.status.statusCode)
          .map(order => ({
            statusName: order.status.statusName,
            statusCode: order.status.statusCode
          }));

        // Remove duplicates
        const uniqueOrderStatuses = [];
        const seenStatusCodes = new Set();

        orderStatuses.forEach(status => {
          if (!seenStatusCodes.has(status.statusCode)) {
            seenStatusCodes.add(status.statusCode);
            uniqueOrderStatuses.push(status);
          }
        });

        const statusOptions = [
          { label: "Tất cả", value: null },
          ...uniqueOrderStatuses.map((status) => ({
            label: status.statusName,
            value: status.statusCode,
          })),
        ];

        console.log("Fallback status options:", statusOptions);
        setStatuses(statusOptions);
      }
    } catch (error) {
      console.error("Không thể tải danh sách trạng thái:", error);

      // Fallback: Extract statuses from orders
      const orderStatuses = orders
        .filter(order => order.status && order.status.statusName && order.status.statusCode)
        .map(order => ({
          statusName: order.status.statusName,
          statusCode: order.status.statusCode
        }));

      // Remove duplicates
      const uniqueOrderStatuses = [];
      const seenStatusCodes = new Set();

      orderStatuses.forEach(status => {
        if (!seenStatusCodes.has(status.statusCode)) {
          seenStatusCodes.add(status.statusCode);
          uniqueOrderStatuses.push(status);
        }
      });

      const statusOptions = [
        { label: "Tất cả", value: null },
        ...uniqueOrderStatuses.map((status) => ({
          label: status.statusName,
          value: status.statusCode,
        })),
      ];

      console.log("Error fallback status options:", statusOptions);
      setStatuses(statusOptions);
    } finally {
      setLoadingStatuses(false);
    }
  };

  useEffect(() => {
    if (user && user.id) {
      fetchOrders();
    }
  }, [user]);

  useEffect(() => {
    if (orders.length > 0) {
      fetchStatuses();
    }
  }, [orders]);

  const handleFilter = (statusCode) => {
    console.log("Filtering by status:", statusCode);
    setSelectedStatus(statusCode);
    if (!statusCode) {
      setFilteredOrders(orders); // Hiển thị tất cả đơn hàng
    } else {
      setFilteredOrders(
        orders.filter((order) => order.status?.statusCode === statusCode)
      );
    }
  };

  // Helper function to get status badge color
  const getStatusBadgeClass = (statusName) => {
    if (!statusName) return "secondary";

    const statusMap = {
      "OrderedSuccessfully": "warning",
      "Waiting": "info",
      "TookOrder": "primary",
      "Shipping": "success",
      "Received": "success",
      "Cancle": "danger"
    };

    // Try to match the status name directly
    for (const [key, value] of Object.entries(statusMap)) {
      if (statusName.includes(key)) {
        return value;
      }
    }

    return "secondary"; // Default color
  };

  // Format date to dd/mm/yyyy
  const formatDate = (dateString) => {
    if (!dateString) return "Chưa xác định";
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN');
  };

  // Format currency with thousand separator
  const formatCurrency = (amount) => {
    if (!amount) return "0 VND";
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  return (
    <div className="order-tracking-container">
      <div className="container-xl">
        <div className="order-tracking__info">
          <div className="order-tracking__content">
            <div className="order-tracking__header">
              <h2 className="order-tracking__title">Theo dõi đơn hàng</h2>

              <div className="order-tracking__meta">
                <div className="order-count">
                  <span className="count-label">Tổng số đơn hàng:</span>
                  <span className="count-value">{filteredOrders.length}</span>
                </div>

                <div className="filter-order">
                  <DropdownButton
                    className="filter-order__status"
                    title={
                      <span className="dropdown-title-text">
                        <i className="fas fa-filter me-2"></i>
                        {selectedStatus
                          ? statuses.find((s) => s.value === selectedStatus)?.label ||
                          "Chọn trạng thái"
                          : "Chọn trạng thái"}
                      </span>
                    }
                    onSelect={handleFilter}
                    disabled={loadingStatuses}
                    align="end"
                  >
                    {loadingStatuses ? (
                      <Dropdown.Item disabled>Đang tải...</Dropdown.Item>
                    ) : statuses.length > 1 ? (
                      statuses.map((status, index) => (
                        <Dropdown.Item key={index} eventKey={status.value}>
                          {status.label}
                        </Dropdown.Item>
                      ))
                    ) : (
                      <Dropdown.Item disabled>Không có trạng thái</Dropdown.Item>
                    )}
                  </DropdownButton>
                </div>
              </div>
            </div>

            {/* Loading indicator */}
            {loading && (
              <div className="loading-container">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Đang tải...</span>
                </div>
              </div>
            )}

            {/* Error message */}
            {error && (
              <div className="alert alert-danger" role="alert">
                {error}
              </div>
            )}

            {/* Empty state */}
            {!loading && filteredOrders.length === 0 && (
              <div className="empty-state">
                <i className="fas fa-inbox fa-3x mb-3"></i>
                <p>Bạn chưa có đơn hàng nào</p>
                <ButtonComponent onClick={() => navigate("/products")}>
                  Mua sắm ngay
                </ButtonComponent>
              </div>
            )}

            {/* Table */}
            {!loading && filteredOrders.length > 0 && (
              <div className="table-responsive">
                <table className="table table-bordered">
                  <thead>
                    <tr>
                      <th style={{width: "5%"}}>STT</th>
                      <th style={{width: "25%"}}>Mã đơn</th>
                      <th style={{width: "15%"}}>Trạng thái</th>
                      <th style={{width: "15%"}}>Ngày đặt</th>
                      <th style={{width: "15%"}}>Ngày giao dự kiến</th>
                      <th style={{width: "15%"}}>Tổng tiền</th>
                      <th style={{width: "10%"}}>Thao tác</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredOrders.map((order, index) => (
                      <tr key={order._id}>
                        <td className="text-center">{index + 1}</td>
                        <td>{order.orderCode}</td>
                        <td className="text-center">
                          <Badge
                            bg={getStatusBadgeClass(order.status?.statusName || "")}
                            className="status-badge"
                          >
                            {order.status?.statusName || "Không xác định"}
                          </Badge>
                        </td>
                        <td className="text-center">{formatDate(order.createdAt)}</td>
                        <td className="text-center">{formatDate(order.deliveryDate)}</td>
                        <td className="text-end">{formatCurrency(order.totalPrice)}</td>
                        <td className="text-center">
                          <ButtonComponent
                            className="btn-detail"
                            onClick={() => handleDetail(order)}
                          >
                            Chi tiết
                          </ButtonComponent>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Status Timeline UI */}
            {!loading && filteredOrders.length > 0 && (
              <div className="status-timeline-container mt-4">
                <h3 className="timeline-title">Diễn giải trạng thái đơn hàng</h3>
                <div className="status-timeline">
                  <div className="timeline-step">
                    <div className="timeline-icon pending">
                      <i className="fas fa-clock"></i>
                    </div>
                    <div className="timeline-content">
                      <h4>Đang chờ xử lý</h4>
                      <p>Đơn hàng của bạn đã được tiếp nhận và đang chờ xác nhận.</p>
                    </div>
                  </div>
                  <div className="timeline-step">
                    <div className="timeline-icon processing">
                      <i className="fas fa-cog"></i>
                    </div>
                    <div className="timeline-content">
                      <h4>Đang xử lý</h4>
                      <p>Đơn hàng của bạn đã được xác nhận và đang được chuẩn bị.</p>
                    </div>
                  </div>
                  <div className="timeline-step">
                    <div className="timeline-icon shipped">
                      <i className="fas fa-truck"></i>
                    </div>
                    <div className="timeline-content">
                      <h4>Đang giao hàng</h4>
                      <p>Đơn hàng của bạn đang được vận chuyển đến địa chỉ nhận hàng.</p>
                    </div>
                  </div>
                  <div className="timeline-step">
                    <div className="timeline-icon delivered">
                      <i className="fas fa-check-circle"></i>
                    </div>
                    <div className="timeline-content">
                      <h4>Đã giao hàng</h4>
                      <p>Đơn hàng của bạn đã được giao thành công.</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderTrackingPage;