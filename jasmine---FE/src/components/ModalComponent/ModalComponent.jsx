import React from "react";
import styles from "./ModalComponent.module.css";
import ButtonComponent from "../ButtonComponent/ButtonComponent";

const ModalComponent = ({ title, content, onClose, onRetry }) => {
  return (
    <div>
      <div className={styles.modalOverlay}>
        <div className={styles.modalContainer}>
          <button className={styles.closeButton} onClick={onClose}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="30"
              height="30"
              viewBox="0 0 30 30"
              fill="none"
            >
              <path
                d="M15 16.75L8.875 22.875C8.64583 23.1042 8.35417 23.2188 8 23.2188C7.64583 23.2188 7.35417 23.1042 7.125 22.875C6.89583 22.6458 6.78125 22.3542 6.78125 22C6.78125 21.6458 6.89583 21.3542 7.125 21.125L13.25 15L7.125 8.875C6.89583 8.64583 6.78125 8.35417 6.78125 8C6.78125 7.64583 6.89583 7.35417 7.125 7.125C7.35417 6.89583 7.64583 6.78125 8 6.78125C8.35417 6.78125 8.64583 6.89583 8.875 7.125L15 13.25L21.125 7.125C21.3542 6.89583 21.6458 6.78125 22 6.78125C22.3542 6.78125 22.6458 6.89583 22.875 7.125C23.1042 7.35417 23.2188 7.64583 23.2188 8C23.2188 8.35417 23.1042 8.64583 22.875 8.875L16.75 15L22.875 21.125C23.1042 21.3542 23.2188 21.6458 23.2188 22C23.2188 22.3542 23.1042 22.6458 22.875 22.875C22.6458 23.1042 22.3542 23.2188 22 23.2188C21.6458 23.2188 21.3542 23.1042 21.125 22.875L15 16.75Z"
                fill="black"
              />
            </svg>
          </button>
          <div className={styles.modalContent}>
            <h2 className={styles.title}>
              {title ||
                "Tiêu đề thông báo aaaa sss ddd ddd fff fffff fff ddddd "}
            </h2>
            <p className={styles.content}>
              {content ||
                "Nội dung thông báo ggggg ggggg gggg ggg gggggg gggggg gggggg ggggggg gggggg gggg"}
            </p>
          </div>
          <div className={styles.buttonGroup}>
            <ButtonComponent className={styles.exitButton} onClick={onClose}>
              Thoát
            </ButtonComponent>
            {onRetry && (
              <ButtonComponent className={styles.retryButton} onClick={onRetry}>
                Thử lại
              </ButtonComponent>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalComponent;
