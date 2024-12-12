import React, { useEffect, useState } from "react";
import { TbClipboardList } from "react-icons/tb";
import { WiTime5 } from "react-icons/wi";
import { LuUser2 } from "react-icons/lu";
import { FiCheckCircle } from "react-icons/fi";
import ReactPaginate from "react-paginate";
import { useNavigate, useParams } from "react-router-dom";
import { FaStar, FaEye } from "react-icons/fa";
import imgDocument from "../assets/itemDocument.png";
import defaultAvatar from "../assets/iconAva.png";

function ListDocumentVerified() {
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [documentsPerPage] = useState(12);
  const navigate = useNavigate();
  const [role, setRole] = useState("");

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await fetch(
          `http://localhost:8080/api/user/${userId}`
        );
        if (!response.ok) throw new Error("Failed to fetch user information");
        const data = await response.json();
        setUser(data);
      } catch (err) {
        setError(err.message);
      }
    };

    const fetchDocuments = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `http://localhost:8080/api/documents/user/${userId}/verified`
        );
        if (!response.ok) throw new Error("Failed to fetch documents");
        const data = await response.json();
        setDocuments(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserInfo();
    fetchDocuments();
  }, [userId]);

  useEffect(() => {
    if (user) {
      setRole(() => {
        if (user.role === "ADMIN") {
          return "ADMIN";
        } else if (user.identifier?.startsWith("SV")) {
          return "Sinh Viên";
        } else if (user.identifier?.startsWith("GV")) {
          return "Giảng Viên";
        } else {
          return "Người Dùng";
        }
      });
    }
  }, [user]);

  const pageCount = Math.ceil(documents.length / documentsPerPage);
  const displayedDocuments = documents.slice(
    currentPage * documentsPerPage,
    (currentPage + 1) * documentsPerPage
  );

  const handlePageClick = ({ selected }) => {
    setCurrentPage(selected);
  };

  const handleItemClick = (id) => {
    navigate(`/documents/${id}`);
  };

  const avatarUrl = user?.avatar || defaultAvatar;

  const getStatusText = (status) => {
    switch (status) {
      case "VERIFIED":
        return "Đã duyệt";
      case "CREATED":
        return "Chưa duyệt";
      case "REJECTED":
        return "Từ chối";
      default:
        return status;
    }
  };

  return (
    <div className="containerListDocumentCreate">
      {user ? (
        <div className="formUser">
          <div className="avatarContainer">
            <img
              src={avatarUrl}
              alt="avatar"
              className="avatar"
              onError={(e) => {
                e.target.src = defaultAvatar;
              }}
            />
            <div className="titleRole">{role || "Người Dùng"}</div>
          </div>
          <div className="titleNameUser">{user.fullname || "Tên"}</div>

          <div className="titleEmailUser">Email: {user.email || "Email"}</div>
          <div className="titleAddreesUser">
            Địa chỉ: {user.address || "Không có"}
          </div>
        </div>
      ) : (
        <p>Loading user information...</p>
      )}

      <div className="titleListUser">Danh sách tài liệu</div>

      {loading ? (
        <div className="loadingDocument">Loading...</div>
      ) : error ? (
        <div className="error">{error}</div>
      ) : documents.length === 0 ? (
        <div className="loadingDocument">Không có tài liệu nào được duyệt.</div>
      ) : (
        <div>
          <div className="containerListUserDocument">
            {displayedDocuments.map((document) => (
              <div
                className="itemDocumentOfUser"
                key={document.id}
                onClick={() => handleItemClick(document.id)}
              >
                <img
                  src={document.image}
                  alt={document.title}
                  className="imgDocument"
                  onError={(e) => {
                    e.target.src = imgDocument;
                  }}
                />
                <div className="listInfo">
                  <div className="titleInfo">{document.title}</div>
                  <div className="listItemInfo">
                    <TbClipboardList />
                    Thể loại: {document.categoryName}
                  </div>
                  <div className="listItemInfo">
                    <WiTime5 />
                    Thời gian: {document.relativeCreatedAt}
                  </div>
                  <div className="listItemInfo">
                    <LuUser2 />
                    {document.userName}
                  </div>
                  <div className="listItemInfo">
                    <FaEye />
                    <span className="titleView">Lượt xem: {document.view}</span>
                  </div>
                  <div className="listItemInfoAcp">
                    <FiCheckCircle />
                    {getStatusText(document.status)}
                  </div>
                  <div className="star-rating">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <FaStar
                        key={star}
                        className={`star ${star <= 5 ? "filled" : ""}`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <ReactPaginate
            previousLabel={"←"}
            nextLabel={" →"}
            breakLabel={"..."}
            pageCount={pageCount}
            marginPagesDisplayed={2}
            pageRangeDisplayed={3}
            onPageChange={handlePageClick}
            containerClassName={"pagination"}
            activeClassName={"active"}
          />
        </div>
      )}
    </div>
  );
}

export default ListDocumentVerified;
