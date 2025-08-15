import React, { useEffect } from "react";
import "./OTPComponent.css";
import { setupOTPInputs } from "./OTPLogic";

const OTPComponent = () => {
  useEffect(() => {
    setupOTPInputs(".input__otp");
  }, []);

  return (
    <div>
      <input type="text" maxlength="1" className="input__otp" />
    </div>
  );
};

export default OTPComponent;
