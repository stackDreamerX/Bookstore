import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useHistory để điều hướng
import ButtonComponent from "../../../../components/ButtonComponent/ButtonComponent";
import CheckboxComponent from "../../../../components/CheckboxComponent/CheckboxComponent";
import SideMenuComponent_AdminManage from "../../../../components/SideMenuComponent_AdminManage/SideMenuComponent_AdminManage";
import "./CategoryListPageN.css";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";

const CategoryListPage = () => {
  const navigate = useNavigate();

  const [selectedRows, setSelectedRows] = useState([]);  // State lưu danh sách các hàng được chọn
  const [categories, setCategories] = useState([]); // State lưu danh sách categories
  const AddCategory = () => {
    navigate("/admin/add-category")
  }

  const handleEdit = () => {
    if (selectedRows.length === 1) { // Đảm bảo chỉ có 1 category được chọn
      const categoryId = selectedRows[0];

      // Tìm category dựa trên categoryId
      const selectedCategory = categories.find((category) => category._id === categoryId);

      if (selectedCategory) {
        const { categoryCode, categoryName } = selectedCategory; // Lấy mã và tên loại
        navigate("/admin/update-category", {
          state: { categoryId, categoryCode, categoryName }, // Truyền toàn bộ dữ liệu cần thiết
        });
      } else {
        alert("Category not found!");
      }
    } else {
      alert("Please select exactly one category to edit.");
    }
  };
  // Fetch dữ liệu categories từ server
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("http://localhost:3001/api/category/get-all-category");
        const data = await response.json(); // Giả sử API trả về dữ liệu ở dạng JSON

        // Kiểm tra dữ liệu trả về có đúng format hay không
        if (data.status === "OK" && Array.isArray(data.data)) {
          setCategories(data.data); // Lưu dữ liệu vào state nếu dữ liệu hợp lệ
        } else {
          console.error("Unexpected data format", data);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories(); // Gọi hàm fetchCategories khi component mount
  }, []);

  // Hàm toggle chọn một dòng
  const toggleSelectRow = (id) => {
    setSelectedRows((prev) =>
      prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]
    );
  };

  // Hàm toggle chọn tất cả
  const toggleSelectAll = () => {
    setSelectedRows(
      selectedRows.length === categories.length
        ? [] // Nếu đã chọn tất cả thì bỏ chọn
        : categories.map((category) => category._id) // Chọn tất cả các category
    );
  };

  // Kiểm tra xem một hàng có được chọn không
  const isSelected = (id) => selectedRows.includes(id);

  const handleDelete = async () => {
    // Kiểm tra xem có category nào được chọn không
    if (selectedRows.length === 0) {
      alert("Please select at least one category to delete.");
      return;
    }

    // Hiển thị hộp thoại xác nhận
    const isConfirmed = window.confirm("Are you sure you want to delete the selected categories?");

    if (isConfirmed) {
      try {
        // Gửi yêu cầu xóa từng category được chọn
        for (let categoryId of selectedRows) {
          const response = await fetch(`/api/category/delete-category/${categoryId}`, {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
            },
          });

          const data = await response.json();

          if (!response.ok) {
            alert(`Error deleting category with ID ${categoryId}: ${data.message}`);
            continue; // Nếu có lỗi với category này, chuyển sang category tiếp theo
          }
        }

        alert("Selected categories have been deleted successfully!");

        // Cập nhật lại danh sách categories sau khi xóa
        setCategories(categories.filter((category) => !selectedRows.includes(category._id)));
        setSelectedRows([]); // Clear selected rows

      } catch (error) {
        console.error("Error deleting categories:", error);
        alert("Something went wrong while deleting the categories.");
      }
    } else {
      console.log("Category deletion cancelled.");
    }
  };


  const handleDeleteCategory = async (categoryId) => {
    // Hiển thị hộp thoại xác nhận
    const isConfirmed = window.confirm("Are you sure you want to delete this category?");

    if (isConfirmed) {

      try {
        const response = await fetch(`/api/category/delete-category/${categoryId}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        });

        const data = await response.json();

        if (response.ok) {
          alert("Category deleted successfully!");
          // Cập nhật UI hoặc làm mới danh sách category nếu cần
          setCategories(categories.filter((category) => category._id !== categoryId)); // Cập nhật lại danh sách
        } else {
          alert(`Error: ${data.message}`);
        }
      } catch (error) {
        console.error("Error deleting category:", error);
        alert("Something went wrong!");
      }
    } else {
      // Nếu người dùng chọn "Cancel", không làm gì cả
      console.log("Category deletion cancelled.");
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
          {/* Category List */}
          <div className="category-list__content">
            <div className="category-list__header">
              <h2 className="category-list__title">Thể loại sách hiện có</h2>
              <div className="category-actions">
                <ButtonComponent className="btn-action btn-delete" onClick={handleDelete}>
                  <DeleteOutlined /> Xóa
                </ButtonComponent>
                <ButtonComponent className="btn-action btn-edit" onClick={handleEdit}>
                  <EditOutlined /> Sửa
                </ButtonComponent>
                <ButtonComponent className="btn-action btn-add" onClick={AddCategory}>
                  <PlusOutlined /> Thêm
                </ButtonComponent>
              </div>
            </div>
            {/* Table */}
            <div className="category-table-container">
              <table className="category-table">
                <thead>
                  <tr>
                    <th className="checkbox-column">
                      <CheckboxComponent
                        isChecked={selectedRows.length === categories.length}
                        onChange={toggleSelectAll}
                      />
                    </th>
                    <th className="id-column">STT</th>
                    <th className="code-column">Mã loại</th>
                    <th className="name-column">Tên loại</th>
                    <th className="date-column">Ngày tạo</th>
                    <th className="action-column"></th>
                  </tr>
                </thead>
                <tbody>
                  {categories.length > 0 ? (
                    categories.map((category, index) => (
                      <tr
                        key={category._id}
                        className={isSelected(category._id) ? "selected-row" : ""}
                      >
                        <td className="checkbox-cell">
                          <CheckboxComponent
                            isChecked={isSelected(category._id)}
                            onChange={() => toggleSelectRow(category._id)}
                          />
                        </td>
                        <td className="id-cell">{index + 1}</td>
                        <td className="category-code-cell">{category.categoryCode}</td>
                        <td className="category-name-cell">{category.categoryName}</td>
                        <td className="date-cell">
                          {new Date(category.createdAt).toLocaleDateString("vi-VN", {
                            year: 'numeric',
                            month: '2-digit',
                            day: '2-digit'
                          })}
                        </td>
                        <td className="action-cell">
                          <button
                            className="delete-btn"
                            onClick={() => handleDeleteCategory(category._id)}
                            title="Xóa thể loại"
                          >
                            <DeleteOutlined style={{ fontSize: '18px' }} />
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="empty-table">Không có thể loại nào</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryListPage;
