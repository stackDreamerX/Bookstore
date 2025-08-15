import React from "react";
import "./StarRating.css";

// StarRating component can be used in both read-only and interactive modes
const StarRating = ({
  rating,
  setRating = null,
  size = "medium",
  readOnly = false,
  showLabel = false
}) => {
  // Define star sizes based on the size prop
  const starSizes = {
    small: "star-small",
    medium: "star-medium",
    large: "star-large"
  };

  // Handle mouse enter event for interactive rating
  const handleMouseEnter = (index) => {
    if (readOnly || !setRating) return;
    setRating(index);
  };

  // Handle click event for setting the rating
  const handleClick = (index) => {
    if (readOnly || !setRating) return;
    setRating(index);
  };

  // Generate label text based on the rating
  const getLabelText = (rating) => {
    if (rating >= 5) return "Tuyệt vời";
    if (rating >= 4) return "Rất tốt";
    if (rating >= 3) return "Tốt";
    if (rating >= 2) return "Trung bình";
    if (rating >= 1) return "Kém";
    return "";
  };

  return (
    <div className="star-rating-container">
      <div className={`star-rating ${readOnly ? 'read-only' : 'interactive'}`}>
        {[1, 2, 3, 4, 5].map((index) => (
          <span
            key={index}
            className={`star ${starSizes[size]} ${index <= rating ? 'filled' : ''}`}
            onMouseEnter={() => handleMouseEnter(index)}
            onClick={() => handleClick(index)}
          >
            ★
          </span>
        ))}
      </div>

      {showLabel && rating > 0 && (
        <span className="rating-label">{getLabelText(rating)}</span>
      )}
    </div>
  );
};

export default StarRating;