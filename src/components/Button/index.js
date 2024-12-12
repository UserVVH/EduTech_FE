import React from "react";
import "./button.css";

function Button({ children, disabled, ...props }) {
  return (
    <button
      className={`button ${disabled ? "button-disabled" : ""}`}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}

export default Button;
