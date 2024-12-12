import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchUserInfo } from "../../../Redux/actions/authActions";
import avatar from "../../../assets/iconAva.png";

function HeaderAdmin() {
  const dispatch = useDispatch();
  const token = localStorage.getItem("authToken");
  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    if (token) {
      dispatch(fetchUserInfo());
    }
  }, [dispatch, token]);

  const avatarUrl = user?.avatar || avatar;
  return (
    <div className="containerHeaderAdmin">
      <div className="avatarAdmin">
        <img
          src={avatarUrl}
          alt="avatar"
          className="avatarAdminInfo"
          onError={(e) => {
            e.target.src = avatar; // Thay đổi src nếu không tải được
          }}
        />
      </div>
      <div className="fullNameAdmin">{user?.fullname}</div>
    </div>
  );
}

export default HeaderAdmin;
