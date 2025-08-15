import React from "react";
import styles from "./FormComponent.module.css";

const FormComponent = ({
  className = "",
  style = {},
  value = "",
  onChange = () => {},
  error = false,
  name = "",
  placeholder = "",
  ...props
}) => {
  return (
    <div className={`${styles.form__control} ${className}`}>
      <input
        type={props.type || "text"}
        className={`${styles.form__text}`}
        id={props.id || name} // ưu tiên name làm id nếu không có id
        name={name} // thêm thuộc tính name
        placeholder={placeholder}
        style={style}
        value={value}
        onChange={(e) => onChange(e)} // truyền toàn bộ event
        {...props}
      />
      {error && <span className={styles.error__text}>{error}</span>}
    </div>
  );
};

export default FormComponent;
