import React, { useEffect, useRef, useState } from "react";
//import $ from "jquery";
import { useNavigate } from "react-router-dom";
import ButtonComponent from "../../../../components/ButtonComponent/ButtonComponent";
import FormComponent from "../../../../components/FormComponent/FormComponent";
import SideMenuComponent_AdminManage from "../../../../components/SideMenuComponent_AdminManage/SideMenuComponent_AdminManage";
import { useMutationHook } from "../../../../hooks/useMutationHook";
import { createDiscount } from "../../../../services/DiscountService";
import "./AddDiscountPage.css";


const AddDiscountPage = () => {
  const accessToken = localStorage.getItem("access_token");
  const [startDateTime, setStartDateTime] = useState("");
  const [endDateTime, setEndDateTime] = useState("");
  const [categories, setCategories] = useState([]); // State lưu danh sách category
  const [previewImage, setPreviewImage] = useState(null); // State để lưu URL của ảnh preview
  const startDateRef = useRef(null);
  const endDateRef = useRef(null);
  const navigate = useNavigate();
  const [statediscount, setstateDiscount] = useState({
    discountCode: "",
    discountName: "",
    discountValue: "",
    applicableCategory: "",
    discountImage: null,
    discountStartDate: "",
    discountEndDate: "",
  });

  // useEffect(() => {
  //   // Initialize Bootstrap Datepicker cho ngày bắt đầu
  //   $(startDateRef.current)
  //     .datepicker({
  //       format: "dd/mm/yyyy", // Định dạng dd/MM/yyyy
  //       autoclose: true, // Tự động đóng khi chọn ngày
  //       todayHighlight: true, // Làm nổi bật ngày hôm nay
  //     })
  //     .on("changeDate", (e) => {
  //       setStartDateTime(e.format()); // Cập nhật giá trị state khi thay đổi
  //     });

  //   // Initialize Bootstrap Datepicker cho ngày kết thúc
  //   $(endDateRef.current)
  //     .datepicker({
  //       format: "dd/mm/yyyy",
  //       autoclose: true,
  //       todayHighlight: true,
  //     })
  //     .on("changeDate", (e) => {
  //       setEndDateTime(e.format());
  //     });
  // }, []);

  const handleOnChangeImg = (event) => {
    const file = event.target.files[0];
    console.log("FILE", file)
    setstateDiscount({ ...statediscount, discountImage: file })
    const previewUrl = URL.createObjectURL(file); // Tạo URL preview từ file
    setPreviewImage(previewUrl); // Cập nhật state previewImage
  };

  // const handleDateChange = (ref, setDate) => {
  //   const value = ref.current?.value || "";
  //   setstateDiscount();
  // };
  useEffect(() => {
    const fetchCategories = async () => {
      try {

        const response = await fetch("http://localhost:3001/api/category/get-all-category", {
          method: "GET", // Phương thức GET để lấy danh sách category
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch categories");
        }

        const data = await response.json(); // Chuyển đổi dữ liệu từ JSON
        console.log("Categories data:", categories);

        // Kiểm tra và gán mảng categories từ data.data
        if (Array.isArray(data.data)) {
          setCategories(data.data); // Lưu danh sách category vào state
        } else {
          console.error("Categories data is not in expected format");
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, []);


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setstateDiscount({ ...statediscount, [e.target.name]: e.target.value });
  };

  const mutation = useMutationHook(
    async (data) => {
      try {
        const response = await createDiscount(data, accessToken);
        return response;
      } catch (error) {
        console.error("Error in mutation:", error);
        throw error; // Ném lỗi để useMutationHook xử lý
      }
    }
  );
  const { data, isLoading, isSuccess, isError } = mutation;

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("state", statediscount)

    // Kiểm tra các trường bắt buộc
    if (!statediscount.discountCode || !statediscount.discountName ||
        !statediscount.discountValue || !statediscount.applicableCategory ||
        !statediscount.discountImage || !statediscount.discountStartDate ||
        !statediscount.discountEndDate) {
      alert("Vui lòng điền đầy đủ thông tin khuyến mãi!");
      return;
    }

    const formData = new FormData();
    formData.append("discountCode", statediscount.discountCode);
    formData.append("discountName", statediscount.discountName);
    formData.append("discountValue", statediscount.discountValue);
    formData.append("applicableCategory", statediscount.applicableCategory);
    formData.append("discountImage", statediscount.discountImage);
    formData.append("discountStartDate", statediscount.discountStartDate);
    formData.append("discountEndDate", statediscount.discountEndDate);
    // Kiểm tra FormData
    for (let pair of formData.entries()) {
      console.log("FORM", `${pair[0]}: ${pair[1]}`);
    }

    mutation.mutate(formData, {
      onSuccess: (data) => {
        console.log("Response data:", data);
        if (data && data.status === "OK") {
          alert("Thêm khuyến mãi thành công!");
          navigate('/admin/discount-list');
        } else {
          let errorMessage = "Không rõ lỗi";
          if (data) {
            if (data.message) {
              errorMessage = data.message;
            } else if (typeof data === 'object') {
              errorMessage = JSON.stringify(data);
            }
          }
          alert(`Thêm khuyến mãi thất bại: ${errorMessage}`);
        }
      },
      onError: (error) => {
        console.error("Submit error:", error);
        let errorMessage = "Đã xảy ra lỗi";
        if (error) {
          if (error.message) {
            errorMessage = error.message;
          } else if (typeof error === 'object' && error.toString() !== '[object Object]') {
            errorMessage = error.toString();
          }
        }
        alert(`Thêm khuyến mãi thất bại: ${errorMessage}`);
      }
    });
  };

  const [activeTab, setActiveTab] = useState("discount");

  const handleTabClick = (tab, navigatePath) => {
    setActiveTab(tab);
    navigate(navigatePath);
  };
  return (
    <div>
      <div className="container-xl">
        <div className="add-discount__container">
          {/* side menu */}
          <div className="side-menu__discount">

            <SideMenuComponent_AdminManage
              activeTab={activeTab}
              handleTabClick={handleTabClick}
            />

          </div>
          {/* info */}
          <div className="add-discount__content">
            <div className="discount__info">
              {/* banner */}
              <div className="banner">
                <label className="banner__title">Banner khuyến mãi</label>
                <br />
                <input
                  className="banner_image"
                  type="file"
                  onChange={handleOnChangeImg}
                  accept="image/*"
                  required
                />
                <div className="banner__image">
                  {previewImage && (
                    <img
                      src={previewImage}
                      alt="Preview"
                      className="banner__image"
                    // style={{
                    //   width: "36rem",
                    //   height: "40rem",
                    //   borderRadius: "15px"
                    // }}
                    />
                  )}
                </div>
              </div>
              {/* content */}
              <div className="content">
                <div className="content__item">
                  <label className="id__title">Mã khuyến mãi</label>
                  <FormComponent placeholder="Nhập mã khuyến mãi"
                    name="discountCode"
                    onChange={handleInputChange}
                    value={statediscount.discountCode}
                  ></FormComponent>
                </div>
                <div className="content__item">
                  <label className="name__title">Tên khuyến mãi</label>
                  <FormComponent placeholder="Nhập tên khuyến mãi"
                    name="discountName"
                    value={statediscount.discountName}
                    onChange={handleInputChange}></FormComponent>
                </div>
                <div className="content__item">
                  <label className="value__title">Giá trị khuyến mãi (VND)</label>
                  <FormComponent placeholder="Nhập giá trị khuyến mãi"
                    className="choose-property"
                    name="discountValue"
                    value={statediscount.discountValue}
                    onChange={handleInputChange}
                  ></FormComponent>
                </div>
                <div className="content__item">
                  <label className="category__title">Loại áp dụng</label>
                  <br />
                  <select
                    name="applicableCategory"
                    value={statediscount.applicableCategory}
                    onChange={handleInputChange}
                    className="choose-property"
                    style={{ width: "36rem", height: "6rem", border: "none", color: "grey", borderRadius: "50px", boxShadow: "0px 2px 4px 0px #203c1640", padding: "15px" }}
                    placeholder="Chọn loại sản phẩm"
                  >
                    <option value="" disabled>Chọn loại sản phẩm</option>
                    {Array.isArray(categories) && categories.length > 0 ? (
                      categories.map((category) => (
                        <option key={category._id} value={category._id}>
                          {category.categoryName}
                        </option>
                      ))
                    ) : (
                      <option disabled>Không có loại sản phẩm</option>
                    )}
                  </select>
                </div>
                <div className="content__item">
                  <label className="time-start__title">
                    Ngày bắt đầu: <strong>{startDateTime}</strong>
                  </label>
                  <input
                    type="date"
                    className="form-control discount__date"
                    placeholder="Chọn ngày bắt đầu"
                    ref={startDateRef}
                    name="discountStartDate"
                    onChange={handleInputChange}
                    value={statediscount.discountStartDate}
                  />
                </div>
                <div className="content__item">
                  <label className="time-end__title">
                    Ngày kết thúc: <strong>{endDateTime}</strong>
                  </label>
                  <input
                    type="date"
                    className="form-control discount__date"
                    placeholder="Chọn ngày kết thúc"
                    ref={endDateRef}
                    name="discountEndDate"
                    onChange={handleInputChange}
                    value={statediscount.discountEndDate}
                  />
                </div>
              </div>

              {/* button */}
              <div className="btn__add-discount">
                <ButtonComponent onClick={handleSubmit}>Lưu</ButtonComponent>
                <ButtonComponent onClick={() => navigate("/admin/discount-list")}>Thoát</ButtonComponent>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddDiscountPage;
