import React, { useState, useEffect } from "react";
import "./css/index.css";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { login } from "../Redux/actions/authActions";
import Button from "../components/Button";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loginAttempted, setLoginAttempted] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const { loading, error, isAuthenticated } = useSelector(
    (state) => state.auth
  );

  useEffect(() => {
    if (loginAttempted) {
      if (isAuthenticated) {
        const user = JSON.parse(localStorage.getItem("user"));
        const role = user?.role;
        if (role === "ADMIN") {
          toast.success("Chào mừng quay lại trang quản lý !", {
            position: "top-center",
            autoClose: 1000,
            closeOnClick: true,
            className: "custom-toast",
            progressClassName: "custom-progress",
          });
          setTimeout(() => {
            navigate("/admin");
          }, 1000);
        } else {
          toast.success("Đăng nhập thành công!", {
            position: "top-center",
            autoClose: 1000,
            closeOnClick: true,
            className: "custom-toast",
            progressClassName: "custom-progress",
          });
          setTimeout(() => {
            navigate("/");
          }, 1000);
        }
      } else if (error) {
        toast.error(getErrorMessage(error), {
          position: "top-center",
          autoClose: 3000,
          closeOnClick: true,
          className: "custom-toast",
          progressClassName: "custom-progress",
        });
      }
    }
  }, [isAuthenticated, error, loginAttempted, navigate]);

  const getErrorMessage = (error) => {
    if (error.includes("Unexpected token 'T'") && error.includes("Tài khoản")) {
      return "Tài khoản đã bị khoá. Vui lòng liên hệ quản trị viên!";
    } else if (
      error.includes("Unexpected token 'E'") &&
      error.includes("Email hoặc")
    ) {
      return "Email hoặc mật khẩu không đúng.";
    }

    // Fallback for any other error messages
    return error || "Đăng nhập thất bại! Vui lòng thử lại.";
  };

  const handleLogin = (e) => {
    e.preventDefault();

    if (!email) {
      toast.error("Vui lòng nhập email", {
        position: "top-center",
        autoClose: 3000,
        closeOnClick: true,
        className: "custom-toast",
        progressClassName: "custom-progress",
      });
      return;
    }

    if (!password) {
      toast.error("Vui lòng nhập mật khẩu", {
        position: "top-center",
        autoClose: 3000,
        closeOnClick: true,
        className: "custom-toast",
        progressClassName: "custom-progress",
      });
      return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/;

    if (!emailPattern.test(email)) {
      toast.error("Email không hợp lệ", {
        position: "top-center",
        autoClose: 3000,
        closeOnClick: true,
        className: "custom-toast",
        progressClassName: "custom-progress",
      });
      return;
    }

    setLoginAttempted(true);
    dispatch(login(email, password));
  };

  return (
    <div className="container">
      <form className="form" onSubmit={handleLogin}>
        <div className="titleLogin">Đăng Nhập</div>
        <div className="itemFormLogin">
          <label className="titleLabel" htmlFor="email">
            Email<span className="requiredStar">*</span>
          </label>
          <input
            // type="email"
            id="email"
            placeholder="Nhập email"
            className="inputItem"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            // required
          />
        </div>
        <div className="itemFormLogin">
          <label className="titleLabel" htmlFor="password">
            Mật khẩu<span className="requiredStar">*</span>
          </label>
          <div className="passwordWrapper">
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              placeholder="Nhập mật khẩu"
              className="inputItem"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              // required
            />
            <span className="togglePassword" onClick={togglePasswordVisibility}>
              {showPassword ? <FaEye /> : <FaEyeSlash />}
            </span>
          </div>
        </div>
        <div className="btnSubmit">
          <Button type="submit" disabled={loading}>
            <span className="titleSubmit">Đăng nhập</span>
          </Button>
        </div>
        <div
          className="forgotPassword"
          onClick={() => navigate("/forgotpassword")}
        >
          Quên mật khẩu ?
        </div>
        <div className="title">
          Chưa có tài khoản ?
          <div className="login" onClick={() => navigate("/register")}>
            Đăng ký
          </div>
        </div>
      </form>
    </div>
  );
}

export default Login;
