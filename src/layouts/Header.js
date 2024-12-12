import React from "react";
import { HiOutlineUserCircle } from "react-icons/hi2";
import { LiaHourglassEndSolid } from "react-icons/lia";
import { IoMdCheckmarkCircleOutline } from "react-icons/io";
import "./css/index.css";
import { useNavigate } from "react-router-dom";

function Header() {
  const navigate = useNavigate();
  return (
    <div className="containerHeaderLittle">
      <div className="itemHeader" onClick={() => navigate("/user")}>
        <HiOutlineUserCircle className="icon" />
        Hồ sơ của bạn
      </div>
      <div
        className="itemHeader"
        onClick={() => navigate("/listdocumentcreatemy")}
      >
        <LiaHourglassEndSolid className="icon" />
        Tài liệu đang chờ của bạn
      </div>
      <div
        className="itemHeader"
        onClick={() => navigate("/listdocumentverifiedmy")}
      >
        <IoMdCheckmarkCircleOutline className="icon" />
        Tài liệu đã được duyệt của bạn
      </div>
    </div>
  );
}

export default Header;
