// ToastNotification.js
import React, { useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ToastNotification = ({ error }) => {
  const notifyError = (message) => {
    toast.error(message, {
      position: "top-center",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  };

  useEffect(() => {
    if (error) {
      const matches = error.message.match(/"(.*?)"/g);
      let errorMessage = "Đã xảy ra lỗi"; // Giá trị mặc định

      if (matches) {
        errorMessage = matches
          .map((match) => match.replace(/"/g, ""))
          .join(", ");
      }

      notifyError(errorMessage);
    }
  }, [error]);

  return;
};

export default ToastNotification;
