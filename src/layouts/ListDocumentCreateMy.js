import React, { useEffect, useState } from "react";
import { TbClipboardList } from "react-icons/tb";
import { WiTime5 } from "react-icons/wi";
import { LuUser2 } from "react-icons/lu";
import { FiCheckCircle } from "react-icons/fi";
import ReactPaginate from "react-paginate";
import { FaStar, FaEye } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import imgDocument from "../assets/itemDocument.png";

function ListDocumentCreateMy() {
  const [documents, setDocuments] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [documentsPerPage] = useState(12); // số lượng tài liệu trên mỗi trang
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const authToken = localStorage.getItem("authToken"); // Lấy authToken từ localStorage
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDocuments = async () => {
      if (!authToken) {
        setError("Auth token is missing. Please log in.");
        return;
      }
      setLoading(true);
      try {
        const response = await fetch(
          "http://localhost:8080/api/documents/my/created",
          {
            method: "GET",
            headers: {
              Authorization: `${authToken}`,
            },
          }
        );
        if (!response.ok) {
          throw new Error(`Error fetching documents: ${response.status}`);
        }
        const data = await response.json();
        setDocuments(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchDocuments();
  }, [authToken]);

  const handleItemClick = (id) => {
    navigate(`/documents/${id}`);
  };

  const handlePageClick = ({ selected }) => {
    setCurrentPage(selected);
  };

  const pageCount = Math.ceil(documents.length / documentsPerPage);
  const displayedDocuments = documents.slice(
    currentPage * documentsPerPage,
    (currentPage + 1) * documentsPerPage
  );

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
      <div className="titleListUser">Danh sách tài liệu chờ duyệt</div>
      {loading ? (
        <div className="loadingDocument">Loading...</div>
      ) : error ? (
        <div className="error">{error}</div>
      ) : documents.length === 0 ? (
        <div className="loadingDocument">Không có tài liệu nào.</div>
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
                    e.target.src = imgDocument; // Thay đổi src nếu không tải được
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

export default ListDocumentCreateMy;
