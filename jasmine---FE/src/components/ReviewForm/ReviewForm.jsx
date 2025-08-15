import React, { useState } from "react";
import "./ReviewForm.css";
import StarRating from "../StarRating/StarRating";
import "./ReviewForm.css";

const ReviewForm = ({ onSubmit, isLoggedIn, productId }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Validate the form before submission
  const validateForm = () => {
    if (rating === 0) {
      setErrorMessage("Vui lòng chọn số sao đánh giá");
      return false;
    }

    if (!comment.trim()) {
      setErrorMessage("Vui lòng nhập nội dung đánh giá");
      return false;
    }

    if (comment.length < 10) {
      setErrorMessage("Nội dung đánh giá phải có ít nhất 10 ký tự");
      return false;
    }

    setErrorMessage("");
    return true;
  };

  // Reset the form after submission
  const resetForm = () => {
    setRating(0);
    setComment("");
    setIsSubmitting(false);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    // Show login message if not logged in
    if (!isLoggedIn) {
      setErrorMessage("Vui lòng đăng nhập để gửi đánh giá");
      return;
    }

    // Validate form
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Call the onSubmit function passed from parent component
      const result = await onSubmit({
        rating,
        comment,
        productId
      });

      if (result.status === "OK") {
        setSuccessMessage("Đánh giá của bạn đã được gửi thành công!");
        resetForm();

        // Clear success message after 3 seconds
        setTimeout(() => {
          setSuccessMessage("");
        }, 3000);
      } else {
        setErrorMessage(result.message || "Có lỗi xảy ra khi gửi đánh giá");
      }
    } catch (error) {
      console.error("Error submitting review:", error);
      setErrorMessage("Đã xảy ra lỗi. Vui lòng thử lại sau.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="review-form-container">
      <h3 className="review-form-title">Đánh giá sản phẩm</h3>

      {!isLoggedIn ? (
        <div className="login-message">
          <i className="fas fa-lock"></i>
          <p>Vui lòng <a href="/login">đăng nhập</a> để gửi đánh giá</p>
        </div>
      ) : (
        <form className="review-form" onSubmit={handleSubmit} encType="application/x-www-form-urlencoded">
          <div className="rating-field">
            <label>Đánh giá của bạn:</label>
            <StarRating
              rating={rating}
              setRating={setRating}
              size="large"
              showLabel={true}
            />
          </div>

          <div className="comment-field">
            <label htmlFor="review-comment">Nội dung đánh giá:</label>
            <textarea
              id="review-comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Chia sẻ trải nghiệm của bạn về sản phẩm này..."
              rows={4}
              disabled={isSubmitting}
            ></textarea>
          </div>

          {errorMessage && (
            <div className="review-error">
              <i className="fas fa-exclamation-circle"></i>
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="review-success">
              <i className="fas fa-check-circle"></i>
              <span>{successMessage}</span>
            </div>
          )}

          <div className="review-submit">
            <button
              className="review-submit-button"
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Đang gửi..." : "Gửi đánh giá"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default ReviewForm;