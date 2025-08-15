import React from "react";

const CheckboxComponent = ({ isChecked, onChange }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      onClick={onChange}
      style={{ cursor: "pointer", transition: "all 0.3s ease" }}
    >
      {/* Vòng tròn hoặc nền */}
      <g filter="url(#filter0_d)">
        <rect
          x="4"
          y="4"
          width="16"
          height="16"
          rx="3"
          fill={isChecked ? "#5a2d0c" : "#D9D9D9"} // Đổi màu khi chọn
          style={{ transition: "fill 0.3s ease" }}
        />
      </g>

      {/* Dấu tích */}
      {isChecked && (
        <path
          d="M7 12l3 3 7-7"
          stroke="white"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{
            transition: "stroke-dasharray 0.3s ease",
            strokeDasharray: "0 24",
            animation: "dash 0.5s forwards",
          }}
        />
      )}

      {/* Animation cho dấu tích */}
      <style>
        {`
          @keyframes dash {
            to {
              stroke-dasharray: 24 0;
            }
          }
        `}
      </style>
    </svg>
  );
};

export default CheckboxComponent;
