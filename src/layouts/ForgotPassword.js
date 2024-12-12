import React, { useState } from "react";
import "./css/index.css";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button";
import { forgotPassword } from "../Redux/actions/authActions";
import { useDispatch } from "react-redux";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const validateEmail = (email) => {
    // Regular expression to check email format
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Check if email input is empty
    if (!email) {
      toast.error("Bạn chưa nhập email của mình.", {
        position: "top-center",
        autoClose: 3000,
        closeOnClick: true,
        className: "custom-toast",
        progressClassName: "custom-progress",
      });
      setLoading(false); // Reset loading state
      return; // Stop the function if email is not provided
    }

    // Check if email contains '@'
    if (!email.includes("@")) {
      toast.error("Bạn đã nhập email không hợp lệ. Vui lòng kiểm tra lại.", {
        position: "top-center",
        autoClose: 3000,
        closeOnClick: true,
        className: "custom-toast",
        progressClassName: "custom-progress",
      });
      setLoading(false); // Reset loading state
      return; // Stop the function if email is invalid
    }

    // Validate email format
    if (!validateEmail(email)) {
      toast.error("Email không hợp lệ. Vui lòng nhập email hợp lệ.", {
        position: "top-center",
        autoClose: 3000,
        closeOnClick: true,
        className: "custom-toast",
        progressClassName: "custom-progress",
      });
      setLoading(false); // Reset loading state
      return; // Stop the function if email format is invalid
    }

    try {
      const result = await dispatch(forgotPassword(email));
      console.log("API response:", result);
      toast.success(
        "Đã gửi email thành công. Vui lòng kiểm tra email của bạn.",
        {
          position: "top-center",
          autoClose: 3000,
          closeOnClick: true,
          className: "custom-toast",
          progressClassName: "custom-progress",
        }
      );
      setEmail("");
    } catch (error) {
      toast.error(error.message, {
        position: "top-center",
        autoClose: 3000,
        closeOnClick: true,
        className: "custom-toast",
        progressClassName: "custom-progress",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="form">
        <div className="titleForgotPassword">Quên mật khẩu</div>
        <form onSubmit={handleSubmit}>
          <div className="itemFormForgotPassword">
            <label className="titleLabel" htmlFor="email">
              Email<span className="requiredStar">*</span>
            </label>
            <input
              id="email"
              placeholder="Nhập email"
              className="inputItem"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="btnSubmit">
            <Button type="submit" disabled={loading}>
              <span className="titleSubmit">
                {loading ? "Đang gửi..." : "Gửi email"}
              </span>
            </Button>
          </div>
        </form>
        <div className="title">
          Bạn đã có tài khoản chưa ?
          <div className="titleSignIn" onClick={() => navigate("/login")}>
            Đăng nhập
          </div>
        </div>
        <div className="title">
          Chưa có tài khoản ?
          <div className="login" onClick={() => navigate("/register")}>
            Đăng ký
          </div>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;
