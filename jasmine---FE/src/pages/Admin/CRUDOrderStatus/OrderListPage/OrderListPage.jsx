import React, { useEffect, useState } from "react";
import { Dropdown, DropdownButton, Badge } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import ButtonComponent from "../../../../components/ButtonComponent/ButtonComponent";
import CheckboxComponent from "../../../../components/CheckboxComponent/CheckboxComponent";
import SideMenuComponent_AdminManage from "../../../../components/SideMenuComponent_AdminManage/SideMenuComponent_AdminManage";
import * as OrderService from "../../../../services/OrderService";
import * as StatusService from "../../../../services/StatusService";
import "./OrderListPage.css";

const OrderListPage = () => {
  const [orders, setOrders] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showLoading, setShowLoading] = useState(false);
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("order");

  const handleTabClick = (tab, navigatePath) => {
    setActiveTab(tab);
    navigate(navigatePath);
  };

  const handleUpdateStatusList = () => {
    const selectedOrders = orders.filter((order) =>
      selectedRows.includes(order._id)
    );

    if (selectedOrders.length === 0) {
      alert("Vui lòng chọn ít nhất một đơn hàng để cập nhật trạng thái.");
      return;
    }

    const currentStatuses = [
      ...new Set(selectedOrders.map((order) => order.status.statusName)),
    ];

    if (currentStatuses.length > 1) {
      alert("Chỉ được chọn các đơn hàng có cùng trạng thái.");
      return;
    }

    const currentStatus = selectedOrders[0].status; // Lấy trạng thái hiện tại
    navigate("/admin/order-status/update", {
      state: { selectedOrders, currentStatus },
    });
  };

  const handleDetail = () => {
    if (selectedRows.length === 1) {
      const selectedOrderId = selectedRows[0]; // Lấy ID của đơn hàng được chọn

      const selectedOrder = orders.find(
        (order) => order._id === selectedOrderId // Tìm đơn hàng trong danh sách
      );

      if (selectedOrder) {
        navigate("/admin/order-detail", { state: selectedOrder }); // Truyền dữ liệu qua state
      } else {
        alert("Không tìm thấy đơn hàng đã chọn.");
      }
    } else {
      alert("Vui lòng chọn 1 đơn hàng để xem chi tiết!");
    }
  };

  const isSelected = (id) => selectedRows.includes(id);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("access_token");
      const response = await OrderService.getAllOrders(token);

      // Sắp xếp đơn hàng theo mã đơn (orderCode) - mã lớn nhất (mới nhất) lên đầu
      if (response?.data && Array.isArray(response.data)) {
        const sortedData = [...response.data].sort((a, b) => {
          // Bỏ tiền tố "ORD-" và chuyển thành số
          const codeA = a.orderCode ? parseInt(a.orderCode.replace("ORD-", "")) : 0;
          const codeB = b.orderCode ? parseInt(b.orderCode.replace("ORD-", "")) : 0;

          // Sắp xếp giảm dần (mới nhất lên đầu)
          return codeB - codeA;
        });

        setOrders(sortedData);
        setFilteredOrders(sortedData);
      } else {
        setOrders(response?.data || []);
        setFilteredOrders(response?.data || []);
      }
    } catch (err) {
      setError(err.message || "Đã xảy ra lỗi khi tải danh sách đơn hàng.");
    } finally {
      setLoading(false);
    }
  };

  const fetchStatuses = async () => {
    setShowLoading(true);
    try {
      const token = localStorage.getItem("access_token");
      const response = await StatusService.getAllStatus(token);
      const statusOptions = [
        { label: "Tất cả", value: null },
        ...response.data.map((status) => ({
          label: status.statusName,
          value: status.statusCode,
        })),
      ];
      setStatuses(statusOptions);
    } catch (error) {
      console.error("Failed to fetch statuses", error.message);
    } finally {
      setShowLoading(false);
    }
  };

  useEffect(() => {
    fetchStatuses();
    fetchOrders();
  }, []);

  const toggleSelectRow = (id) => {
    setSelectedRows((prev) =>
      prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    setSelectedRows(
      selectedRows.length === filteredOrders.length
        ? []
        : filteredOrders.map((order) => order._id)
    );
  };

  const handleFilter = (statusCode) => {
    setSelectedStatus(statusCode);
    let filtered;

    // Lọc theo trạng thái
    if (!statusCode) {
      filtered = [...orders]; // Hiển thị tất cả đơn hàng
    } else {
      filtered = orders.filter((order) => order.status?.statusCode === statusCode);
    }

    // Sắp xếp đơn hàng theo mã đơn (mới nhất lên đầu)
    filtered.sort((a, b) => {
      const codeA = a.orderCode ? parseInt(a.orderCode.replace("ORD-", "")) : 0;
      const codeB = b.orderCode ? parseInt(b.orderCode.replace("ORD-", "")) : 0;
      return codeB - codeA; // Sắp xếp giảm dần
    });

    setFilteredOrders(filtered);
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

    // Default case - convert status name to status code format
    const statusKey = statusName.toUpperCase();
    return statusMap[statusKey] || "secondary";
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
    <div className="order-page-container">
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
            <div className="order-list__header">
              <div className="order-list__action">
                <h2 className="order-list__title">Danh sách đơn hàng</h2>
                <div className="btn__action">
                  <ButtonComponent
                    className="btn btn-detail"
                    onClick={handleDetail}
                  >
                    <i className="fas fa-info-circle me-1"></i> Chi tiết
                  </ButtonComponent>
                  <ButtonComponent
                    className="btn btn-update"
                    onClick={handleUpdateStatusList}
                  >
                    <i className="fas fa-sync-alt me-1"></i> Cập nhật
                  </ButtonComponent>
                </div>
              </div>

              <div className="order-list__meta">
                <div className="order-count">
                  <span className="count-label">Tổng số đơn hàng:</span>
                  <span className="count-value">{filteredOrders.length}</span>
                </div>

                <div className="filter-order">
                  <DropdownButton
                    className="filter-order__status"
                    title={
                      <span>
                        <i className="fas fa-filter me-2"></i>
                        {selectedStatus
                          ? statuses.find((s) => s.value === selectedStatus)?.label ||
                          "Chọn trạng thái"
                          : "Chọn trạng thái"}
                      </span>
                    }
                    onSelect={handleFilter}
                  >
                    {statuses.map((status, index) => (
                      <Dropdown.Item key={index} eventKey={status.value}>
                        {status.label}
                      </Dropdown.Item>
                    ))}
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
                <p>Không có đơn hàng nào</p>
              </div>
            )}

            {/* Table */}
            {!loading && filteredOrders.length > 0 && (
              <div className="table-container">
                <table className="order-table">
                  <thead>
                    <tr>
                      <th>
                        <CheckboxComponent
                          isChecked={
                            selectedRows.length === filteredOrders.length &&
                            filteredOrders.length > 0
                          }
                          onChange={toggleSelectAll}
                        />
                      </th>
                      <th>STT</th>
                      <th>Mã đơn</th>
                      <th>Khách hàng</th>
                      <th>Trạng thái</th>
                      <th>Ngày đặt</th>
                      <th>Ngày giao</th>
                      <th>Tổng tiền</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredOrders.map((order, index) => (
                      <tr
                        key={order._id}
                        className={isSelected(order._id) ? "highlight" : ""}
                        onClick={() => toggleSelectRow(order._id)}
                      >
                        <td onClick={(e) => e.stopPropagation()}>
                          <CheckboxComponent
                            isChecked={isSelected(order._id)}
                            onChange={() => toggleSelectRow(order._id)}
                          />
                        </td>
                        <td>{index + 1}</td>
                        <td className="order-code">
                          <span className="order-code-text">{order.orderCode}</span>
                        </td>
                        <td>{order.shippingAddress.familyName} {order.shippingAddress.userName}</td>
                        <td>
                          <Badge
                            bg={getStatusBadgeClass(order.status?.statusName)}
                            className="status-badge"
                            title={order.status?.statusName || "Không xác định"}
                          >
                            {order.status?.statusName || "Không xác định"}
                          </Badge>
                        </td>
                        <td>{formatDate(order.createdAt)}</td>
                        <td>{formatDate(order.deliveryDate)}</td>
                        <td className="price-column">{formatCurrency(order.totalPrice)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderListPage;
