import React from "react";

const BackIconComponent = ({ onClick }) => {
  return (
    <div>
      <svg
        className="back_icon"
        xmlns="http://www.w3.org/2000/svg"
        width="40"
        height="40"
        viewBox="0 0 40 40"
        fill="none"
        color="#3a060e"
        onClick={onClick}
        cursor={"pointer"}
      >
        <path
          d="M6.66675 20L5.95964 19.2929L5.25253 20L5.95964 20.7071L6.66675 20ZM31.6667 21C32.219 21 32.6667 20.5523 32.6667 20C32.6667 19.4477 32.219 19 31.6667 19V21ZM15.9596 9.29289L5.95964 19.2929L7.37385 20.7071L17.3739 10.7071L15.9596 9.29289ZM5.95964 20.7071L15.9596 30.7071L17.3739 29.2929L7.37385 19.2929L5.95964 20.7071ZM6.66675 21H31.6667V19H6.66675V21Z"
          fill="#33363F"
        />
      </svg>
    </div>
  );
};

export default BackIconComponent;
