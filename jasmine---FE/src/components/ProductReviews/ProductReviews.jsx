import React, { useState, useEffect } from "react";
import "./ProductReviews.css";
import ReviewSummary from "../ReviewSummary/ReviewSummary";
import ReviewForm from "../ReviewForm/ReviewForm";
import ReviewList from "../ReviewList/ReviewList";
import { getReviewsByProduct, createReview, toggleReviewVisibility, deleteReview } from "../../services/ReviewService";
import { useSelector } from "react-redux";

const ProductReviews = ({ productId }) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [averageRating, setAverageRating] = useState(0);
  const [reviewCount, setReviewCount] = useState(0);
  const [isAdmin, setIsAdmin] = useState(false);
  const [needsAuth, setNeedsAuth] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const user = useSelector((state) => state.user);
  const isLoggedIn = user && user.id;

  // Fetch reviews when component mounts or productId changes
  useEffect(() => {
    if (!productId) {
      console.error("ProductId is missing or undefined");
      setError("Không thể tải đánh giá: Thiếu thông tin sản phẩm");
      setLoading(false);
      return;
    }

    console.log("ProductReviews received productId:", productId);
    fetchReviews();
  }, [productId, isLoggedIn]); // Thêm isLoggedIn để reload khi đăng nhập

  // Tạo hàm fetchReviews riêng để có thể gọi lại khi cần
  const fetchReviews = async () => {
    setLoading(true);
    try {
      console.log("Fetching reviews for productId:", productId);
      const response = await getReviewsByProduct(productId);
      console.log("Review response:", response);

      if (response.status === "OK") {
        setReviews(response.data);
        setNeedsAuth(false);

        // Calculate average rating
        if (response.data.length > 0) {
          const totalRating = response.data.reduce((sum, review) => sum + review.rating, 0);
          setAverageRating(totalRating / response.data.length);
          setReviewCount(response.data.length);
        } else {
          setAverageRating(0);
          setReviewCount(0);
        }
      } else if (response.message === "Access token is missing") {
        // Xử lý trường hợp cần đăng nhập
        console.log("Authentication required for reviews");
        setNeedsAuth(true);
        setError("Vui lòng đăng nhập để xem đánh giá");
      } else {
        setError("Không thể tải đánh giá sản phẩm");
      }
    } catch (error) {
      console.error("Error fetching reviews:", error);
      if (error.message?.includes("token") || error.response?.data?.message?.includes("token")) {
        setNeedsAuth(true);
        setError("Vui lòng đăng nhập để xem đánh giá");
      } else {
        setError("Đã xảy ra lỗi khi tải đánh giá sản phẩm");
      }
    } finally {
      setLoading(false);
    }
  };

  // Check if user is admin
  useEffect(() => {
    if (user && user.isAdmin) {
      setIsAdmin(true);
    } else {
      setIsAdmin(false);
    }
  }, [user]);

  // Handle review submission
  const handleSubmitReview = async (reviewData) => {
    try {
      if (!isLoggedIn) {
        return { status: "ERR", message: "Vui lòng đăng nhập để gửi đánh giá" };
      }

      // Đảm bảo có đủ thông tin user
      if (!user || !user.id) {
        console.error("User information is missing");
        return { status: "ERR", message: "Thông tin người dùng không đầy đủ, vui lòng đăng nhập lại" };
      }

      // Thêm console.log để kiểm tra dữ liệu user
      console.log("Current user info:", {
        id: user.id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin
      });

      // Đảm bảo gửi đầy đủ thông tin cần thiết
      const data = {
        ...reviewData,
        userId: user.id,
        username: user.familyName || user.userName || user.userEmail || "Anonymous User",
      };

      console.log("Submitting review with data:", data);

      // Hiển thị loading state
      setIsSubmitting(true);

      const response = await createReview(data);
      console.log("Review creation response:", response);

      // Ẩn loading state
      setIsSubmitting(false);

      // Xử lý phản hồi
      if (response && response.status === "OK") {
        // Refresh reviews list
        await fetchReviews();
        return response;
      } else if (response && response.status === "ERR") {
        if (response.message && (
          response.message.includes("đăng nhập lại") ||
          response.message.includes("không có quyền") ||
          response.message.includes("phiên") ||
          response.message.includes("token") ||
          response.message.includes("authorized")
        )) {
          // Xử lý lỗi xác thực
          console.error("Authentication error:", response.message);
          setNeedsAuth(true);
          setError(response.message);
        }
        return response;
      } else {
        // Trường hợp không có phản hồi hoặc phản hồi không đúng định dạng
        console.error("Unexpected response format:", response);
        return {
          status: "ERR",
          message: "Phản hồi từ máy chủ không hợp lệ"
        };
      }
    } catch (error) {
      console.error("Error submitting review:", error);

      // Ẩn loading state
      setIsSubmitting(false);

      // Kiểm tra lỗi xác thực
      if (
        error.message?.includes("token") ||
        error.response?.status === 403 ||
        error.response?.status === 401
      ) {
        setNeedsAuth(true);
        setError("Phiên đăng nhập của bạn đã hết hạn. Vui lòng đăng nhập lại.");
        return {
          status: "ERR",
          message: "Phiên đăng nhập của bạn đã hết hạn. Vui lòng đăng nhập lại."
        };
      }

      return {
        status: "ERR",
        message: "Đã xảy ra lỗi khi gửi đánh giá"
      };
    }
  };

  // Handle toggling review visibility (admin)
  const handleToggleVisibility = async (reviewId) => {
    try {
      if (!isAdmin) return;

      const response = await toggleReviewVisibility(reviewId);

      if (response.status === "OK") {
        // Update reviews list
        const updatedReviews = await getReviewsByProduct(productId);
        if (updatedReviews.status === "OK") {
          setReviews(updatedReviews.data);

          // Recalculate average if necessary
          if (updatedReviews.data.length > 0) {
            const totalRating = updatedReviews.data.reduce((sum, review) => sum + review.rating, 0);
            setAverageRating(totalRating / updatedReviews.data.length);
            setReviewCount(updatedReviews.data.length);
          } else {
            setAverageRating(0);
            setReviewCount(0);
          }
        }
      }
    } catch (error) {
      console.error("Error toggling review visibility:", error);
    }
  };

  // Handle deleting a review (admin)
  const handleDeleteReview = async (reviewId) => {
    try {
      if (!isAdmin) return;

      if (window.confirm("Bạn có chắc chắn muốn xóa đánh giá này không?")) {
        const response = await deleteReview(reviewId);

        if (response.status === "OK") {
          // Update reviews list
          const updatedReviews = await getReviewsByProduct(productId);
          if (updatedReviews.status === "OK") {
            setReviews(updatedReviews.data);

            // Recalculate average
            if (updatedReviews.data.length > 0) {
              const totalRating = updatedReviews.data.reduce((sum, review) => sum + review.rating, 0);
              setAverageRating(totalRating / updatedReviews.data.length);
              setReviewCount(updatedReviews.data.length);
            } else {
              setAverageRating(0);
              setReviewCount(0);
            }
          }
        }
      }
    } catch (error) {
      console.error("Error deleting review:", error);
    }
  };

  if (loading) {
    return (
      <div className="product-reviews-container">
        <div className="reviews-loading">
          <i className="fas fa-spinner fa-spin"></i>
          <p>Đang tải đánh giá...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="product-reviews-container">
        <div className="reviews-error">
          <i className="fas fa-exclamation-circle"></i>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="product-reviews-container" id="product-reviews">
      <h2 className="reviews-section-title">Đánh giá từ khách hàng</h2>

      {/* Reviews Summary */}
      <ReviewSummary averageRating={averageRating} reviewCount={reviewCount} />

      {/* Review List */}
      <ReviewList
        reviews={reviews}
        isAdmin={isAdmin}
        onToggleVisibility={handleToggleVisibility}
        onDeleteReview={handleDeleteReview}
      />

      {/* New Review Form */}
      <ReviewForm
        onSubmit={handleSubmitReview}
        isLoggedIn={isLoggedIn}
        productId={productId}
      />
    </div>
  );
};

export default ProductReviews;