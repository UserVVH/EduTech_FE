import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import "./css/index.css";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import Button from "../components/Button";
import { changePassword } from "../Redux/actions/authActions";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function ChangePassword() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [reNewPassword, setReNewPassword] = useState("");
  const [showOldPassword, setOldShowPassword] = useState(false);
  const [showNewPassword, setNewShowPassword] = useState(false);
  const [showReNewPassword, setShowReNewPassword] = useState(false);
  const [error, setError] = useState(null);

  // Password pattern validation
  const passwordPattern =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%&*]).{8,}$/;

  const toggleOldPasswordVisibility = () => {
    setOldShowPassword(!showOldPassword);
  };

  const toggleNewPasswordVisibility = () => {
    setNewShowPassword(!showNewPassword);
  };

  const toggleReNewPasswordVisibility = () => {
    setShowReNewPassword(!showReNewPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!oldPassword) {
      setError("Mật khẩu cũ không được để trống.");
      toast.error("Mật khẩu cũ không được để trống.", {
        position: "top-center",
        autoClose: 3000,
        closeOnClick: true,
        className: "custom-toast",
        progressClassName: "custom-progress",
      });
      return;
    }

    if (!newPassword) {
      setError("Mật khẩu mới không được để trống.");
      toast.error("Mật khẩu mới không được để trống.", {
        position: "top-center",
        autoClose: 3000,
        closeOnClick: true,
        className: "custom-toast",
        progressClassName: "custom-progress",
      });
      return;
    }

    if (!reNewPassword) {
      setError("Nhập lại mật khẩu mới không được để trống.");
      toast.error("Nhập lại mật khẩu mới không được để trống.", {
        position: "top-center",
        autoClose: 3000,
        closeOnClick: true,
        className: "custom-toast",
        progressClassName: "custom-progress",
      });
      return;
    }

    if (newPassword !== reNewPassword) {
      setError("Mật khẩu mới không khớp.");
      toast.error("Mật khẩu mới không khớp.", {
        position: "top-center",
        autoClose: 3000,
        closeOnClick: true,
        className: "custom-toast",
        progressClassName: "custom-progress",
      });
      return;
    }

    const passwordPattern =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%&*])[A-Za-z\d!@#$%&*]{8,}$/;

    if (!passwordPattern.test(newPassword)) {
      toast.error(
        "Mật khẩu phải 8 ký tự và chỉ cho phép chữ hoa, chữ thường, ký tự số và ký tự đặc biệt là !@#$%&*",
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

    try {
      await dispatch(changePassword(oldPassword, newPassword, reNewPassword));
      toast.success("Mật khẩu đã được thay đổi thành công.", {
        position: "top-center",
        autoClose: 1000,
        closeOnClick: true,
        className: "custom-toast",
        progressClassName: "custom-progress",
      });
      setError(null);
      setTimeout(() => {
        navigate("/user");
      }, 1000);
    } catch (err) {
      setError(err.message || "Đã xảy ra lỗi.");
      toast.error(err.message || "Đã xảy ra lỗi.", {
        position: "top-center",
        autoClose: 3000,
        closeOnClick: true,
        className: "custom-toast",
        progressClassName: "custom-progress",
      });
    }
  };

  return (
    <div className="container">
      <div className="form">
        <div className="titleChangePassword">Thay đổi mật khẩu</div>
        <form onSubmit={handleSubmit}>
          <div className="itemFormChangePassword">
            <label className="titleLabel" htmlFor="oldPassword">
              Mật khẩu cũ<span className="requiredStar">*</span>
            </label>
            <div className="passwordWrapper">
              <input
                type={showOldPassword ? "text" : "password"}
                id="oldPassword"
                placeholder="Nhập mật khẩu cũ"
                className="inputItem"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
              />
              <span
                className="togglePassword"
                onClick={toggleOldPasswordVisibility}
              >
                {showOldPassword ? <FaEye /> : <FaEyeSlash />}
              </span>
            </div>
          </div>
          <div className="itemFormChangePassword">
            <label className="titleLabel" htmlFor="newPassword">
              Mật khẩu mới<span className="requiredStar">*</span>
            </label>
            <div className="passwordWrapper">
              <input
                type={showNewPassword ? "text" : "password"}
                id="newPassword"
                placeholder="Nhập mật khẩu mới"
                className="inputItem"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
              <span
                className="togglePassword"
                onClick={toggleNewPasswordVisibility}
              >
                {showNewPassword ? <FaEye /> : <FaEyeSlash />}
              </span>
            </div>
          </div>
          <div className="itemFormChangePassword">
            <label className="titleLabel" htmlFor="reNewPassword">
              Nhập lại mật khẩu mới<span className="requiredStar">*</span>
            </label>
            <div className="passwordWrapper">
              <input
                type={showReNewPassword ? "text" : "password"}
                id="reNewPassword"
                placeholder="Nhập lại mật khẩu mới"
                className="inputItem"
                value={reNewPassword}
                onChange={(e) => setReNewPassword(e.target.value)}
              />
              <span
                className="togglePassword"
                onClick={toggleReNewPasswordVisibility}
              >
                {showReNewPassword ? <FaEye /> : <FaEyeSlash />}
              </span>
            </div>
          </div>
          <div className="btnSubmit">
            <Button type="submit">
              <span className="titleSubmit">Xác nhận</span>
            </Button>
          </div>
        </form>
      </div>
      {/* <ToastContainer
        position="top-center"
        autoClose={3000}
        closeOnClick
        className="custom-toast-container"
        progressClassName="custom-progress"
      /> */}
    </div>
  );
}

export default ChangePassword;
