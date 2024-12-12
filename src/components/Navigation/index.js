import React, { useEffect } from "react";
import logo from "../../assets/logo2.png";
import { FaSearch } from "react-icons/fa";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../Redux/actions/authActions";
import "../Navigation/index.css";
import { RiLogoutCircleRFill } from "react-icons/ri";
import { FaUser } from "react-icons/fa";
import { MdAdminPanelSettings } from "react-icons/md";
import defaultAvatar from "../../assets/iconAva.png";

function Navigation() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [dropdownOpen, setDropdownOpen] = React.useState(false); // State to manage dropdown visibility

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  const handleSearch = () => {
    if (searchTerm.trim()) {
      navigate(
        `/detailsearch?searchText=${encodeURIComponent(searchTerm.trim())}&type=title,category`
      );
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const isSearchPage = location.pathname.includes("/detailsearch");

  useEffect(() => {
    if (isSearchPage) {
      setSearchTerm("");
    }
  }, [isSearchPage]);

  const toggleDropdown = () => {
    setDropdownOpen((prev) => !prev);
  };

  return (
    <div className="containerNav">
      <img
        src={logo}
        alt="logo"
        className="imgLogo"
        onClick={() => navigate("/")}
      />
      <div className="containerItem" onClick={() => navigate("/listDocument")}>
        Tài liệu
      </div>
      <div
        className="containerItem"
        onClick={() => {
          if (isAuthenticated) {
            navigate("/createdocuments");
          } else {
            navigate("/login");
          }
        }}
      >
        Tạo tài liệu
      </div>
      <div className="containerItem" onClick={() => navigate("/about")}>
        Giới thiệu
      </div>
      <div className="containerItem" onClick={() => navigate("/listuser")}>
        Người dùng
      </div>
      <div className="inputContainer">
        <input
          type="text"
          placeholder="Tìm kiếm..."
          className="inputSearch"
          value={searchTerm}
          onKeyDown={handleKeyDown}
          onChange={(e) => setSearchTerm(e.target.value)}
          disabled={isSearchPage}
          style={{
            opacity: isSearchPage ? 0.5 : 1,
            cursor: isSearchPage ? "not-allowed" : "text",
          }}
        />
        <FaSearch
          className="searchIcon"
          onClick={handleSearch}
          style={{ cursor: "pointer" }}
        />
      </div>
      {isAuthenticated ? (
        <div className="userSection" onClick={toggleDropdown} tabIndex={0}>
          <img
            src={user?.avatar || defaultAvatar}
            alt="avatar"
            className="avatarNav"
            onError={(e) => {
              e.target.src = defaultAvatar;
            }}
          />
          <span className="userName">{user.fullname || "User"}</span>
          {dropdownOpen && (
            <div className="dropdownMenu">
              <div className="dropdownItem" onClick={() => navigate("/user")}>
                <div className="itemDropdown">
                  <FaUser className="iconUser" />
                  <span className="ml">Hồ sơ của tôi</span>
                </div>
              </div>
              {user.role === "ADMIN" && (
                <div
                  className="dropdownItem"
                  onClick={() => navigate("/admin")}
                >
                  <div className="itemDropdown">
                    <MdAdminPanelSettings className="iconAdminManage" />
                    <span className="ml">Quản lí ADMIN</span>
                  </div>
                </div>
              )}
              <div className="dropdownItem" onClick={handleLogout}>
                <div className="itemDropdown">
                  <RiLogoutCircleRFill className="iconLogout" />
                  <span className="ml">Đăng xuất</span>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        <>
          <div className="containerItem" onClick={() => navigate("/login")}>
            Đăng nhập
          </div>
          <div className="containerItem" onClick={() => navigate("/register")}>
            Đăng ký
          </div>
        </>
      )}
    </div>
  );
}

export default Navigation;
