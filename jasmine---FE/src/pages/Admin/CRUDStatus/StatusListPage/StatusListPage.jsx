import React, { useEffect, useState } from "react";
import "./StatusListPageN.css";
import SideMenuComponent_AdminManage from "../../../../components/SideMenuComponent_AdminManage/SideMenuComponent_AdminManage";
import ButtonComponent from "../../../../components/ButtonComponent/ButtonComponent";
import CheckboxComponent from "../../../../components/CheckboxComponent/CheckboxComponent";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  setAllStatus,
  setDetailStatus,
} from "../../../../redux/slides/statusSlide";
import { deleteStatus, getAllStatus } from "../../../../services/StatusService";
import { FaTag, FaPlus, FaTrashAlt, FaCheckCircle, FaTimesCircle, FaExclamationCircle } from "react-icons/fa";

import { isAdmin } from "../../../../utils";
import Message from "../../../../components/MessageComponent/Message";
import { useMutationHook } from "../../../../hooks/useMutationHook";
import * as StatusService from "../../../../services/StatusService";

const StatusListPage = () => {
  const status = useSelector((state) => state.status.allStatus || []);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const accessToken = localStorage.getItem("access_token");

  const [selectedRows, setSelectedRows] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusMessage, setStatusMessage] = useState(null);
  const [activeTab, setActiveTab] = useState("status");

  useEffect(() => {
    if (!accessToken || !isAdmin(accessToken)) {
      navigate("/login"); // Điều hướng về trang đăng nhập nếu không phải admin
    }
  }, [accessToken, navigate]);

  const isSelected = (statusCode) => selectedRows.includes(statusCode);

  const toggleSelectRow = (statusCode) => {
    setSelectedRows((prev) =>
      prev.includes(statusCode)
        ? prev.filter((code) => code !== statusCode)
        : [...prev, statusCode]
    );
  };

  const toggleSelectAll = () => {
    setSelectedRows(
      selectedRows.length === status.length
        ? []
        : status.map((item) => item.statusCode)
    );
  };

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const response = await getAllStatus(accessToken); // Gọi API để lấy danh sách status
      dispatch(setAllStatus(response.data)); // Lưu danh sách status vào Redux
    } catch (error) {
      console.error("Failed to fetch statuses", error.message);
      setStatusMessage({
        type: "Error",
        message: "Lỗi khi tải danh sách trạng thái",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [dispatch]);

  const handleAddStatus = () => {
    navigate("/admin/add-status", { state: { from: "/admin/status-list" } });
  };

  const mutation = useMutationHook(StatusService.getAllStatus);
  useEffect(() => {
    if (mutation.isSuccess) {
      setStatusMessage({
        type: "Success",
        message: "Lấy danh sách trạng thái thành công!",
      });
    } else if (mutation.isError) {
      const errorMessage =
        mutation.error?.message.message || "Lỗi khi lấy danh sách trạng thái.";
      setStatusMessage({
        type: "Error",
        message: errorMessage,
      });
    }
  }, [mutation.isSuccess, mutation.isError, mutation.error]);

  const handleDeleteStatus = async () => {
    if (selectedRows.length === 0) {
      setStatusMessage({
        type: "Error",
        message: "Vui lòng chọn ít nhất một trạng thái để xóa",
      });
      return;
    }

    if (window.confirm("Bạn có chắc chắn muốn xóa các trạng thái đã chọn?")) {
      try {
        await Promise.all(
          selectedRows.map(async (code) => {
            const statusToDelete = status.find(
              (item) => item.statusCode === code
            );
            if (!statusToDelete) {
              throw new Error(
                `Không tìm thấy trạng thái với statusCode: ${code}`
              );
            }

            // Gọi API xóa với `_id`
            await deleteStatus(statusToDelete._id, accessToken);
          })
        );

        const response = await getAllStatus(accessToken);
        dispatch(setAllStatus(response.data));

        setStatusMessage({
          type: "Success",
          message: "Xóa trạng thái thành công!",
        });

        setSelectedRows([]);
      } catch (error) {
        console.error("Failed to delete statuses", error);

        setStatusMessage({
          type: "Error",
          message:
            typeof error.message === "string"
              ? error.message
              : JSON.stringify(error.message) || "Xóa trạng thái thất bại.",
        });
      }
    }
  };

  const handleTabClick = (tab, navigatePath) => {
    setActiveTab(tab);
    navigate(navigatePath);
  };

  // Function to get status type icon
  const getStatusIcon = (statusCode) => {
    if (statusCode?.toLowerCase().includes('đã giao') || statusCode?.toLowerCase().includes('hoàn thành')) {
      return <FaCheckCircle className="status-icon completed" />;
    } else if (statusCode?.toLowerCase().includes('hủy') || statusCode?.toLowerCase().includes('hết hạn')) {
      return <FaTimesCircle className="status-icon cancelled" />;
    } else {
      return <FaExclamationCircle className="status-icon in-progress" />;
    }
  };

  // Function to truncate text
  const truncateText = (text, maxLength) => {
    if (!text) return "";
    return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
  };

  return (
    <div className="status-page-container">
      <div className="container-xl">
        {statusMessage && (
          <Message
            type={statusMessage.type}
            message={statusMessage.message}
            duration={3000}
            onClose={() => setStatusMessage(null)}
          />
        )}
        <div className="status-list__info">
          {/* side menu */}
          <div className="side-menu__discount">
            <SideMenuComponent_AdminManage
              activeTab={activeTab}
              handleTabClick={handleTabClick}
            />
          </div>
          {/* status list */}
          <div className="status-list__content">
            <div className="status-list__action">
              <h2 className="status-list__title">
                Danh sách trạng thái đơn hàng
              </h2>
              <div className="btn__action">
                <ButtonComponent
                  className="btn btn-delete"
                  onClick={handleDeleteStatus}
                >
                  <FaTrashAlt /> Xóa
                </ButtonComponent>
                <ButtonComponent
                  className="btn btn-add"
                  onClick={handleAddStatus}
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
                {/* Summary card */}
                <div className="status-summary">
                  <div className="summary-card">
                    <div className="summary-icon status">
                      <FaTag />
                    </div>
                    <div className="summary-info">
                      <h3>{status.length}</h3>
                      <p>Trạng thái hiện có</p>
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
                          <th>
                            <CheckboxComponent
                              isChecked={selectedRows.length === status.length && status.length > 0}
                              onChange={toggleSelectAll}
                            />
                          </th>
                          <th>STT</th>
                          <th>Mã trạng thái</th>
                          <th>Tên trạng thái</th>
                          <th>Mô tả</th>
                          <th>Thao tác</th>
                        </tr>
                      </thead>
                      <tbody>
                        {status.length > 0 ? (
                          status.map((item, index) => (
                            <tr
                              key={item.statusCode}
                              className={isSelected(item.statusCode) ? "highlight" : ""}
                            >
                              <td>
                                <CheckboxComponent
                                  isChecked={isSelected(item.statusCode)}
                                  onChange={() => toggleSelectRow(item.statusCode)}
                                />
                              </td>
                              <td>{index + 1}</td>
                              <td>
                                <div className="status-code-wrapper">
                                  {getStatusIcon(item.statusCode)}
                                  <span className="status-code">{item.statusCode}</span>
                                </div>
                              </td>
                              <td title={item.statusName}>
                                {truncateText(item.statusName, 25)}
                              </td>
                              <td className="status-description" title={item.statusDescription}>
                                {truncateText(item.statusDescription, 40)}
                              </td>
                              <td className="actions-column">
                                <button
                                  className="action-btn delete-btn"
                                  title="Xóa trạng thái"
                                  onClick={() => {
                                    setSelectedRows([item.statusCode]);
                                    handleDeleteStatus();
                                  }}
                                >
                                  <FaTrashAlt />
                                </button>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="6" className="empty-table">
                              <div className="empty-state">
                                <FaTag size={48} />
                                <p>Không có trạng thái nào để hiển thị.</p>
                                <ButtonComponent
                                  className="btn btn-add-small"
                                  onClick={handleAddStatus}
                                >
                                  Thêm trạng thái mới
                                </ButtonComponent>
                              </div>
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatusListPage;
