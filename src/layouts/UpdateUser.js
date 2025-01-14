import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserInfo, updateUser } from "../Redux/actions/authActions";
import { toast } from "react-toastify";
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
  const [isLoading, setIsLoading] = useState(false);

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
      const validTypes = ["image/jpeg", "image/jpg", "image/png"];
      if (!validTypes.includes(file.type)) {
        toast.error("Chỉ chấp nhận file định dạng JPG, JPEG hoặc PNG!", {
          position: "top-center",
          autoClose: 2000,
        });
        return;
      }

      setAvatar(file);
      setAvatarPreview(URL.createObjectURL(file));

      toast.success("Cập nhật hình ảnh thành công!", {
        position: "top-center",
        autoClose: 2000,
      });
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);

    const updatedUser = {
      avatar,
      fullname,
      identifier,
      email,
      address,
    };

    try {
      await dispatch(updateUser(userId, updatedUser));
      toast.success("Đã cập nhật thông tin thành công!", {
        position: "top-center",
        autoClose: 2000,
      });
      setTimeout(() => {
        navigate("/user");
      }, 2000);
    } catch (error) {
      toast.error("Cập nhật thông tin thất bại!", {
        position: "top-center",
        autoClose: 2000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="formUpdateUser">
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            marginBottom: "24px",
          }}
        >
          <img
            src={avatarPreview}
            alt="avatar"
            style={{
              width: "120px",
              height: "120px",
              borderRadius: "50%",
              objectFit: "cover",
              marginBottom: "16px",
            }}
          />
          <label
            htmlFor="avatarUpload"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              cursor: "pointer",
            }}
          >
            <FaCamera />
            Chọn hình ảnh
          </label>
          <input
            type="file"
            id="avatarUpload"
            onChange={handleAvatarChange}
            accept="image/jpeg, image/jpg, image/png"
            style={{ display: "none" }}
          />
        </div>

        <form
          onSubmit={handleSubmit}
          style={{ width: "100%", maxWidth: "500px", margin: "0 auto" }}
        >
          <div
            className="itemUser"
            style={{
              display: "grid",
              gridTemplateColumns: "120px 1fr",
              gap: "16px",
              marginBottom: "16px",
              alignItems: "center",
            }}
          >
            <div
              style={{
                textAlign: "right",
                width: "100%",
              }}
            >
              Họ và tên<span className="requiredStar">*</span>
            </div>
            <input
              type="text"
              id="userName"
              value={fullname}
              onChange={(e) => setFullname(e.target.value)}
              placeholder="Nhập họ và tên"
              className="inputItemUser"
              style={{
                width: "100%",
                height: "40px",
                padding: "8px 12px",
                border: "1px solid #d9d9d9",
                borderRadius: "4px",
                boxSizing: "border-box",
              }}
              required
            />
          </div>

          <div
            className="itemUser"
            style={{
              display: "grid",
              gridTemplateColumns: "120px 1fr",
              gap: "16px",
              marginBottom: "16px",
              alignItems: "center",
            }}
          >
            <div
              style={{
                textAlign: "right",
                width: "100%",
              }}
            >
              Mã số<span className="requiredStar">*</span>
            </div>
            <input
              type="text"
              id="userMSSV"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              placeholder="Nhập MSSV/GV"
              className="inputItemUser readOnlyField"
              style={{
                width: "100%",
                height: "40px",
                padding: "8px 12px",
                border: "1px solid #d9d9d9",
                borderRadius: "4px",
                boxSizing: "border-box",
              }}
              readOnly
            />
          </div>

          <div
            className="itemUser"
            style={{
              display: "grid",
              gridTemplateColumns: "120px 1fr",
              gap: "16px",
              marginBottom: "16px",
              alignItems: "center",
            }}
          >
            <div
              style={{
                textAlign: "right",
                width: "100%",
              }}
            >
              Email<span className="requiredStar">*</span>
            </div>
            <input
              type="text"
              // id="userEmail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Nhập Email"
              className="inputItemUser readOnlyField"
              style={{
                width: "100%",
                height: "40px",
                padding: "8px 12px",
                border: "1px solid #d9d9d9",
                borderRadius: "4px",
                boxSizing: "border-box",
              }}
              readOnly
            />
          </div>

          <div
            className="itemUser"
            style={{
              display: "grid",
              gridTemplateColumns: "120px 1fr",
              gap: "16px",
              marginBottom: "16px",
              alignItems: "center",
            }}
          >
            <div
              style={{
                textAlign: "right",
                width: "100%",
              }}
            >
              Địa chỉ<span className="requiredStar">*</span>
            </div>
            <input
              type="text"
              // id="userAddress"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Nhập Địa chỉ"
              className="inputItemUser"
              style={{
                width: "100%",
                height: "40px",
                padding: "8px 12px",
                border: "1px solid #d9d9d9",
                borderRadius: "4px",
                boxSizing: "border-box",
              }}
              required
            />
          </div>

          <div
            style={{
              textAlign: "center",
              marginTop: "24px",
            }}
          >
            <Button
              type="submit"
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                minWidth: "120px",
                height: "50px",
                width: "16%",
                padding: "0 24px",
                backgroundColor: "#1890ff",
                color: "white",
                border: "none",
                borderRadius: "6px",
                fontWeight: "500",
                cursor: isLoading ? "not-allowed" : "pointer",
                transition: "all 0.3s ease",
                boxShadow: "0 2px 0 rgba(0, 0, 0, 0.045)",
                opacity: isLoading ? 0.7 : 1,
              }}
              onMouseOver={(e) =>
                !isLoading &&
                (e.currentTarget.style.backgroundColor = "#40a9ff")
              }
              onMouseOut={(e) =>
                !isLoading &&
                (e.currentTarget.style.backgroundColor = "#1890ff")
              }
              disabled={isLoading}
            >
              <span
                style={{ display: "flex", alignItems: "center", gap: "8px" }}
              >
                {isLoading ? (
                  <>
                    <div
                      style={{
                        display: "inline-block",
                        width: "20px",
                        height: "20px",
                        border: "2px solid rgba(255, 255, 255, 0.3)",
                        borderTop: "2px solid #ffffff",
                        borderRadius: "50%",
                        animation: "spin 0.8s ease-in-out infinite",
                        marginRight: "8px",
                      }}
                    />
                    Đang xử lý...
                  </>
                ) : (
                  "Xác nhận"
                )}
              </span>
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

const spinKeyframes = `
  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

const style = document.createElement("style");
style.innerHTML = spinKeyframes;
document.head.appendChild(style);

export default UpdateUser;
