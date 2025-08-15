import { useState, useEffect } from "react";
import "./ProductPageAdmin.css";
import CardProductAdmin from "../../../../components/CardProductAdmin/CardProductAdmin";
import AddBtn from "../../../../components/AddBtn(+)/AddBtn";
import SideMenuItem from "../../../../components/SideMenuItem/SideMenuItem";
import * as productService from "../../../../services/productServices";
import axios from 'axios'; // For making API calls
import { Button, Modal } from "react-bootstrap";
import { getAllCategory } from "../../../../services/CategoryService";
import { useNavigate, useLocation } from "react-router-dom";
import { getProductsByCategory, getAllproduct, deleteProduct } from "../../../../services/productServices";

const ProductPageAdmin = () => {
  const [products, setProducts] = useState([]); // State lưu danh sách sản phẩm
  const [displayedProducts, setDisplayedProducts] = useState([]); // State lưu danh sách sản phẩm đã phân trang để hiển thị
  const [categories, setCategories] = useState([]); // State lưu danh sách category
  const [currentCategory, setCurrentCategory] = useState(null); // State lưu category hiện tại
  const [currentCategoryName, setCurrentCategoryName] = useState("Tất cả sản phẩm"); // State lưu tên category hiện tại
  const [currentPage, setCurrentPage] = useState(0); // Trang hiện tại
  const [totalPages, setTotalPages] = useState(0); // Tổng số trang
  const [error, setError] = useState(""); // State lưu lỗi
  const [isLoading, setIsLoading] = useState(false); // State loading
  const [productsCount, setProductsCount] = useState(0); // Số lượng sản phẩm
  const ITEMS_PER_PAGE = 9; // Số sản phẩm trên mỗi trang
  const [accessToken, setAccessToken] = useState(localStorage.getItem("accessToken"));

  const navigate = useNavigate();
  const location = useLocation();

  const previousCategoryId = location.state?.categoryIds || null;

   useEffect(() => {
      const fetchCategories = async () => {
        try {
          setIsLoading(true);
          const data = await getAllCategory();
          setCategories(data.data); // Lưu danh sách category vào state
          setIsLoading(false);
        } catch (error) {
          console.error("Error fetching categories:", error);
          setIsLoading(false);
        }
      };
      fetchCategories();
    }, []);

    // Fetch danh sách sản phẩm theo category
    const fetchProductsByCategory = async (categoryId = null) => {
      try {
        setIsLoading(true);

        if (!categoryId) {
          // Nếu không có categoryId, gọi hàm lấy tất cả sản phẩm
          await fetchAllProducts();
          setIsLoading(false);
          return;
        }

        const data = await getProductsByCategory(categoryId);
        setProductsCount(data.data.length);
        setTotalPages(Math.ceil(data.data.length / ITEMS_PER_PAGE));

        if (Array.isArray(data.data)) {
          setProducts(data.data);
          paginateProducts(data.data, currentPage);
        } else if (Array.isArray(data)) {
          // Nếu API trả về mảng trực tiếp thay vì đối tượng có thuộc tính data
          setProducts(data);
          paginateProducts(data, currentPage);
        } else {
          console.error("Products data is not in expected format:", data);
          setProducts([]);
          setDisplayedProducts([]);
        }
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching products by category:", error);
        setIsLoading(false);
        setProducts([]);
        setDisplayedProducts([]);
      }
    };

    // fetch danh sach san pham
    const fetchAllProducts = async () => {
      try {
        setIsLoading(true);

        const data = await getAllproduct();
        setProductsCount(data.data.length);
        setTotalPages(Math.ceil(data.data.length / ITEMS_PER_PAGE));

        if (Array.isArray(data.data)) {
          setProducts(data.data);
          paginateProducts(data.data, currentPage);
        } else {
          console.error("Products data is not in expected format");
          setDisplayedProducts([]);
        }
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching products:", error);
        setIsLoading(false);
        setDisplayedProducts([]);
      }
    };

  // Hàm phân trang sản phẩm
  const paginateProducts = (productsToDisplay, page) => {
    const startIndex = page * ITEMS_PER_PAGE;
    const paginatedProducts = productsToDisplay.slice(startIndex, startIndex + ITEMS_PER_PAGE);
    setDisplayedProducts(paginatedProducts);
  };

  // Xử lý khi thay đổi trang
  const handlePageChange = (page) => {
    setCurrentPage(page);
    paginateProducts(products, page);
  };

 // Khi component được mount
  useEffect(() => {
    // Đảm bảo categories đã được tải xong
    if (categories.length === 0) {
      return;
    }

    if (previousCategoryId) {
      const selectedCategory = categories.find(cat => cat._id === previousCategoryId);

      if (selectedCategory) {
        setCurrentCategory(previousCategoryId);
        setCurrentCategoryName(selectedCategory.categoryName);
        setCurrentPage(0);
        fetchProductsByCategory(previousCategoryId);
      } else {
        console.error("Category not found in categories list:", previousCategoryId);
        setCurrentCategoryName("Tất cả sản phẩm");
        fetchAllProducts();
      }
    } else {
      setCurrentCategoryName("Tất cả sản phẩm");
      fetchAllProducts();
    }
  }, [previousCategoryId, categories]);

  // Khi nhấn vào category
  const handleCategoryClick = (categoryId, categoryName) => {
    if (!categoryId) {
      handleAllProductsClick();
      return;
    }

    setCurrentCategory(categoryId);
    setCurrentCategoryName(categoryName);
    setCurrentPage(0);
    fetchProductsByCategory(categoryId);
  };

  // Khi nhấn vào Tất cả sản phẩm
  const handleAllProductsClick = () => {
    setCurrentCategory(null);
    setCurrentCategoryName("Tất cả sản phẩm");
    setCurrentPage(0);
    fetchAllProducts();
  };

  // Phân trang
  const Pagination = ({ currentPage, totalPages, onPageChange }) => {
    const pages = Array.from({ length: totalPages }, (_, index) => index);

    if (totalPages <= 1) return null;

    return (
      <div className="pagination-container">
        <button
          className="pageNumber prev-button"
          onClick={() => onPageChange(Math.max(0, currentPage - 1))}
          disabled={currentPage === 0}
        >
          &lt;
        </button>

        {pages.map((page) => (
          <button
            className="pageNumber"
            key={page}
            onClick={() => onPageChange(page)}
            style={{ fontWeight: currentPage === page ? "bold" : "normal" }}
          >
            {page + 1}
          </button>
        ))}

        <button
          className="pageNumber next-button"
          onClick={() => onPageChange(Math.min(totalPages - 1, currentPage + 1))}
          disabled={currentPage === totalPages - 1}
        >
          &gt;
        </button>
      </div>
    );
  };

  // Xử lý cập nhật sản phẩm
  const handleUpdate = (productId) => {
    const selectedProduct = products.find((product) => product._id === productId);
    if (selectedProduct) {
      const { productName, productSize, productImage, productCategory, productDescription, productPrice } = selectedProduct;
      navigate("/admin/update-product", {
        state: { productId, productName, productSize, productImage, productDescription, productCategory, productPrice },
      });
    } else {
      alert("Product not found!");
    }
  };

  // Xử lý xóa sản phẩm
  const handleDelete = async (productId) => {
    const confirmDelete = window.confirm("Bạn có chắc chắn muốn xóa sản phẩm này không?");

    if (confirmDelete) {
      try {
        // Gọi API để xóa sản phẩm
        const response = await productService.deleteProduct(productId, accessToken);
        if (response.status === "OK") {
          alert("Đã xóa sản phẩm thành công!");
          // Cập nhật lại danh sách sản phẩm
          if (currentCategory) {
            fetchProductsByCategory(currentCategory);
          } else {
            fetchAllProducts();
          }
        }
      } catch (error) {
        console.error("Lỗi khi xóa sản phẩm:", error);
        alert("Không thể xóa sản phẩm. Vui lòng thử lại!");
      }
    }
  };

  return (
    <div className="container-xl productadmin-container">
      <div className="productadmin">
        {/* productadmin top */}
        <div className="product__top">
          <h1 className="product__title">SẢN PHẨM</h1>
          {/* Hiển thị tên category nếu có */}
          <p className="product__current-category">
            {currentCategoryName}
          </p>
        </div>

        <div className="add-btn-container" style={{ marginLeft: "auto", display: "flex", justifyContent: "flex-end", marginBottom: "20px" }}>
          <AddBtn path={"/admin/add-product"} text="Thêm sản phẩm" />
        </div>

        {/* productadmin bot */}
        <div className="productadmin__bot">
          {/* side menu */}
          <div className="side-menu__category">
            <div className="side-menu__header">
              <span className="side-menu__icon">
                <i className="fas fa-th-list"></i>
              </span>
              <h3 className="side-menu__title">Danh mục sản phẩm</h3>
            </div>

            <div className="side-menu__divider"></div>

            <div className="side-menu__items">
              {/* Tất cả sản phẩm */}
              <SideMenuItem
                key="all-products"
                value={null}
                onClick={() => handleAllProductsClick()}
                isActive={currentCategory === null}
                icon={<i className="fas fa-tags"></i>}
              >
                Tất cả sản phẩm
                {currentCategory === null && <span className="badge">{productsCount}</span>}
              </SideMenuItem>

              {/* Category items */}
              {Array.isArray(categories) && categories.length > 0 ? (
                categories.map((category) => {
                  const productCount = products.filter(p => p.productCategory === category._id).length;
                  return (
                    <SideMenuItem
                      key={category._id}
                      value={category._id}
                      onClick={(catId) => {
                        handleCategoryClick(catId, category.categoryName);
                      }}
                      isActive={currentCategory === category._id}
                      icon={<i className="fas fa-bookmark"></i>}
                    >
                      {category.categoryName}
                      {currentCategory === category._id && <span className="badge">{productCount}</span>}
                    </SideMenuItem>
                  );
                })
              ) : (
                <div className="no-categories">
                  <i className="fas fa-exclamation-circle"></i>
                  <p>Không có loại sản phẩm</p>
                </div>
              )}
            </div>
          </div>

          {/* productadmin list */}
          <div className="container productadmin__list">
            {isLoading ? (
              <div className="loading-container" style={{ gridColumn: "1 / -1", textAlign: "center", padding: "50px 0" }}>
                <p>Đang tải sản phẩm...</p>
              </div>
            ) : displayedProducts.length > 0 ? (
              displayedProducts.map((product) => {
                const imageUrl = product.productImage.startsWith("http")
                  ? product.productImage
                  : `https://res.cloudinary.com/dlyl41lgq/image/upload/v2/${product.productImage.replace("\\", "/")}`;

                return (
                  <CardProductAdmin
                    key={product._id}
                    className="productadmin__item"
                    type={"primary"}
                    img={imageUrl}
                    title={product.productName}
                    price={`${product.productPrice.toLocaleString('en-US')} VND`}
                    onUpdate={() => handleUpdate(product._id)}
                    onDelete={() => handleDelete(product._id)}
                    productId={product._id}
                  />
                );
              })
            ) : (
              <div className="no-products" style={{ gridColumn: "1 / -1", textAlign: "center", padding: "30px 0" }}>
                <p>Không có sản phẩm nào</p>
              </div>
            )}
          </div>
        </div>

         {/* Pagination */}
         <div className="PageNumberHolder">
           <Pagination
             currentPage={currentPage}
             totalPages={totalPages}
             onPageChange={handlePageChange}
           />
         </div>
      </div>
    </div>
  );
};

export default ProductPageAdmin;
