import React from "react";
import "./ReviewSummary.css";
import StarRating from "../StarRating/StarRating";

const ReviewSummary = ({ averageRating, reviewCount }) => {
  // Generate rating label based on average rating
  const getRatingLabel = (rating) => {
    if (rating >= 4.5) return "Tuyệt vời";
    if (rating >= 4) return "Rất tốt";
    if (rating >= 3.5) return "Tốt";
    if (rating >= 3) return "Khá";
    if (rating >= 2) return "Trung bình";
    if (rating >= 1) return "Kém";
    return "Chưa có đánh giá";
  };

  return (
    <div className="review-summary">
      <div className="review-summary-rating">
        <div className="average-rating">
          <span className="rating-number">{averageRating.toFixed(1)}</span>
          <span className="rating-max">/5</span>
        </div>
        <div className="rating-details">
          <StarRating rating={averageRating} readOnly={true} size="medium" />
          <span className="rating-label">{getRatingLabel(averageRating)}</span>
          <span className="review-count">
            ({reviewCount} {reviewCount === 1 ? "đánh giá" : "đánh giá"})
          </span>
        </div>
      </div>
    </div>
  );
};

export default ReviewSummary;