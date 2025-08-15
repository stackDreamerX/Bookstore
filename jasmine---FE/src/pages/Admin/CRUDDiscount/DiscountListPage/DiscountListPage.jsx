import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ButtonComponent from "../../../../components/ButtonComponent/ButtonComponent";
import CheckboxComponent from "../../../../components/CheckboxComponent/CheckboxComponent";
import SideMenuComponent_AdminManage from "../../../../components/SideMenuComponent_AdminManage/SideMenuComponent_AdminManage";
import { deleteDiscount, getAllDiscount } from "../../../../services/DiscountService";
import "./DiscountListPageN.css";
import { FaTag, FaClock, FaCalendarTimes, FaTrashAlt, FaPlus, FaTicketAlt } from "react-icons/fa";

const DiscountListPage = () => {
  const accessToken = localStorage.getItem("access_token");
  const [selectedRows, setSelectedRows] = useState([]);
  const [promos, setPromos] = useState([]);
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // Set activeTab to "discount" for the side menu
  const [activeTab, setActiveTab] = useState("discount");

  // Fetch danh sách category
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("http://localhost:3001/api/category/get-all-category", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch categories");
        }

        const data = await response.json();
        if (Array.isArray(data.data)) {
          setCategories(data.data); // Lưu danh sách category
        } else {
          console.error("Categories data is not in expected format");
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, []);

  // Fetch danh sách khuyến mãi
  useEffect(() => {
    const fetchDiscounts = async () => {
      setIsLoading(true);
      try {
        const discounts = await getAllDiscount();
        if (Array.isArray(discounts.data)) {
          setPromos(discounts.data); // Lưu danh sách khuyến mãi
        } else {
          setError("Dữ liệu trả về không hợp lệ.");
        }
      } catch (err) {
        setError(err.message || "Không thể tải danh sách khuyến mãi.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchDiscounts();
  }, []);

  const getCategoryNameById = (id) => {
    const category = categories.find((cat) => cat._id === id);
    return category ? category.categoryName : "Không xác định";
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
  };

  const isPromoActive = (startDate, endDate) => {
    const now = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);
    if (now < start) return "upcoming";
    if (now > end) return "expired";
    return "active";
  };

  const toggleSelectAll = () => {
    setSelectedRows(
      selectedRows.length === promos.length
        ? [] // Nếu tất cả đã được chọn, bỏ chọn tất cả
        : promos.map((promo) => promo._id) // Chọn tất cả
    );
  };

  const isSelected = (id) => selectedRows.includes(id);
  const toggleSelectRow = (id) => {
    setSelectedRows((prev) => {
      if (prev.includes(id)) {
        // Nếu dòng đã được chọn, bỏ chọn
        return prev.filter((rowId) => rowId !== id);
      } else {
        // Nếu dòng chưa được chọn, thêm vào danh sách
        return [...prev, id];
      }
    });
  };

  const handleTabClick = (tab, navigatePath) => {
    setActiveTab(tab);
    navigate(navigatePath);
  };

  //Xóa
  const handleDelete = async () => {
    if (selectedRows.length === 0) {
      alert("Vui lòng chọn một khuyến mãi để xóa.");
    } else if (selectedRows.length > 1) {
      alert("Vui lòng chỉ chọn một khuyến mãi để xóa.");
    } else {
      try {
        // Gọi API xóa khuyến mãi
        await deleteDiscount(selectedRows[0], accessToken); // Gửi chỉ 1 ID khuyến mãi
        setPromos((prevPromos) => prevPromos.filter((promo) => promo.id !== selectedRows[0]));
        setSelectedRows([]); // Dọn dẹp danh sách đã chọn
        alert("Khuyến mãi đã được xóa.");
        navigate('/admin/discount-list')
      } catch (error) {
        alert("Có lỗi xảy ra khi xóa khuyến mãi.");
      }
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'active': return 'status-badge active';
      case 'upcoming': return 'status-badge upcoming';
      case 'expired': return 'status-badge expired';
      default: return 'status-badge';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'active': return 'Đang áp dụng';
      case 'upcoming': return 'Sắp diễn ra';
      case 'expired': return 'Đã hết hạn';
      default: return 'Không xác định';
    }
  };

  const truncateText = (text, maxLength) => {
    if (!text) return "";
    return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
  };

  return (
    <div className="discount-page-container">
      <div className="container-xl">
        <div className="discount-list__info">
          {/* Side menu */}
          <div className="side-menu__discount">
            <SideMenuComponent_AdminManage
              activeTab={activeTab}
              handleTabClick={handleTabClick}
            />
          </div>

          {/* Discount list */}
          <div className="discount-list__content">
            <div className="discount-list__action">
              <h2 className="discount-list__title">Danh sách khuyến mãi</h2>
              <div className="btn__action">
                <ButtonComponent className="btn btn-delete" onClick={handleDelete}>
                  <FaTrashAlt /> Xóa
                </ButtonComponent>

                <ButtonComponent
                  className="btn btn-add"
                  onClick={() => navigate("/admin/add-discount")}
                >
                  <FaPlus /> Thêm mới
                </ButtonComponent>
              </div>
            </div>

            {isLoading ? (
              <div className="loading-container">
                <div className="spinner"></div>
                <p>Đang tải dữ liệu...</p>
              </div>
            ) : (
              <>
                {/* Summary cards */}
                <div className="discount-summary">
                  <div className="summary-card">
                    <div className="summary-icon active">
                      <FaTag />
                    </div>
                    <div className="summary-info">
                      <h3>{promos.filter(p => isPromoActive(p.discountStartDate, p.discountEndDate) === 'active').length}</h3>
                      <p>Khuyến mãi đang áp dụng</p>
                    </div>
                  </div>
                  <div className="summary-card">
                    <div className="summary-icon upcoming">
                      <FaClock />
                    </div>
                    <div className="summary-info">
                      <h3>{promos.filter(p => isPromoActive(p.discountStartDate, p.discountEndDate) === 'upcoming').length}</h3>
                      <p>Khuyến mãi sắp diễn ra</p>
                    </div>
                  </div>
                  <div className="summary-card">
                    <div className="summary-icon expired">
                      <FaCalendarTimes />
                    </div>
                    <div className="summary-info">
                      <h3>{promos.filter(p => isPromoActive(p.discountStartDate, p.discountEndDate) === 'expired').length}</h3>
                      <p>Khuyến mãi đã hết hạn</p>
                    </div>
                  </div>
                </div>

                {/* Table */}
                <div className="table-container">
                  <div className="mobile-notice">
                    <p>Vui lòng cuộn ngang để xem đầy đủ thông tin</p>
                  </div>
                  <div className="table-scroll-container">
                    <table className="promo-table">
                      <thead>
                        <tr>
                          <th className="checkbox-column">
                            <CheckboxComponent
                              isChecked={selectedRows.length === promos.length && promos.length > 0}
                              onChange={toggleSelectAll}
                            />
                          </th>
                          <th>STT</th>
                          <th>Mã</th>
                          <th>Tên khuyến mãi</th>
                          <th>Giá trị</th>
                          <th>Loại sản phẩm</th>
                          <th>Bắt đầu</th>
                          <th>Kết thúc</th>
                          <th>Trạng thái</th>
                          <th></th>
                        </tr>
                      </thead>
                      <tbody>
                        {promos.length > 0 ? (
                          promos.map((promo, index) => {
                            const status = isPromoActive(promo.discountStartDate, promo.discountEndDate);
                            return (
                              <tr
                                key={promo.id || index}
                                className={isSelected(promo._id) ? "highlight" : ""}
                              >
                                <td className="checkbox-column">
                                  <CheckboxComponent
                                    isChecked={isSelected(promo._id)}
                                    onChange={() => toggleSelectRow(promo._id)}
                                  />
                                </td>
                                <td>{index + 1}</td>
                                <td><span className="discount-code">{promo.discountCode}</span></td>
                                <td title={promo.discountName}>
                                  {truncateText(promo.discountName, 25)}
                                </td>
                                <td className="discount-value">{formatCurrency(promo.discountValue)}</td>
                                <td>
                                  <span className="category-badge" title={getCategoryNameById(promo.applicableCategory)}>
                                    {truncateText(getCategoryNameById(promo.applicableCategory), 15)}
                                  </span>
                                </td>
                                <td>{formatDate(promo.discountStartDate)}</td>
                                <td>{formatDate(promo.discountEndDate)}</td>
                                <td>
                                  <span className={getStatusBadgeClass(status)}>
                                    {getStatusText(status)}
                                  </span>
                                </td>
                                <td className="actions-column">
                                  <button
                                    className="action-btn delete-btn"
                                    title="Xóa khuyến mãi"
                                    onClick={() => {
                                      setSelectedRows([promo._id]);
                                      handleDelete();
                                    }}
                                  >
                                    <FaTrashAlt />
                                  </button>
                                </td>
                              </tr>
                            );
                          })
                        ) : (
                          <tr>
                            <td colSpan="10" className="empty-table">
                              <div className="empty-state">
                                <FaTicketAlt size={48} />
                                <p>Không có khuyến mãi nào để hiển thị.</p>
                                <ButtonComponent
                                  className="btn btn-add-small"
                                  onClick={() => navigate("/admin/add-discount")}
                                >
                                  Thêm khuyến mãi mới
                                </ButtonComponent>
                              </div>
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                  {error && <p className="error-message">{error}</p>}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DiscountListPage;
