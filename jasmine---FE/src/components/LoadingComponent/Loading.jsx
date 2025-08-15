import React from "react";

const Loading = ({ isLoading }) => {
  if (!isLoading) return null; // Không hiển thị gì nếu không đang loading

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.5)", // Màn che mờ
        zIndex: 9999,
      }}
    >
      <div className="spinner-border text-light" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>
  );
};

export default Loading;
