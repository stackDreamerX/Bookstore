import React, { useEffect, useState } from "react";
import "./Message.css";

const Message = ({ type, message, duration = 3000, onClose }) => {
  const [isVisible, setIsVisible] = useState(true);
  const [isFading, setIsFading] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsFading(true);
      setTimeout(() => {
        setIsVisible(false);
        if (onClose) onClose();
      }, 500); // Thời gian cho hiệu ứng mờ dần
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  if (!isVisible) return null;

  const getMessageClass = () => {
    switch (type) {
      case "Success":
        return "message success";
      case "Error":
        return "message error";
      case "Warning":
        return "message warning";
      default:
        return "message";
    }
  };

  return (
    <div className={`alert-box ${getMessageClass()} ${isFading ? "fade-out" : ""}`}>
      <span className="message-content">{message}</span>
    </div>
  );
};

export default Message;