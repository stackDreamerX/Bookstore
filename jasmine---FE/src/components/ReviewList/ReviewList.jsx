import React from "react";
import "./ReviewList.css";
import StarRating from "../StarRating/StarRating";
import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";

const ReviewList = ({ reviews, isAdmin, onToggleVisibility, onDeleteReview }) => {
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

  // No reviews message
  if (!reviews || reviews.length === 0) {
    return (
      <div className="no-reviews">
        <i className="fas fa-comment-slash"></i>
        <p>Chưa có đánh giá nào. Hãy là người đầu tiên đánh giá sản phẩm này!</p>
      </div>
    );
  }

  return (
    <div className="review-list">
      {reviews.map((review) => (
        <div key={review._id} className={`review-item ${!review.isVisible ? 'hidden-review' : ''}`}>
          <div className="review-header">
            <div className="review-user">
              <i className="fas fa-user-circle"></i>
              <span className="review-username">{review.username}</span>
            </div>
            <div className="review-rating">
              <StarRating rating={review.rating} readOnly={true} size="small" />
              <span className="review-date">{formatReviewDate(review.createdAt)}</span>
            </div>
          </div>

          <div className="review-content">
            <p>{review.comment}</p>
          </div>

          {isAdmin && (
            <div className="review-admin-actions">
              <button
                className={`visibility-toggle ${!review.isVisible ? 'show-review' : 'hide-review'}`}
                onClick={() => onToggleVisibility(review._id)}
              >
                {review.isVisible ? (
                  <>
                    <i className="fas fa-eye-slash"></i> Ẩn đánh giá
                  </>
                ) : (
                  <>
                    <i className="fas fa-eye"></i> Hiện đánh giá
                  </>
                )}
              </button>
              <button
                className="delete-review"
                onClick={() => onDeleteReview(review._id)}
              >
                <i className="fas fa-trash"></i> Xóa
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default ReviewList;