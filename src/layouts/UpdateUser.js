import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserInfo, updateUser } from "../Redux/actions/authActions";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./css/index.css";
import avatarPlaceholder from "../assets/iconAva.png";
import { FaCamera } from "react-icons/fa";
import Button from "../components/Button";

function UpdateUser() {
  const [avatar, setAvatar] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(avatarPlaceholder);
  const [fullname, setFullname] = useState("");
  const [identifier, setIdentifier] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userId } = useParams();

  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    if (userId) {
      dispatch(fetchUserInfo(userId));
    }
  }, [dispatch, userId]);

  useEffect(() => {
    if (user) {
      setAvatarPreview(user.avatar || avatarPlaceholder);
      setFullname(user.fullname || "");
      setIdentifier(user.identifier || "");
      setEmail(user.email || "");
      setAddress(user.address || "");
    }
  }, [user]);

  const handleAvatarChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setAvatar(file);
      setAvatarPreview(URL.createObjectURL(file)); // Show preview of the selected image

      toast.success("Cập nhật hình ảnh thành công!", {
        position: "top-center",
        autoClose: 2000,
      });
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const updatedUser = {
      avatar, // File itself (image)
      fullname,
      identifier,
      email,
      address,
    };

    dispatch(updateUser(userId, updatedUser)).then(() => {
      toast.success("Đã cập nhật thông tin thành công!", {
        position: "top-center",
        autoClose: 2000,
      });
      setTimeout(() => {
        navigate("/user");
      }, 2000);
    });
  };

  return (
    <div className="container">
      {/* <ToastContainer /> */}
      <div className="formUpdateUser">
        <div className="avatarContainer">
          <img src={avatarPreview} alt="avatar" className="avatar" />
          <label htmlFor="avatarUpload" className="avatarUploadLabel">
            <FaCamera className="cameraIcon" />
            Chọn hình ảnh
          </label>
          <input
            type="file"
            id="avatarUpload"
            className="avatarUpload"
            onChange={handleAvatarChange}
            accept="image/*"
          />
        </div>
        <form onSubmit={handleSubmit}>
          <div className="itemUser">
            Họ và tên<span className="requiredStar">*</span>
            <input
              type="text"
              id="userName"
              value={fullname}
              onChange={(e) => setFullname(e.target.value)}
              placeholder="Nhập họ và tên"
              className="inputItemUser"
              required
            />
          </div>
          <div className="itemUser">
            MSSV/GV<span className="requiredStar">*</span>
            <input
              type="text"
              id="userMSSV"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              placeholder="Nhập MSSV/GV"
              className="inputItemUser readOnlyField"
              readOnly
            />
          </div>
          <div className="itemUser">
            Email<span className="requiredStar">*</span>
            <input
              type="text"
              id="userEmail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Nhập Email"
              className="inputItemUser readOnlyField"
              readOnly
            />
          </div>
          <div className="itemUser">
            Địa chỉ<span className="requiredStar">*</span>
            <input
              type="text"
              id="userAddress"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Nhập Địa chỉ"
              className="inputItemUser"
              required
            />
          </div>
          <div className="btnAcpChange">
            <Button type="submit">
              <span className="titleAcp">Xác nhận</span>
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default UpdateUser;
