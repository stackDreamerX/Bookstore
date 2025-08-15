import React, { useState, useEffect } from "react";
import "./AddProductPage.css";
import FormComponent from "../../../../components/FormComponent/FormComponent";
import ButtonComponent from "../../../../components/ButtonComponent/ButtonComponent";
import Compressor from 'compressorjs';
import { createProduct } from "../../../../services/productServices";
import { useMutationHook } from "../../../../hooks/useMutationHook";
import Loading from "../../../../components/LoadingComponent/Loading";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBook, faPen, faUpload } from '@fortawesome/free-solid-svg-icons';

const AddProductPage = () => {
  const navigate = useNavigate();
  const accessToken = localStorage.getItem("access_token");
  const [stateproduct, setstateProduct] = useState({
    productName: "",
    productPrice: "",
    productImage: null,
    productCategory: "",
    productSize: "",
    productDescription: "",
    author: "",
    publisher: "",
    publicationDate: "",
    pageCount: "",
    language: "",
    bookFormat: "",
  });

  const [categories, setCategories] = useState([]);
  const [previewImage, setPreviewImage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

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
          setCategories(data.data);
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
    setstateProduct({ ...stateproduct, [name]: e.target.value });
  };

  const handleOnChangeImg = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    
    setstateProduct({ ...stateproduct, productImage: file });
    const previewUrl = URL.createObjectURL(file);
    setPreviewImage(previewUrl);
  };

  const mutation = useMutationHook(
    async (data) => {
      const response = await createProduct(data, accessToken);
      console.log("Response:", response);
      try {
        const result = await response;
        if (result.status === "OK") {
          alert("Thêm sách thành công!");
          navigate('/admin/products');
        } else {
          alert(`Thêm sách thất bại: ${result.message}`);
        }
      } catch (error) {
        alert("Đã xảy ra lỗi khi thêm sách!");
        console.error(error);
      }
      return response;
    }
  );
  
  const { data, isLoading, isSuccess, isError } = mutation;

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const formData = new FormData();
    formData.append("productName", stateproduct.productName);
    formData.append("productPrice", stateproduct.productPrice);
    formData.append("productCategory", stateproduct.productCategory);
    formData.append("productSize", stateproduct.productSize);
    formData.append("productDescription", stateproduct.productDescription);
    formData.append("productImage", stateproduct.productImage);
    formData.append("author", stateproduct.author);
    formData.append("publisher", stateproduct.publisher);
    formData.append("publicationDate", stateproduct.publicationDate);
    formData.append("pageCount", stateproduct.pageCount);
    formData.append("language", stateproduct.language);
    formData.append("bookFormat", stateproduct.bookFormat);

    mutation.mutate(formData);
  };

  return (
    <div className="admin-container">
      <div className="book-form-container">
        <h1 className="form-title">
          <FontAwesomeIcon icon={faBook} style={{ marginRight: '10px' }} />
          Thêm Sách Mới
        </h1>
        
        <Loading isLoading={isLoading} />
        
        {/* Phần tải lên ảnh */}
        <div className="image-upload-section">
          <div className="image-upload-container">
            <div className="image-placeholder">
              {previewImage ? (
                <img src={previewImage} alt="Ảnh bìa sách" className="book-cover-preview" />
              ) : (
                <div className="upload-placeholder-inner">
                  <FontAwesomeIcon icon={faBook} size="3x" style={{ color: '#d5bdaf' }} />
                  <p>Tải lên ảnh bìa sách</p>
                </div>
              )}
            </div>
            <input
              type="file"
              onChange={handleOnChangeImg}
              accept="image/*"
              required
              className="file-input-hidden"
              id="bookCoverUpload"
            />
            <label htmlFor="bookCoverUpload" className="upload-button">
              <FontAwesomeIcon icon={faUpload} style={{ marginRight: '8px' }} />
              Tải lên ảnh bìa sách
            </label>
          </div>
        </div>
        
        <form onSubmit={handleSubmit} className="book-form">
          {/* Thông tin cơ bản - hàng 1 */}
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">
                Tên sách <FontAwesomeIcon icon={faPen} className="edit-icon" />
              </label>
              <FormComponent
                placeholder="Nhập tên sách"
                name="productName"
                value={stateproduct.productName}
                onChange={handleInputChange}
                required
                className="form-input"
              />
            </div>
          </div>
          
          {/* Hàng 2 */}
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">
                Giá sách
              </label>
              <FormComponent
                placeholder="Nhập giá sách"
                name="productPrice"
                type="number"
                value={stateproduct.productPrice}
                onChange={handleInputChange}
                required
                className="form-input"
              />
            </div>
          </div>
          
          {/* Hàng 3 */}
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">
                Tác giả <FontAwesomeIcon icon={faPen} className="edit-icon" />
              </label>
              <FormComponent
                placeholder="Nhập tên tác giả"
                name="author"
                value={stateproduct.author}
                onChange={handleInputChange}
                required
                className="form-input"
              />
            </div>
          </div>
          
          {/* Hàng 4 */}
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">
                Nhà xuất bản <FontAwesomeIcon icon={faPen} className="edit-icon" />
              </label>
              <FormComponent
                placeholder="Nhập tên nhà xuất bản"
                name="publisher"
                value={stateproduct.publisher}
                onChange={handleInputChange}
                required
                className="form-input"
              />
            </div>
          </div>
          
          {/* Hàng 5 */}
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">
                Ngày xuất bản
              </label>
              <input
                type="date"
                name="publicationDate"
                value={stateproduct.publicationDate}
                onChange={handleInputChange}
                className="form-input date-input"
              />
            </div>
          </div>
          
          {/* Hàng 7 */}
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">
                Số trang
              </label>
              <FormComponent
                placeholder="Nhập số trang"
                name="pageCount"
                type="number"
                value={stateproduct.pageCount}
                onChange={handleInputChange}
                className="form-input"
              />
            </div>
          </div>
          
          {/* Hàng 8 */}
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">
                Ngôn ngữ
              </label>
              <FormComponent
                placeholder="Tiếng Việt, Tiếng Anh..."
                name="language"
                value={stateproduct.language}
                onChange={handleInputChange}
                className="form-input"
              />
            </div>
          </div>
          
          {/* Hàng 9 */}
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">
                Định dạng sách
              </label>
              <select
                className="form-input form-select"
                name="bookFormat"
                value={stateproduct.bookFormat}
                onChange={handleInputChange}
              >
                <option value="">Chọn định dạng</option>
                <option value="Hardcover">Bìa cứng</option>
                <option value="Paperback">Bìa mềm</option>
                <option value="Ebook">Sách điện tử</option>
              </select>
            </div>
          </div>
          
          {/* Hàng 10 */}
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">
                Thể loại sách
              </label>
              <select
                name="productCategory"
                value={stateproduct.productCategory}
                onChange={handleInputChange}
                className="form-input form-select"
                required
              >
                <option value="" disabled>Chọn thể loại sách</option>
                {Array.isArray(categories) && categories.length > 0 ? (
                  categories.map((category) => (
                    <option key={category._id} value={category._id}>
                      {category.categoryName}
                    </option>
                  ))
                ) : (
                  <option disabled>Không có thể loại sách</option>
                )}
              </select>
            </div>
          </div>
          
          {/* Hàng 11 */}
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">
                Kích thước sách
              </label>
              <FormComponent
                placeholder="VD: 14 x 20.5 cm"
                name="productSize"
                value={stateproduct.productSize}
                onChange={handleInputChange}
                required
                className="form-input"
              />
            </div>
          </div>
          
          {/* Hàng mô tả - chiếm full width */}
          <div className="form-row full-row">
            <div className="form-group full-width">
              <label className="form-label">
                Mô tả sách
              </label>
              <textarea
                className="form-textarea"
                name="productDescription"
                value={stateproduct.productDescription}
                onChange={handleInputChange}
                placeholder="Nhập mô tả sách, nội dung tóm tắt..."
                required
              />
            </div>
          </div>
          
          {/* Buttons - chiếm full width */}
          <div className="form-actions">
            <button 
              type="submit" 
              className="submit-button"
              disabled={isSubmitting || isLoading}
            >
              {isSubmitting || isLoading ? 'Đang xử lý...' : 'Thêm sách'}
            </button>
            <button 
              type="button" 
              className="cancel-button"
              onClick={() => navigate("/admin/products")}
            >
              Hủy
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProductPage;
