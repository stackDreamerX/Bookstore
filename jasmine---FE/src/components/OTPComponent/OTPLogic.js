export const setupOTPInputs = (inputSelector) => {
  console.log("Selector received:", inputSelector); // Thêm để debug
  const inputs = document.querySelectorAll(inputSelector); // inputSelector phải là chuỗi hợp lệ
  inputs.forEach((input, index) => {
    input.addEventListener("input", (e) => {
      const value = e.target.value;
      if (value && index < inputs.length - 1) {
        inputs[index + 1].focus();
      }
    });

    input.addEventListener("keydown", (e) => {
      if (e.key === "Backspace" && !input.value && index > 0) {
        inputs[index - 1].focus();
      }
    });
  });
};
