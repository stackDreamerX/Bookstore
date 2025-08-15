import FormComponent from "../../../../components/FormComponent/FormComponent";
import SideMenuComponent_AdminManage from "../../../../components/SideMenuComponent_AdminManage/SideMenuComponent_AdminManage";
import ButtonComponent from "../../../../components/ButtonComponent/ButtonComponent";
import "./UpdateStatusPage.css";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { useMutationHook } from "../../../../hooks/useMutationHook";
import Loading from "../../../../components/LoadingComponent/Loading";
import Message from "../../../../components/MessageComponent/Message";
import * as StatusService from "../../../../services/StatusService";
import { useEffect, useState } from "react";
import EditIconComponent from "../../../../components/EditIconComponent/EditIconComponent";

const UpdateStatusPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const accessToken = localStorage.getItem("access_token");

  const [isEditing, setIsEditing] = useState(false);
  const [statusMessage, setStatusMessage] = useState(null);

  const detailStatus = useSelector((state) => state.status.detailStatus || {}); // Lấy chi tiết status từ Redux

  console.log("detailStatus", detailStatus);

  const [formValues, setFormValues] = useState({
    statusCode: detailStatus.statusCode || "",
    statusName: detailStatus.statusName || "",
    statusDescription: detailStatus.statusDescription || "",
    // access_token: accessToken,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  const mutation = useMutationHook((data) => {
    const { id, ...rests } = data;
    StatusService.updateStatus(id, rests, accessToken);
  });

  const handleExit = () => {
    navigate(location.state?.from || "/admin/status-list");
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleUpdate = () => {
    const statusData = {
      id: detailStatus?._id,
      statusCode: formValues.statusCode,
      statusName: formValues.statusName,
      statusDescription: formValues.statusDescription,
      // access_token: accessToken,
    };
    // console.log("User  data to update:", userData); // Log dữ liệu
    // console.log("Size of userData:", JSON.stringify(userData).length); // Log kích thước
    // console.log("statusData:", statusData);
    mutation.mutate(statusData);
    // const dataSize = new Blob([JSON.stringify(userData)]).size; // Sử dụng Blob để tính kích thước
    // console.log("Size of userData:", dataSize, "bytes");
    setIsEditing(false);
  };

  useEffect(() => {
    if (mutation.isSuccess) {
      setStatusMessage({
        type: "Success",
        message: "Cập nhật trạng thái thành công!",
      });
    } else if (mutation.isError) {
      const errorMessage =
        mutation.error?.message.message ||
        JSON.stringify(mutation.error) ||
        "Lỗi khi cập nhật trạng thái.";
      console.log("errorMessage", errorMessage);
      setStatusMessage({
        type: "Error",
        message: errorMessage,
      });
    }
  }, [mutation.isSuccess, mutation.isError, mutation.error]);

   const [activeTab, setActiveTab] = useState("status");
  
    const handleTabClick = (tab, navigatePath) => {
      setActiveTab(tab);
      navigate(navigatePath);
    };

  return (
    <div>
      <div className="container-xl">
        {statusMessage && (
          <Message
            type={statusMessage.type}
            message={
              typeof statusMessage.message === "string"
                ? statusMessage.message
                : JSON.stringify(statusMessage.message)
            }
            duration={3000}
            onClose={() => setStatusMessage(null)}
          />
        )}
        <div className="update-status__container">
          {/* side menu */}
          <div className="side-menu__discount">
            <SideMenuComponent_AdminManage
              activeTab={activeTab}
              handleTabClick={handleTabClick}
            />
          </div>

          <iv className="update-status__content">
            <div className="status__info">
              <div
                className="update-status__title d-flex "
                style={{ justifyContent: "space-between" }}
              >
                <h2>Sửa trạng thái</h2>
                <EditIconComponent onClick={handleEditClick} />
              </div>

              <div className="content">
                <div className="content__item">
                  <label className="id__title">Mã trạng thái</label>
                  <FormComponent
                    placeholder="Nhập mã trạng thái"
                    name="statusCode"
                    value={formValues.statusCode}
                    onChange={handleInputChange}
                  ></FormComponent>
                </div>
                <div className="content__item" style={{ position: "relative" }}>
                  <label className="name__title">Tên trạng thái</label>

                  <FormComponent
                    placeholder="Nhập tên trạng thái"
                    name="statusName"
                    value={formValues.statusName}
                    onChange={handleInputChange}
                  ></FormComponent>
                </div>
                <div className="content__item">
                  <label className="description__title">Mô tả trạng thái</label>
                  <FormComponent
                    placeholder="Nhập mô tả"
                    name="statusDescription"
                    value={formValues.statusDescription}
                    onChange={handleInputChange}
                  ></FormComponent>
                </div>
              </div>

              {/* button */}
              <div className="btn__update-status">
                {/* {isEditing && ( */}
                <ButtonComponent onClick={handleUpdate}>Lưu</ButtonComponent>
                {/* )} */}
                <ButtonComponent onClick={handleExit}>Thoát</ButtonComponent>
              </div>
            </div>
          </iv>
        </div>
      </div>
    </div>
  );
};

export default UpdateStatusPage;
