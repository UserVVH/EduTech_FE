import React, { useState } from "react";
import "./css/index.css";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { register } from "../Redux/actions/authActions";
import Button from "../components/Button";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Register() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repassword, setRepassword] = useState("");
  const [identifier, setIdentifier] = useState("");
  const [address, setAddress] = useState("");
  const [role, setRole] = useState("USER"); // Mặc định là USER
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [registering, setRegistering] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const { loading } = useSelector((state) => state.auth);

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!fullname.trim()) {
      toast.error("Vui lòng nhập họ và tên đầy đủ", {
        position: "top-center",
        autoClose: 3000,
        closeOnClick: true,
        className: "custom-toast",
        progressClassName: "custom-progress",
      });
      return;
    }

    if (!email.trim()) {
      toast.error("Vui lòng nhập email", {
        position: "top-center",
        autoClose: 3000,
        closeOnClick: true,
        className: "custom-toast",
        progressClassName: "custom-progress",
      });
      return;
    }

    if (!address.trim()) {
      toast.error("Vui lòng nhập địa chỉ", {
        position: "top-center",
        autoClose: 3000,
        closeOnClick: true,
        className: "custom-toast",
        progressClassName: "custom-progress",
      });
      return;
    }

    // const emailPattern = /^(?=.{2,})[\w.-]+@[\w.-]+\.[a-zA-Z]{2,}$/;

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

    const passwordPattern =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%&*]).{8,}$/;

    // Kiểm tra độ dài mật khẩu
    if (password.length < 8 || repassword.length < 8) {
      toast.error("Mật khẩu phải có ít nhất 8 ký tự", {
        position: "top-center",
        autoClose: 3000,
        closeOnClick: true,
        className: "custom-toast",
        progressClassName: "custom-progress",
      });
      return;
    }

    // Kiểm tra định dạng mật khẩu
    if (!passwordPattern.test(password)) {
      toast.error(
        "Mật khẩu phải bao gồm chữ hoa, chữ thường, ký tự số và ký tự đặc biệt là !@#$%&*",
        {
          position: "top-center",
          autoClose: 3000,
          closeOnClick: true,
          className: "custom-toast",
          progressClassName: "custom-progress",
        }
      );
      return;
    }

    // Kiểm tra khớp của mật khẩu và mật khẩu nhập lại
    if (password !== repassword) {
      toast.error("Mật khẩu không khớp", {
        position: "top-center",
        autoClose: 3000,
        closeOnClick: true,
        className: "custom-toast",
        progressClassName: "custom-progress",
      });
      return;
    }

    const identifierPattern = /^(SV|GV)\d{6}$/;
    if (role === "STUDENT" && !identifier.startsWith("SV")) {
      toast.error(
        "Mã số sinh viên phải bắt đầu bằng 'SV' và theo sau là 6 chữ số",
        {
          position: "top-center",
          autoClose: 3000,
          closeOnClick: true,
          className: "custom-toast",
          progressClassName: "custom-progress",
        }
      );
      return;
    } else if (role === "TEACHER" && !identifier.startsWith("GV")) {
      toast.error(
        "Mã số giáo viên phải bắt đầu bằng 'GV' và theo sau là 6 chữ số",
        {
          position: "top-center",
          autoClose: 3000,
          closeOnClick: true,
          className: "custom-toast",
          progressClassName: "custom-progress",
        }
      );
      return;
    }

    if (role === "STUDENT") {
      if (!identifierPattern.test(identifier)) {
        toast.error("Mã số SV phải có đúng 6 chữ số sau 'SV' ", {
          position: "top-center",
          autoClose: 3000,
          closeOnClick: true,
          className: "custom-toast",
          progressClassName: "custom-progress",
        });
        return;
      }
    } else if (role === "TEACHER") {
      if (!identifierPattern.test(identifier)) {
        toast.error("Mã số GV phải có đúng 6 chữ số sau 'GV'", {
          position: "top-center",
          autoClose: 3000,
          closeOnClick: true,
          className: "custom-toast",
          progressClassName: "custom-progress",
        });
        return;
      }
    }

    const formData = new FormData();
    formData.append("email", email);
    formData.append("password", password);
    formData.append("fullname", fullname);
    formData.append("address", address);
    formData.append("role", role);
    formData.append("repassword", repassword);

    if (role === "STUDENT" || role === "TEACHER") {
      formData.append("identifier", identifier);
    }

    setRegistering(true);

    try {
      await dispatch(register(formData));
      toast.success("Đăng ký thành công!", {
        position: "top-center",
        autoClose: 3000,
        closeOnClick: true,
        className: "custom-toast",
        progressClassName: "custom-progress",
      });
      setTimeout(() => {
        navigate("/login");
      }, 3000);
    } catch (err) {
      if (err.response && err.response.status === 409) {
        toast.error("Mã số đã tồn tại", {
          position: "top-center",
          autoClose: 3000,
          closeOnClick: true,
          className: "custom-toast",
          progressClassName: "custom-progress",
        });
      } else {
        toast.error(err.message || "Đăng ký thất bại", {
          position: "top-center",
          autoClose: 3000,
          closeOnClick: true,
          className: "custom-toast",
          progressClassName: "custom-progress",
        });
      }
    } finally {
      setRegistering(false);
    }
  };

  return (
    <div className="container">
      <form className="form" onSubmit={handleRegister}>
        <div className="titleRegister">Đăng ký</div>
        <div className="form-row">
          <div className="form-column">
            <div className="itemForm">
              <label className="titleLabel" htmlFor="fullname">
                Họ và tên<span className="requiredStar">*</span>
              </label>
              <input
                type="text"
                id="fullname"
                placeholder="Nhập họ tên"
                className="inputItem"
                value={fullname}
                onChange={(e) => setFullname(e.target.value)}
              />
            </div>
          </div>
          <div className="form-column">
            <div className="itemForm">
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
              />
            </div>
          </div>
        </div>
        <div className="form-row">
          <div className="form-column">
            <div className="itemForm">
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
                />
                <span
                  className="togglePassword"
                  onClick={togglePasswordVisibility}
                >
                  {showPassword ? <FaEye /> : <FaEyeSlash />}
                </span>
              </div>
            </div>
          </div>
          <div className="form-column">
            <div className="itemForm">
              <label className="titleLabel" htmlFor="confirmPassword">
                Nhập lại mật khẩu<span className="requiredStar">*</span>
              </label>
              <div className="passwordWrapper">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirmPassword"
                  placeholder="Nhập lại mật khẩu"
                  className="inputItem"
                  value={repassword}
                  onChange={(e) => setRepassword(e.target.value)}
                />
                <span
                  className="togglePassword"
                  onClick={toggleConfirmPasswordVisibility}
                >
                  {showConfirmPassword ? <FaEye /> : <FaEyeSlash />}
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="form-row">
          <div className="form-column">
            <div className="itemForm">
              <label className="titleLabel" htmlFor="address">
                Địa chỉ<span className="requiredStar">*</span>
              </label>
              <input
                type="text"
                id="address"
                placeholder="Nhập địa chỉ"
                className="inputItem"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </div>
          </div>
        </div>
        <div className="itemForm">
          <label className="titleLabel" htmlFor="role">
            Vai trò<span className="requiredStar">*</span>
          </label>
          <select
            id="role"
            className="inputItemRole"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="USER">Người dùng</option>
            <option value="STUDENT">Sinh viên</option>
            <option value="TEACHER">Giảng viên</option>
          </select>
        </div>

        {(role === "STUDENT" || role === "TEACHER") && (
          <div className="form-row">
            <div className="form-column">
              <div className="itemForm">
                <label className="titleLabel" htmlFor="identifier">
                  Mã số SV/GV<span className="requiredStar">*</span>
                </label>
                <input
                  type="text"
                  id="identifier"
                  placeholder="Nhập mã số SV/GV"
                  className="inputItem"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                />
              </div>
            </div>
          </div>
        )}
        <div className="btnSubmit">
          <Button type="submit" disabled={loading}>
            <span className="titleSubmit">Đăng ký</span>
          </Button>
        </div>
      </form>
    </div>
  );
}

export default Register;
