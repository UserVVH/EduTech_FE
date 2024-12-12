import React, { useState } from "react";
import "./index.css";
import { AiOutlineLeft, AiOutlineRight } from "react-icons/ai";
import { HiHome } from "react-icons/hi";
import { MdManageAccounts } from "react-icons/md";
import { IoDocumentsOutline } from "react-icons/io5";
import { IoReloadCircle } from "react-icons/io5";
import { IoCheckmarkDoneCircle } from "react-icons/io5";
import { FaUser } from "react-icons/fa6";
import { BiCategory } from "react-icons/bi";
import { GrLogout } from "react-icons/gr";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../../Redux/actions/authActions";
import { MdOutlineCancel } from "react-icons/md";
import { PiUserList } from "react-icons/pi";

function NavBar() {
  const [isExpanded, setIsExpanded] = useState(true);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dispatch = useDispatch();

  const navigate = useNavigate();

  const toggleNavBar = () => {
    setIsExpanded(!isExpanded);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleHomeClick = () => {
    navigate("/");
  };

  const handleAdminHomeClick = () => {
    navigate("/admin");
  };

  const handleAdminUserClick = () => {
    navigate("/admin/adminManageUser");
  };

  const handleAdminAllDocumentClick = () => {
    navigate("/admin/adminAllDocument");
  };

  const handleAdminWaitDocumentClick = () => {
    navigate("/admin/adminWaitDocument");
  };

  const handleAdminApprovedDocumentClick = () => {
    navigate("/admin/adminDocumentApproved");
  };

  const handleAdminDocumentCancelClick = () => {
    navigate("/admin/adminDocumentCancel");
  };

  const handleAdminCategoryClick = () => {
    navigate("/admin/adminManageCategory");
  };
  const handleAdminListUserClick = () => {
    navigate("/admin/adminListUser");
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <div className={`containerNavBar ${isExpanded ? "expanded" : "collapsed"}`}>
      <div className={`navbar`}>
        <div className="navbar-content">
          <div
            className={`itemAdmin ${isExpanded ? "expanded" : "collapsed"}`}
            onClick={handleAdminHomeClick}
          >
            <HiHome />
            {isExpanded && <span className="titleAdminManege">Trang chủ</span>}
          </div>
          <div
            className={`itemAdmin ${isExpanded ? "expanded" : "collapsed"}`}
            onClick={handleAdminUserClick}
          >
            <FaUser />
            {isExpanded && (
              <span className="titleAdminManege">Người dùng tạo tài liệu</span>
            )}
          </div>
          <div
            className={`itemAdmin ${isExpanded ? "expanded" : "collapsed"}`}
            onClick={handleAdminListUserClick}
          >
            <PiUserList />
            {isExpanded && (
              <span className="titleAdminManege">Quản lí người dùng</span>
            )}
          </div>{" "}
          <div
            className={`itemAdmin ${isExpanded ? "expanded" : "collapsed"}`}
            onClick={toggleDropdown}
          >
            <MdManageAccounts />
            {isExpanded && (
              <span className="titleAdminManege">
                <span>Quản lí tài liệu</span>{" "}
                <div className="iconDownUp">
                  {isDropdownOpen ? <FaChevronUp /> : <FaChevronDown />}
                </div>
              </span>
            )}
          </div>
          {isExpanded && isDropdownOpen && (
            <div className="dropdown">
              <div
                className="dropdown-item"
                onClick={handleAdminAllDocumentClick}
              >
                <IoDocumentsOutline />
                <span>Tất cả tài liệu</span>
              </div>
              <div
                className="dropdown-item"
                onClick={handleAdminWaitDocumentClick}
              >
                <IoReloadCircle />
                <span>Tài liệu chờ duyệt</span>
              </div>
              <div
                className="dropdown-item"
                onClick={handleAdminApprovedDocumentClick}
              >
                <IoCheckmarkDoneCircle />
                <span>Tài liệu đã duyệt</span>
              </div>
              <div
                className="dropdown-item"
                onClick={handleAdminDocumentCancelClick}
              >
                <MdOutlineCancel />
                <span>Tài liệu từ chối</span>
              </div>
            </div>
          )}
          <div
            className={`itemAdmin ${isExpanded ? "expanded" : "collapsed"}`}
            onClick={handleAdminCategoryClick}
          >
            <BiCategory />
            {isExpanded && (
              <span className="titleAdminManege">Quản lí thể loại</span>
            )}
          </div>
          <div
            className={`itemAdmin ${isExpanded ? "expanded" : "collapsed"}`}
            onClick={handleHomeClick}
          >
            <HiHome />
            {isExpanded && (
              <span className="titleAdminManege">Về lại trang người dùng</span>
            )}
          </div>
          <div
            className={`itemAdmin ${isExpanded ? "expanded" : "collapsed"}`}
            onClick={handleLogout}
          >
            <GrLogout />
            {isExpanded && <span className="titleAdminManege">Đăng xuất</span>}
          </div>
        </div>
      </div>
      <div className="btn">
        <button
          onClick={toggleNavBar}
          className={`btnLeftRight ${isExpanded ? "expanded" : "collapsed"}`}
        >
          {isExpanded ? <AiOutlineLeft /> : <AiOutlineRight />}
        </button>
      </div>
    </div>
  );
}

export default NavBar;
