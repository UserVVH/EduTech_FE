import React, { useEffect, useState } from "react";
import NavBar from "../../components/Admin/NavBar/NavBar";
import avatar from "../../assets/iconAva.png";
import { FaUser } from "react-icons/fa6";
import "./css/index.css";
import HeaderAdmin from "../../components/Admin/HeaderAdmin/HeaderAdmin";
import { useParams } from "react-router-dom";
import avatarUser from "../../assets/iconAva.png";

function AdminListUser() {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserDetail = async () => {
      try {
        const response = await fetch(
          `http://localhost:8080/api/admin/users/${id}`,
          {
            method: "GET",
            headers: {
              Authorization: `${localStorage.getItem("authToken")}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch user details");
        }

        const data = await response.json();
        setUser(data); // Giả sử data là đối tượng người dùng
      } catch (err) {
        setError(err.message);
      }
    };

    fetchUserDetail();
  }, [id]);

  if (error) {
    return <div>Error: {error}</div>;
  }

  const getRoleDisplay = (role) => {
    switch (role) {
      case "ADMIN":
        return "ADMIN";
      case "STUDENT":
        return "Sinh viên";
      case "TEACHER":
        return "Giảng viên";
      case "USER":
        return "Người dùng";
      default:
        return "Chưa xác định";
    }
  };

  return (
    <div className="containerAdminManageUser">
      <div className="leftAdminManageUser">
        <NavBar />
      </div>
      <div className="rightAdminManageUser">
        <HeaderAdmin />
        <div className="containerInfoDocument">
          <div className="containerSearchAdmin">
            <span className="titleInfoAdmin">
              <FaUser className="iconUser" />
              <span className="titleInfo">Thông tin người dùng</span>
            </span>
          </div>
          <div className="containerDetailUser">
            {user && (
              <div className="infoDetailUser">
                <img
                  src={user.avatar || avatarUser} // Hiển thị ảnh mặc định nếu không có avatar
                  alt="User"
                  className="imgDetailUser"
                  onError={(e) => {
                    e.target.src = avatar; // Thay đổi src nếu không tải được
                  }}
                />
                {user.role && (
                  <div className="roleDetailUser">
                    {getRoleDisplay(user.role)}
                  </div>
                )}
                <div className="titleDetailUser">
                  <p>Họ tên: {user.fullname}</p>
                </div>
                {user.identifier && (
                  <div className="identifierDetailUser">
                    <p>Mã số: {user.identifier}</p>
                  </div>
                )}
                {user.email && (
                  <div className="emailDetailUser">
                    <p>Email: {user.email}</p>
                  </div>
                )}
                {user.address && (
                  <div className="addressDetailUser">
                    <p>Địa chỉ: {user.address}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminListUser;
