import React, { useState } from "react";
import "../../assets/css/style.css";
import "../../assets/css/reset.css";
import styles from "./SearchBoxComponent.module.css";
import ButtonComponent from "../ButtonComponent/ButtonComponent";
import VoiceComponent from "../VoiceComponent/VoiceComponent";

const SearchBoxComponent = ({ onSearch, onButtonClick }) => {
  const [query, setQuery] = useState("");

  const handleInputChange = (e) => {
    setQuery(e.target.value);
  };

  const handleSearch = () => {
    if (query.trim()) {
      onSearch(query.trim()); // Gọi hàm onSearch với từ khóa
    } else {
      alert("Vui lòng nhập từ khóa tìm kiếm."); // Hiển thị cảnh báo nếu từ khóa trống
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handleVoiceInput = (speechResult) => {
    if (speechResult.trim()) {
      setQuery(speechResult); // Cập nhật ô tìm kiếm với kết quả giọng nói
      setTimeout(() => onSearch(speechResult.trim()), 200); // Đợi 200ms để cập nhật xong rồi mới tìm kiếm
    }
  };

  return (
    <div className={styles.search__wrapper}>
      <input
        className={styles.search__component}
        type="search"
        placeholder="Nhập tên sản phẩm..."
        aria-label="Search"
        value={query}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
      />
      <VoiceComponent onVoiceInput={handleVoiceInput} />
      <ButtonComponent
        className="search__button"
        onClick={() => onButtonClick(query)}
      >
        Tìm kiếm
      </ButtonComponent>
    </div>
  );
};

export default SearchBoxComponent;
