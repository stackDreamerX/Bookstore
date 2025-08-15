import { React, useEffect, useState } from "react";
import "./ProductsPage.css";
import SideMenuItem from "../../../components/SideMenuItem/SideMenuItem";
import CardProduct from "../../../components/CardProduct/CardProduct";
import ButtonComponent from "../../../components/ButtonComponent/ButtonComponent";
import { useNavigate, useLocation } from "react-router-dom";
import { getAllproduct, getProductsByCategory } from "../../../services/productServices";
import { getAllCategory } from "../../../services/CategoryService";
import { getAllDiscount, getDiscountsByCategory } from "../../../services/DiscountService";

const ProductsPage = () => {
  const [products, setProducts] = useState([]); // State lưu danh sách sản phẩm
  const [displayedProducts, setDisplayedProducts] = useState([]); // State lưu danh sách sản phẩm đã sắp xếp để hiển thị
  const [categories, setCategories] = useState([]); // State lưu danh sách category
  const [currentCategory, setCurrentCategory] = useState(null); // State lưu category hiện tại
  const [currentCategoryName, setCurrentCategoryName] = useState("Tất cả sản phẩm"); // State lưu tên category hiện tại
  const [currentPage, setCurrentPage] = useState(0); // Trang hiện tại
  const [totalPages, setTotalPages] = useState(0); // Tổng số trang
  const [error, setError] = useState(""); // State lưu lỗi
  const [loading, setLoading] = useState(true); // Loading state
  const [productsCount, setProductsCount] = useState(0); // Số lượng sản phẩm
  const [sortOption, setSortOption] = useState("default"); // Lựa chọn sắp xếp
  const [priceFilter, setPriceFilter] = useState(null); // State lưu bộ lọc giá
  const [discounts, setDiscounts] = useState([]); // State lưu danh sách khuyến mãi
  const ITEMS_PER_PAGE = 9; // Số sản phẩm trên mỗi trang

  const navigate = useNavigate();
  const location = useLocation();

  const previousCategoryId = location.state?.categoryIds || null;

  //=========Danh mục sản phẩm=======
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getAllCategory();
        setCategories(data.data); // Lưu danh sách category vào state
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, []);

  // Lấy danh sách khuyến mãi
  useEffect(() => {
    const fetchDiscounts = async () => {
      try {
        const data = await getAllDiscount();
        if (Array.isArray(data.data)) {
          // Lọc chỉ lấy các khuyến mãi đang hoạt động
          const activeDiscounts = data.data.filter(discount => {
            const now = new Date();
            const startDate = new Date(discount.discountStartDate);
            const endDate = new Date(discount.discountEndDate);
            return now >= startDate && now <= endDate;
          });
          setDiscounts(activeDiscounts);
        }
      } catch (error) {
        console.error("Error fetching discounts:", error);
      }
    };
    fetchDiscounts();
  }, []);

  // Tính giá sau khi áp dụng khuyến mãi
  const calculateDiscountedPrice = (product) => {
    if (!discounts || discounts.length === 0) return undefined;

    // Debug: Log thông tin sản phẩm và loại sản phẩm
    console.log(`Product: ${product.productName}, Category ID: ${product.productCategory}`);

    // Log danh sách khuyến mãi để kiểm tra
    console.log('Available discounts:', discounts.map(d => ({
      code: d.discountCode,
      name: d.discountName,
      value: d.discountValue,
      category: d.applicableCategory || d.aplicableCategory || 'None'
    })));

    // Lọc các khuyến mãi áp dụng cho sản phẩm này
    const applicableDiscounts = discounts.filter(discount => {
      // Ưu tiên sử dụng applicableCategory, nếu không có thì dùng aplicableCategory
      const categoryField = discount.applicableCategory || discount.aplicableCategory;

      // Log chi tiết để debug
      console.log(`Discount: ${discount.discountName}`);
      console.log(`- Discount category (raw): applicableCategory=${discount.applicableCategory}, aplicableCategory=${discount.aplicableCategory}`);
      console.log(`- Discount category (used): ${categoryField}`);
      console.log(`- Product category: ${product.productCategory}`);
      console.log(`- Match: ${categoryField === product.productCategory}`);

      // Nếu discount áp dụng cho loại sản phẩm cụ thể, kiểm tra nếu loại sản phẩm khớp
      if (categoryField) {
        return categoryField === product.productCategory;
      }
      // Không áp dụng discount không có loại sản phẩm cụ thể
      return false;
    });

    // Log các khuyến mãi áp dụng được
    console.log(`Applicable discounts for ${product.productName}:`,
      applicableDiscounts.map(d => d.discountCode));

    if (applicableDiscounts.length === 0) return undefined;

    // Chuyển đổi giá sản phẩm từ string sang number nếu cần
    const originalPrice = typeof product.productPrice === 'string'
      ? parseInt(product.productPrice.replace(/,/g, ''))
      : product.productPrice;

    // Tính tổng giảm giá từ tất cả các khuyến mãi
    let totalDiscount = 0;
    applicableDiscounts.forEach(discount => {
      const discountValue = parseInt(discount.discountValue);
      console.log(`Applying discount ${discount.discountCode} (${discount.discountName}): ${discountValue}`);
      totalDiscount += discountValue;
    });

    // Giá sau khi giảm (không cho phép giá âm)
    const discountedPrice = Math.max(0, originalPrice - totalDiscount);
    console.log(`Original price: ${originalPrice}, Total discount: ${totalDiscount}, Discounted price: ${discountedPrice}`);

    return discountedPrice;
  };

  // Fetch danh sách sản phẩm theo category
  const fetchProductsByCategory = async (categoryId = null) => {
    setLoading(true);
    try {
      const data = await getProductsByCategory(categoryId);
      setProductsCount(data.data.length);
      setTotalPages(Math.ceil(data.data.length / ITEMS_PER_PAGE));

      if (Array.isArray(data.data)) {
        // Thêm thông tin giá khuyến mãi vào mỗi sản phẩm
        const productsWithDiscount = data.data.map(product => {
          const discountedPrice = calculateDiscountedPrice(product);
          return {
            ...product,
            discountedPrice
          };
        });

        setProducts(productsWithDiscount);
        sortAndPaginateProducts(productsWithDiscount, sortOption, currentPage);
      } else {
        console.error("Products data is not in expected format");
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      setError("Không thể tải sản phẩm. Vui lòng thử lại sau.");
    } finally {
      setLoading(false);
    }
  };

  // fetch danh sach san pham
  const fetchAllProducts = async () => {
    setLoading(true);
    try {
      const data = await getAllproduct();
      setProductsCount(data.data.length);
      setTotalPages(Math.ceil(data.data.length / ITEMS_PER_PAGE));

      if (Array.isArray(data.data)) {
        // Thêm thông tin giá khuyến mãi vào mỗi sản phẩm
        const productsWithDiscount = data.data.map(product => {
          const discountedPrice = calculateDiscountedPrice(product);
          return {
            ...product,
            discountedPrice
          };
        });

        setProducts(productsWithDiscount);
        sortAndPaginateProducts(productsWithDiscount, sortOption, currentPage);
      } else {
        console.error("Products data is not in expected format");
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      setError("Không thể tải sản phẩm. Vui lòng thử lại sau.");
    } finally {
      setLoading(false);
    }
  };

  // Khi component được mount
  useEffect(() => {
    if (previousCategoryId) {
      setCurrentCategory(previousCategoryId);
      const selectedCategory = categories.find(cat => cat._id === previousCategoryId);
      setCurrentCategoryName(selectedCategory?.categoryName || "Tất cả sản phẩm");
      setCurrentPage(0);
      fetchProductsByCategory(previousCategoryId);
    } else {
      setCurrentCategoryName("Tất cả sản phẩm");
      fetchAllProducts();
    }
  }, [previousCategoryId, categories, discounts]);

  // Reload sản phẩm khi có thay đổi về khuyến mãi
  useEffect(() => {
    if (products.length > 0) {
      // Cập nhật thông tin giá khuyến mãi cho sản phẩm
      const productsWithDiscount = products.map(product => {
        const discountedPrice = calculateDiscountedPrice(product);
        return {
          ...product,
          discountedPrice
        };
      });

      setProducts(productsWithDiscount);
      sortAndPaginateProducts(productsWithDiscount, sortOption, currentPage);
    }
  }, [discounts]);

  // Hàm sắp xếp và phân trang sản phẩm
  const sortAndPaginateProducts = (productsToSort, option, page) => {
    let sorted = [...productsToSort];

    // Lọc theo giá
    if (priceFilter) {
      switch (priceFilter) {
        case "under-100k":
          sorted = sorted.filter(product => {
            // Sử dụng giá khuyến mãi nếu có, nếu không thì dùng giá gốc
            const price = product.discountedPrice !== undefined
              ? product.discountedPrice
              : (typeof product.productPrice === 'string'
                  ? parseInt(product.productPrice.replace(/,/g, ''))
                  : product.productPrice);
            return price < 100000;
          });
          break;
        case "100k-200k":
          sorted = sorted.filter(product => {
            const price = product.discountedPrice !== undefined
              ? product.discountedPrice
              : (typeof product.productPrice === 'string'
                  ? parseInt(product.productPrice.replace(/,/g, ''))
                  : product.productPrice);
            return price >= 100000 && price <= 200000;
          });
          break;
        case "under-500k":
          sorted = sorted.filter(product => {
            const price = product.discountedPrice !== undefined
              ? product.discountedPrice
              : (typeof product.productPrice === 'string'
                  ? parseInt(product.productPrice.replace(/,/g, ''))
                  : product.productPrice);
            return price < 500000;
          });
          break;
        case "over-500k":
          sorted = sorted.filter(product => {
            const price = product.discountedPrice !== undefined
              ? product.discountedPrice
              : (typeof product.productPrice === 'string'
                  ? parseInt(product.productPrice.replace(/,/g, ''))
                  : product.productPrice);
            return price >= 500000;
          });
          break;
        default:
          break;
      }
    }

    // Sắp xếp sản phẩm
    switch (option) {
      case "price-asc":
        sorted.sort((a, b) => {
          const priceA = a.discountedPrice !== undefined
            ? a.discountedPrice
            : (typeof a.productPrice === 'string'
                ? parseInt(a.productPrice.replace(/,/g, ''))
                : a.productPrice);
          const priceB = b.discountedPrice !== undefined
            ? b.discountedPrice
            : (typeof b.productPrice === 'string'
                ? parseInt(b.productPrice.replace(/,/g, ''))
                : b.productPrice);
          return priceA - priceB;
        });
        break;
      case "price-desc":
        sorted.sort((a, b) => {
          const priceA = a.discountedPrice !== undefined
            ? a.discountedPrice
            : (typeof a.productPrice === 'string'
                ? parseInt(a.productPrice.replace(/,/g, ''))
                : a.productPrice);
          const priceB = b.discountedPrice !== undefined
            ? b.discountedPrice
            : (typeof b.productPrice === 'string'
                ? parseInt(b.productPrice.replace(/,/g, ''))
                : b.productPrice);
          return priceB - priceA;
        });
        break;
      case "name-asc":
        sorted.sort((a, b) => a.productName.localeCompare(b.productName));
        break;
      case "name-desc":
        sorted.sort((a, b) => b.productName.localeCompare(a.productName));
        break;
      default:
        // Trường hợp default không sắp xếp
        break;
    }

    // Phân trang: lấy 9 sản phẩm cho trang hiện tại
    const startIndex = page * ITEMS_PER_PAGE;
    const paginatedProducts = sorted.slice(startIndex, startIndex + ITEMS_PER_PAGE);

    setDisplayedProducts(paginatedProducts);
  };

  // Handler cho sự kiện thay đổi tùy chọn sắp xếp
  const handleSortChange = (e) => {
    const option = e.target.value;
    setSortOption(option);
    sortAndPaginateProducts(products, option, currentPage);
  };

  // Handler cho sự kiện thay đổi bộ lọc giá
  const handlePriceFilterChange = (filter) => {
    setPriceFilter(filter);
    setCurrentPage(0);
    sortAndPaginateProducts(products, sortOption, 0);
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

  // Xử lý khi thay đổi trang
  const handlePageChange = (page) => {
    setCurrentPage(page);
    sortAndPaginateProducts(products, sortOption, page);
  };

  // Reload sản phẩm khi chuyển category
  useEffect(() => {
    if (currentCategory) {
      fetchProductsByCategory(currentCategory);
    } else {
      fetchAllProducts();
    }
  }, [currentCategory]);

  // Khi nhấn vào category
  const handleCategoryClick = (categoryId, categoryName) => {
    setCurrentCategory(categoryId);
    setCurrentCategoryName(categoryName);
    setCurrentPage(0);
  };

  // Khi nhấn vào Tất cả sản phẩm
  const handleAllProductsClick = () => {
    setCurrentCategory(null);
    setCurrentCategoryName("Tất cả sản phẩm");
    setCurrentPage(0);
  };

  // Khi nhấn vào sản phẩm
  const handleDetail = (productId) => {
    const selectedProduct = products.find(
      (product) => product._id === productId
    );

    if (selectedProduct) {
      const {
        _id,
        productName,
        productSize,
        productImage,
        productCategory,
        productDescription,
        productPrice,
        discountedPrice,
      } = selectedProduct;
      navigate("/view-product-detail", {
        state: {
          productId: _id,
          productName,
          productSize,
          productImage,
          productDescription,
          productCategory,
          productPrice,
          discountedPrice,
        },
      });
    } else {
      alert("Product not found!");
    }
  };

  return (
    <div className="products-page-wrapper">
      <div className="container-xl product-container">
        <div className="product">
          {/* product top */}
          <div className="product__top">
            <div className="product-icon">
              <i className="fas fa-book"></i>
            </div>
            <h1 className="product__title">SẢN PHẨM</h1>
            <p className="product__current-category">{currentCategoryName}</p>
          </div>

          {/* product bot */}
          <div className="product__bot">
            {/* side menu */}
            <div className="side-menu__category">
              <div className="side-menu__header">
                <span className="side-menu__icon">
                  <i className="fas fa-th-list"></i>
                </span>
                <h3 className="side-menu__title">Danh mục</h3>
              </div>

              <div className="side-menu__divider"></div>

              <div className="side-menu__items">
                <SideMenuItem
                  key="all-products"
                  value={null}
                  onClick={handleAllProductsClick}
                  isActive={currentCategory === null}
                  icon={<i className="fas fa-tags"></i>}
                >
                  Tất cả sản phẩm
                  {currentCategory === null && <span className="badge">{productsCount}</span>}
                </SideMenuItem>

                {Array.isArray(categories) && categories.length > 0 ? (
                  categories.map((category) => {
                    const categoryProductCount = products.filter(p => p.productCategory === category._id).length;
                    return (
                      <SideMenuItem
                        key={category._id}
                        value={category._id}
                        onClick={() =>
                          handleCategoryClick(category._id, category.categoryName)
                        }
                        isActive={currentCategory === category._id}
                        icon={<i className="fas fa-bookmark"></i>}
                      >
                        {category.categoryName}
                        {currentCategory === category._id && <span className="badge">{categoryProductCount}</span>}
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

              {/* Price Filter Section */}
              <div className="side-menu__header price-filter-header">
                <span className="side-menu__icon">
                  <i className="fas fa-filter"></i>
                </span>
                <h3 className="side-menu__title">Lọc theo giá</h3>
              </div>

              <div className="side-menu__divider"></div>

              <div className="side-menu__items price-filter-items">
                <SideMenuItem
                  key="under-100k"
                  value="under-100k"
                  onClick={() => handlePriceFilterChange("under-100k")}
                  isActive={priceFilter === "under-100k"}
                  icon={<i className="fas fa-tag"></i>}
                >
                  Dưới 100.000đ
                </SideMenuItem>
                <SideMenuItem
                  key="100k-200k"
                  value="100k-200k"
                  onClick={() => handlePriceFilterChange("100k-200k")}
                  isActive={priceFilter === "100k-200k"}
                  icon={<i className="fas fa-tag"></i>}
                >
                  100.000đ - 200.000đ
                </SideMenuItem>
                <SideMenuItem
                  key="under-500k"
                  value="under-500k"
                  onClick={() => handlePriceFilterChange("under-500k")}
                  isActive={priceFilter === "under-500k"}
                  icon={<i className="fas fa-tag"></i>}
                >
                  Dưới 500.000đ
                </SideMenuItem>
                <SideMenuItem
                  key="over-500k"
                  value="over-500k"
                  onClick={() => handlePriceFilterChange("over-500k")}
                  isActive={priceFilter === "over-500k"}
                  icon={<i className="fas fa-tag"></i>}
                >
                  Trên 500.000đ
                </SideMenuItem>
                <SideMenuItem
                  key="clear-price-filter"
                  value={null}
                  onClick={() => handlePriceFilterChange(null)}
                  isActive={priceFilter === null}
                  icon={<i className="fas fa-times"></i>}
                >
                  Xóa bộ lọc giá
                </SideMenuItem>
              </div>
            </div>

            {/* product list */}
            <div className="product__list-container">
              <div className="product-result-header">
                <div className="product-count">
                  {!loading && (
                    <span className="result-text">
                      Tìm thấy <strong>{productsCount}</strong> sản phẩm
                    </span>
                  )}
                </div>
                <div className="product-sort">
                  <label htmlFor="sort-select">Sắp xếp theo:</label>
                  <select
                    id="sort-select"
                    className="sort-select"
                    value={sortOption}
                    onChange={handleSortChange}
                  >
                    <option value="default">Mặc định</option>
                    <option value="price-asc">Giá: Thấp đến cao</option>
                    <option value="price-desc">Giá: Cao đến thấp</option>
                    <option value="name-asc">Tên: A-Z</option>
                    <option value="name-desc">Tên: Z-A</option>
                  </select>
                </div>
              </div>

              {error && <div className="error-message">{error}</div>}

              {loading ? (
                <div className="loading-container">
                  <div className="loading-spinner"></div>
                  <p>Đang tải sản phẩm...</p>
                </div>
              ) : (
                <div className="container product__list">
                  {displayedProducts.length > 0 ? (
                    displayedProducts.map((product) => {
                      const imageUrl = product.productImage.startsWith("http")
                        ? product.productImage
                        : `https://res.cloudinary.com/dlyl41lgq/image/upload/v2/${product.productImage.replace(
                            "\\",
                            "/"
                          )}`;

                      // Chuyển đổi giá sản phẩm từ string sang number nếu cần
                      const price = typeof product.productPrice === 'string'
                        ? parseInt(product.productPrice.replace(/,/g, ''))
                        : product.productPrice;

                      return (
                        <CardProduct
                          key={product._id}
                          className="col productadmin__item"
                          type={"primary"}
                          img={imageUrl}
                          title={product.productName}
                          price={price}
                          discountedPrice={product.discountedPrice}
                          id={product._id}
                          onClick={() => handleDetail(product._id)}
                        />
                      );
                    })
                  ) : (
                    <div className="no-products-message">
                      <span className="no-products-icon">
                        <i className="fas fa-exclamation-circle"></i>
                      </span>
                      <p>Không có sản phẩm nào</p>
                      <ButtonComponent
                        onClick={handleAllProductsClick}
                        type="primary"
                        className="return-button"
                      >
                        Xem tất cả sản phẩm
                      </ButtonComponent>
                    </div>
                  )}
                </div>
              )}

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
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;
