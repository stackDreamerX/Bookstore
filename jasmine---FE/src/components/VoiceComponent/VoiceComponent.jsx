import React, { useState } from "react";
import styles from "./VoiceComponent.module.css";

const VoiceComponent = ({ onVoiceInput }) => {
  const [isListening, setIsListening] = useState(false);

  const handleVoiceSearch = () => {
    if (
      !("webkitSpeechRecognition" in window || "SpeechRecognition" in window)
    ) {
      alert("Trình duyệt không hỗ trợ tìm kiếm bằng giọng nói!");
      return;
    }

    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.lang = "vi-VN"; // Hỗ trợ tiếng Việt
    recognition.continuous = false; // Dừng sau khi nhận diện xong
    recognition.interimResults = false; // Không hiển thị kết quả tạm thời

    setIsListening(true); // Cập nhật trạng thái lắng nghe
    recognition.start();

    recognition.onstart = () => {
      console.log("Bắt đầu nhận diện giọng nói...");
    };

    recognition.onresult = (event) => {
      const speechResult = event.results[0][0].transcript.trim();
      console.log("Kết quả giọng nói:", speechResult);
      setIsListening(false);
      onVoiceInput(speechResult); // Gửi kết quả về SearchBoxComponent
      recognition.stop();
    };

    recognition.onerror = (event) => {
      console.error("Lỗi nhận diện giọng nói:", event.error);
      if (event.error === "network") {
        alert("Lỗi mạng! Kiểm tra kết nối internet và thử lại.");
      } else if (event.error === "not-allowed") {
        alert(
          "Truy cập microphone bị từ chối. Hãy cấp quyền truy cập microphone trong trình duyệt."
        );
      } else {
        alert("Lỗi nhận diện giọng nói. Vui lòng thử lại!");
      }
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.onend = () => {
      console.log("Dừng nhận diện giọng nói.");
      setIsListening(false);
    };
  };

  return (
    <button
      onClick={handleVoiceSearch}
      className={styles.voiceButton}
      style={{
        color: isListening ? " #b1e321" : "#3a060e",
        transition: "color 0.3s ease",
      }}
    >
      {isListening ? (
        " Đang nghe..."
      ) : (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="21"
          height="28"
          viewBox="0 0 21 28"
          fill="none"
        >
          <path
            d="M10.5 0C7.60156 0 5.25 2.35156 5.25 5.25V14C5.25 16.8984 7.60156 19.25 10.5 19.25C13.3984 19.25 15.75 16.8984 15.75 14V5.25C15.75 2.35156 13.3984 0 10.5 0ZM3.5 11.8125C3.5 11.0852 2.91484 10.5 2.1875 10.5C1.46016 10.5 0.875 11.0852 0.875 11.8125V14C0.875 18.8727 4.49531 22.8977 9.1875 23.5375V25.375H6.5625C5.83516 25.375 5.25 25.9602 5.25 26.6875C5.25 27.4148 5.83516 28 6.5625 28H10.5H14.4375C15.1648 28 15.75 27.4148 15.75 26.6875C15.75 25.9602 15.1648 25.375 14.4375 25.375H11.8125V23.5375C16.5047 22.8977 20.125 18.8727 20.125 14V11.8125C20.125 11.0852 19.5398 10.5 18.8125 10.5C18.0852 10.5 17.5 11.0852 17.5 11.8125V14C17.5 17.8664 14.3664 21 10.5 21C6.63359 21 3.5 17.8664 3.5 14V11.8125Z"
            fill="currentColor"
          />
        </svg>
      )}
    </button>
  );
};

export default VoiceComponent;
