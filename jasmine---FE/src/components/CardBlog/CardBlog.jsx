import React from 'react';
import './CardBlog.css';
import { FaEye, FaCalendarAlt, FaUser } from 'react-icons/fa';

const CardBlog = ({ img, title, content, author, date, viewCount, onClick }) => {
  // Truncate content to prevent displaying too much text
  const truncateContent = (text, maxLength = 100) => {
    if (!text) return '';

    // Create a temporary div to parse HTML content
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = text;

    // Get text content without HTML tags
    const textContent = tempDiv.textContent || tempDiv.innerText;

    if (textContent.length > maxLength) {
      return textContent.substr(0, maxLength) + '...';
    }
    return textContent;
  };

  return (
    <div className="card-blog" onClick={onClick}>
      <div className="card-blog-image">
        <img src={img} alt={title} />
      </div>
      <div className="card-blog-content">
        <h3 className="card-blog-title">{title}</h3>
        <div className="card-blog-meta">
          <span className="card-blog-author">
            <FaUser /> {author}
          </span>
          <span className="card-blog-date">
            <FaCalendarAlt /> {date}
          </span>
          <span className="card-blog-views">
            <FaEye /> {viewCount}
          </span>
        </div>
        <p className="card-blog-text">{truncateContent(content)}</p>
        <div className="card-blog-button">
          Đọc tiếp
        </div>
      </div>
    </div>
  );
};

export default CardBlog;