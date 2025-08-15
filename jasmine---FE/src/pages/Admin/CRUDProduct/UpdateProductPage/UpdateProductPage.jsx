import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import "./UpdateProductPage.css";
import FormComponent from "../../../../components/FormComponent/FormComponent";
import DropdownComponent from "../../../../components/DropdownComponent/DropdownComponent";
import ButtonComponent from "../../../../components/ButtonComponent/ButtonComponent";
import SizeComponent from "../../../../components/SizeComponent/SizeComponent";
import { useNavigate } from "react-router-dom";
import * as productService from "../../../../services/productServices";
import { useMutationHook } from "../../../../hooks/useMutationHook";
import StarRating from "../../../../components/StarRating/StarRating";
import { getReviewsByProduct, toggleReviewVisibility, deleteReview } from "../../../../services/ReviewService";
import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";
import { FaEye, FaEyeSlash, FaTimes, FaTrashAlt } from "react-icons/fa";

const UpdateProductPage = () => {
  const navigate = useNavigate();
  const accessToken = localStorage.getItem("access_token");
  const { state: productData } = useLocation(); // Nhận dữ liệu từ `state`
  const [product, setProduct] = useState(
    productData || {
      productName: "",
      productPrice: "",
      productSize: "",
      productCategory: "",
      productImage: null,
      productDescription: "",
    }
  );

  // State for product reviews
  const [reviews, setReviews] = useState([]);
  const [loadingReviews, setLoadingReviews] = useState(false);
  const [reviewError, setReviewError] = useState("");

  const [categories, setCategories] = useState([]); // State lưu danh sách category

  // Add state for expanded description
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);

  // Toggle description expansion
  const toggleDescriptionExpand = () => {
    setIsDescriptionExpanded(!isDescriptionExpanded);
  };

  // Add state for review details modal
  const [selectedReview, setSelectedReview] = useState(null);

  // Function to open review details modal
  const openReviewDetails = (review) => {
    setSelectedReview(review);
  };

  // Function to close review details modal
  const closeReviewDetails = () => {
    setSelectedReview(null);
  };

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

  // Fetch product reviews when product ID is available
  useEffect(() => {
    const fetchReviews = async () => {
      if (product && product.productId) {
        setLoadingReviews(true);
        try {
          const response = await getReviewsByProduct(product.productId);
          if (response.status === "OK") {
            setReviews(response.data);
          } else {
            setReviewError("Không thể tải đánh giá sản phẩm");
          }
        } catch (error) {
          console.error("Error fetching reviews:", error);
          setReviewError("Đã xảy ra lỗi khi tải đánh giá");
        } finally {
          setLoadingReviews(false);
        }
      }
    };

    fetchReviews();
  }, [product.productId]);

  const [imagePreview, setImagePreview] = useState(
    product.productImage || null
  );

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProduct({ ...product, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const previewURL = URL.createObjectURL(file); // Tạo URL tạm để hiển thị hình
      setImagePreview(previewURL);
      setProduct({ ...product, productImage: file });
    }
  };

  const handleEditImage = () => {
    document.getElementById("imageInput").click(); // Kích hoạt input chọn file
  };


  const mutation = useMutationHook(
    async (data) => {
      for (let pair of data.formData.entries()) {
        console.log("form", `${pair[0]}: ${pair[1]}`);
      }
      console.log("DATA", data)
      const response = await productService.updateproduct(data.id, accessToken, data.formData);
      console.log("RESULT", response);
      try {
        const result = await response;

        if (result.status === "OK") {
          alert("Cập nhật thành công!");
          navigate('/admin/products')
          // Reset form
          //setProduct({productName: "", productPrice: "", productCategory:null, productImage:null, productSize:"" });
        } else {
          alert(`Thêm bánh thất bại: ${result.message}`);
        }
      } catch (error) {
        alert("Đã xảy ra lỗi khi thêm bánh!");
        console.error(error);
      }
      return response;
    }
  );
  const { data, isLoading, isSuccess, isError } = mutation;

  const handleSubmit = () => {

    console.log("state", product)
    const formData = new FormData();
    formData.append("productName", product.productName);
    formData.append("productPrice", product.productPrice);
    formData.append("productCategory", product.productCategory);
    formData.append("productSize", product.productSize);
    formData.append("productDescription", product.productDescription);
    formData.append("productImage", product.productImage);
    // Kiểm tra FormData

    const data = { id: product.productId, formData: formData }

    const response = mutation.mutate(data)
  };

  // Handle toggling review visibility
  const handleToggleVisibility = async (reviewId) => {
    try {
      const response = await toggleReviewVisibility(reviewId);

      if (response.status === "OK") {
        // Update the review in the list
        setReviews(prevReviews =>
          prevReviews.map(review =>
            review._id === reviewId
              ? { ...review, isVisible: !review.isVisible }
              : review
          )
        );
      }
    } catch (error) {
      console.error("Error toggling review visibility:", error);
    }
  };

  // Handle deleting a review
  const handleDeleteReview = async (reviewId) => {
    try {
      if (window.confirm("Bạn có chắc chắn muốn xóa đánh giá này không?")) {
        const response = await deleteReview(reviewId);

        if (response.status === "OK") {
          // Remove the review from the list
          setReviews(prevReviews =>
            prevReviews.filter(review => review._id !== reviewId)
          );
        }
      }
    } catch (error) {
      console.error("Error deleting review:", error);
    }
  };

  // Format the review date
  const formatReviewDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return formatDistanceToNow(date, { addSuffix: true, locale: vi });
    } catch (error) {
      console.error("Error formatting date:", error);
      return "N/A";
    }
  };

  //Xoa
  const handleDelete = async (productId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this product?");

    if (confirmDelete) {
      try {
        // Call the API to delete the product and image
        const response = await productService.deleteProduct(productId, accessToken)
        console.log("RESPONSE", response)
        if (response.status = "OK") {
          alert("Product deleted successfully!");
          // Redirect to product list page
          navigate("/admin/products")
        }
      } catch (error) {
        console.error("Error deleting product:", error);
        alert("Failed to delete product");
      }
    }
  };

  return (
    <div>
      <div className="container-xl update-product">
        <h1 className="update-product__title">Cập nhật sản phẩm</h1>

        {/* update information */}
        <div className="update-product__information">
          {/* info top */}
          <div className="info__top">
            {/* infor left */}
            <div className="info__left">
              <div className="product__image-container">
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="Product Preview"
                    className="product__image-preview"
                  />
                ) : (
                  <div className="product__image-placeholder">
                    Chọn hình ảnh
                  </div>
                )}
                <input
                  id="imageInput"
                  className="product__image"
                  type="file"
                  name="productImage"
                  onChange={handleImageChange}
                  accept="image/*"
                  style={{ display: "none" }}
                />
                <div className="icon__update-image" onClick={handleEditImage}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 30 30"
                    fill="none"
                  >
                    <path
                      d="M17.575 11.275L18.725 12.425L7.4 23.75H6.25V22.6L17.575 11.275ZM22.075 3.75C21.7625 3.75 21.4375 3.875 21.2 4.1125L18.9125 6.4L23.6 11.0875L25.8875 8.8C26.0034 8.68436 26.0953 8.547 26.158 8.39578C26.2208 8.24456 26.2531 8.08246 26.2531 7.91875C26.2531 7.75504 26.2208 7.59294 26.158 7.44172C26.0953 7.2905 26.0034 7.15314 25.8875 7.0375L22.9625 4.1125C22.7125 3.8625 22.4 3.75 22.075 3.75ZM17.575 7.7375L3.75 21.5625V26.25H8.4375L22.2625 12.425L17.575 7.7375Z"
                      fill="#3A060E"
                    />
                  </svg>
                </div>
              </div>
            </div>

            {/* info right */}
            <div className="info__right">
              <div className="product-name">
                <label className="label-name">Tên sản phẩm</label>
                <div className="form-field-container">
                  <FormComponent
                    name="productName"
                    value={product.productName}
                    onChange={handleInputChange}
                  ></FormComponent>
                </div>
              </div>

              <div className="product-price">
                <label className="label-price">Giá sản phẩm</label>
                <div className="form-field-container">
                  <FormComponent
                    name="productPrice"
                    value={product.productPrice}
                    onChange={handleInputChange}
                  ></FormComponent>
                </div>
              </div>

              <div className="product-category">
                <label className="label-category">Loại sản phẩm</label>
                <div className="form-field-container">
                  <select
                    name="productCategory"
                    value={product.productCategory}
                    onChange={handleInputChange}
                    className="choose-property"
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
              </div>

              <div className="product-size">
                <label className="label-size">Kích thước sản phẩm</label>
                <div className="form-field-container">
                  <div className="item__size">
                    <SizeComponent
                      name="productSize"
                      value={product.productSize}
                      isSelected={product.productSize}
                      onChange={handleInputChange}
                    >
                      {product.productSize}
                    </SizeComponent>

                    <div className="size-add-tooltip">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="30"
                        height="30"
                        viewBox="0 0 30 30"
                        fill="none"
                      >
                        <path
                          fill-rule="evenodd"
                          clip-rule="evenodd"
                          d="M26.25 15C26.25 21.2132 21.2132 26.25 15 26.25C8.7868 26.25 3.75 21.2132 3.75 15C3.75 8.7868 8.7868 3.75 15 3.75C21.2132 3.75 26.25 8.7868 26.25 15ZM15 22.25C14.4477 22.25 14 21.8023 14 21.25V16H8.75C8.19772 16 7.75 15.5523 7.75 15C7.75 14.4477 8.19772 14 8.75 14H14V8.75C14 8.19772 14.4477 7.75 15 7.75C15.5523 7.75 16 8.19772 16 8.75V14H21.25C21.8023 14 22.25 14.4477 22.25 15C22.25 15.5523 21.8023 16 21.25 16H16V21.25C16 21.8023 15.5523 22.25 15 22.25Z"
                          fill="#3A060E"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* info bot */}
          <div className="info__bot">
            <div className="description-header">
              <label className="label-description">Mô Tả</label>
              <button
                className="expand-button"
                onClick={toggleDescriptionExpand}
                title={isDescriptionExpanded ? "Thu gọn" : "Xem thêm"}
                type="button"
              >
                {isDescriptionExpanded ? <FaEyeSlash /> : <FaEye />}
                <span>{isDescriptionExpanded ? "Thu gọn" : "Xem thêm"}</span>
              </button>
            </div>
            <textarea
              name="productDescription"
              className={`product-description ${isDescriptionExpanded ? 'expanded' : ''}`}
              value={product.productDescription}
              onChange={(e) =>
                setProduct({ ...product, productDescription: e.target.value })
              }
              placeholder="Nhập mô tả sản phẩm"
              required
            />
          </div>
        </div>
        {/* submit */}
        <div className="btn-submit">
          <ButtonComponent onClick={handleSubmit}>Lưu</ButtonComponent>
          <ButtonComponent onClick={() => handleDelete(product.productId)}>Xóa</ButtonComponent>
          <ButtonComponent onClick={() => navigate("/admin/products")}>Thoát</ButtonComponent>
        </div>

        {/* Product Reviews Management Section */}
        <div className="product-reviews-admin">
          <h2 className="reviews-admin-title">Quản lý đánh giá sản phẩm</h2>

          {loadingReviews ? (
            <div className="reviews-loading">
              <i className="fas fa-spinner fa-spin"></i>
              <p>Đang tải đánh giá...</p>
            </div>
          ) : reviewError ? (
            <div className="reviews-error">
              <i className="fas fa-exclamation-circle"></i>
              <p>{reviewError}</p>
            </div>
          ) : reviews.length === 0 ? (
            <div className="no-reviews">
              <i className="fas fa-comment-slash"></i>
              <p>Sản phẩm chưa có đánh giá nào</p>
            </div>
          ) : (
            <div className="reviews-table-container">
              <table className="reviews-table">
                <thead>
                  <tr>
                    <th>Người dùng</th>
                    <th>Đánh giá</th>
                    <th>Nội dung</th>
                    <th>Thời gian</th>
                    <th>Trạng thái</th>
                    <th>Hành động</th>
                  </tr>
                </thead>
                <tbody>
                  {reviews.map(review => (
                    <tr
                      key={review._id}
                      className={review.isVisible ? "" : "hidden-review-row"}
                    >
                      <td className="username-cell">{review.username || "Anonymous User"}</td>
                      <td className="rating-cell">
                        <StarRating rating={review.rating} readOnly={true} size="small" />
                      </td>
                      <td className="comment-cell">
                        <div className="comment-content">
                          {review.comment}
                        </div>
                      </td>
                      <td className="date-cell">{formatReviewDate(review.createdAt)}</td>
                      <td className="status-cell">
                        <span className={`status-badge ${review.isVisible ? "visible" : "hidden"}`}>
                          {review.isVisible ? "Hiển thị" : "Đã ẩn"}
                        </span>
                      </td>
                      <td className="actions-cell">
                        <div className="review-actions">
                          <button
                            className={`visibility-btn ${review.isVisible ? "hide-btn" : "show-btn"}`}
                            onClick={() => handleToggleVisibility(review._id)}
                            title={review.isVisible ? "Ẩn đánh giá" : "Hiện đánh giá"}
                          >
                            {review.isVisible ? (
                              <i className="fas fa-eye-slash"></i>
                            ) : (
                              <i className="fas fa-eye"></i>
                            )}
                          </button>
                          <button
                            className="delete-btn"
                            onClick={() => handleDeleteReview(review._id)}
                            title="Xóa đánh giá"
                          >
                            <i className="fas fa-trash"></i>
                          </button>
                          <button
                            className="view-details-btn-icon"
                            onClick={() => openReviewDetails(review)}
                            title="Xem chi tiết"
                          >
                            <i className="fas fa-search-plus"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Review Details Modal */}
      {selectedReview && (
        <div className="review-details-modal">
          <div className="review-details-content">
            <div className="review-details-header">
              <h3>Chi tiết đánh giá</h3>
              <button className="close-modal-btn" onClick={closeReviewDetails}>
                <FaTimes />
              </button>
            </div>
            <div className="review-details-body">
              <div className="review-detail-row">
                <span className="review-detail-label">Người dùng:</span>
                <span className="review-detail-value">
                  {selectedReview.username || "Anonymous User"}
                </span>
              </div>
              <div className="review-detail-row">
                <span className="review-detail-label">Đánh giá:</span>
                <span className="review-detail-value">
                  <StarRating
                    rating={selectedReview.rating}
                    readOnly={true}
                    size="small"
                  />
                </span>
              </div>
              <div className="review-detail-row">
                <span className="review-detail-label">Thời gian:</span>
                <span className="review-detail-value">
                  {formatReviewDate(selectedReview.createdAt)}
                </span>
              </div>
              <div className="review-comment-full">
                <span className="review-detail-label">Nội dung:</span>
                <div className="review-comment-text">
                  {selectedReview.comment}
                </div>
              </div>
            </div>
            <div className="review-details-footer">
              <div className="review-details-actions">
                <button
                  className={`visibility-btn ${selectedReview.isVisible ? "hide-btn" : "show-btn"}`}
                  onClick={() => {
                    handleToggleVisibility(selectedReview._id);
                    closeReviewDetails();
                  }}
                >
                  {selectedReview.isVisible ?
                    <><FaEyeSlash /> Ẩn đánh giá</> :
                    <><FaEye /> Hiện đánh giá</>
                  }
                </button>
                <button
                  className="delete-btn-full"
                  onClick={() => {
                    handleDeleteReview(selectedReview._id);
                    closeReviewDetails();
                  }}
                >
                  <FaTrashAlt /> Xóa đánh giá
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UpdateProductPage;
