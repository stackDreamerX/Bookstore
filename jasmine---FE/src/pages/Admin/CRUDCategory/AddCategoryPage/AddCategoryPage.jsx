import React, { useState, useEffect } from "react";
import FormComponent from "../../../../components/FormComponent/FormComponent";
import SideMenuComponent from "../../../../components/SideMenuComponent/SideMenuComponent";
import ButtonComponent from "../../../../components/ButtonComponent/ButtonComponent";
import "./AddCategoryPage.css";
import { useNavigate } from "react-router-dom";
import SideMenuComponent_AdminManage from "../../../../components/SideMenuComponent_AdminManage/SideMenuComponent_AdminManage";
import { PlusOutlined, ArrowLeftOutlined } from "@ant-design/icons";

const AddCategoryPage = () => {
  const navigate = useNavigate();
  const [category, setCategory] = useState({
    categoryCode: "",
    categoryName: "",
  });
  const [generatedId, setGeneratedId] = useState("");

  // Generate a random category ID when component mounts
  useEffect(() => {
    setGeneratedId(generateID());
  }, []);

  // Add generateID function to generate a random category ID
  const generateID = () => {
    // Generate a random category code format C + 3 digits
    return `C${Math.floor(Math.random() * 900) + 100}`;
  };

  const ExitForm = () => {
    navigate("/admin/category-list")
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCategory({ ...category, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!category.categoryName.trim()) {
      alert("Vui lòng nhập tên thể loại!");
      return;
    }

    try {
      // Use the generated ID if categoryCode is empty
      const categoryData = {
        ...category,
        categoryCode: generatedId
      };

      // Lấy access token từ localStorage
      const accessToken = localStorage.getItem("access_token");

      if (!accessToken) {
        alert("Bạn chưa đăng nhập. Vui lòng đăng nhập để thực hiện thao tác này.");
        return;
      }

      // Gửi yêu cầu API tạo category
      const response = await fetch("http://localhost:3001/api/category/create-category", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Token: `Bearer ${accessToken}`, // Thêm access token
        },
        body: JSON.stringify(categoryData),
      });

      const result = await response.json();
      if (response.ok) {
        alert("Thêm thể loại sách thành công!");
        // Reset form
        setCategory({ categoryCode: "", categoryName: "" });
        navigate("/admin/category-list");
      } else {
        alert(`Thêm thể loại sách thất bại: ${result.message}`);
      }
    } catch (error) {
      alert("Đã xảy ra lỗi khi thêm thể loại sách!");
      console.error(error);
    }
  };

  const [activeTab, setActiveTab] = useState("category");

  const handleTabClick = (tab, navigatePath) => {
    setActiveTab(tab);
    navigate(navigatePath);
  };

  return (
    <div className="category-page-container">
      <div className="category-page-wrapper">
        <div className="category-list__info">
          {/* Side Menu */}
          <div className="side-menu__category">
            <SideMenuComponent_AdminManage
              activeTab={activeTab}
              handleTabClick={handleTabClick}
            />
          </div>

          {/* Category Form */}
          <div className="add-category__content">
            <div className="category-header">
              <h2 className="category-title">Thêm thể loại sách</h2>
              <button className="back-button" onClick={ExitForm}>
                <ArrowLeftOutlined /> Quay lại danh sách
              </button>
            </div>

            <div className="category-form-container">
              <div className="category-form-card">
                <div className="form-row id-row">
                  <label className="form-label">Mã thể loại:</label>
                  <div className="id-display">
                    <span className="id-value">{generatedId}</span>
                    <small className="id-note">(Được tạo tự động)</small>
                  </div>
                </div>

                <div className="form-row">
                  <label className="form-label">
                    Tên thể loại: <span className="required">*</span>
                  </label>
                  <FormComponent
                    className="name-input"
                    placeholder="Nhập tên thể loại (Ví dụ: Tiểu thuyết, Sách thiếu nhi...)"
                    name="categoryName"
                    value={category.categoryName}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="form-actions">
                  <button
                    className="direct-btn direct-btn-submit"
                    onClick={handleSubmit}
                    disabled={!category.categoryName.trim()}
                  >
                    <PlusOutlined /> Thêm thể loại
                  </button>
                  <button
                    className="direct-btn direct-btn-cancel"
                    onClick={ExitForm}
                  >
                    Hủy bỏ
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddCategoryPage;
