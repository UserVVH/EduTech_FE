import React, { useEffect, useState } from "react";
import { FaStar } from "react-icons/fa";
import { TbClipboardList } from "react-icons/tb";
import { WiTime5 } from "react-icons/wi";
import { LuUser2 } from "react-icons/lu";
import { FiCheckCircle } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import ReactPaginate from "react-paginate";
import Button from "../components/Button";
import { FaEye } from "react-icons/fa";
import "./css/index.css";
import imgDocument from "../assets/itemDocument.png";

function ListDocument() {
  const [documents, setDocuments] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 12;
  const navigate = useNavigate();
  const [sortOrder, setSortOrder] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false); // State for modal visibility

  useEffect(() => {
    fetchDocuments();
  }, [sortOrder]);

  const fetchDocuments = () => {
    const baseURL = "http://localhost:8080/api/documents";
    const url =
      sortOrder === "view"
        ? `${baseURL}/sorted?sortBy=view&order=asc`
        : sortOrder === "view_desc"
        ? `${baseURL}/sorted?sortBy=view&order=desc`
        : sortOrder === "createdAt"
        ? `${baseURL}/sorted?sortBy=createdAt&order=desc`
        : sortOrder === "createdAt_asc"
        ? `${baseURL}/sorted?sortBy=createdAt&order=asc`
        : sortOrder === "a_to_z"
        ? `${baseURL}/sorted?sortBy=title&order=asc`
        : sortOrder === "z_to_a"
        ? `${baseURL}/sorted?sortBy=title&order=desc`
        : baseURL;

    fetch(url)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        setDocuments(data);
      })
      .catch((error) => console.error("Error fetching documents:", error));
  };

  const handleItemClick = (id) => {
    navigate(`/documents/${id}`);
  };

  const handlePageClick = ({ selected }) => {
    setCurrentPage(selected);
  };

  const handleShowAllDocuments = () => {
    setSortOrder("");
    setCurrentPage(0);
  };

  const offset = currentPage * itemsPerPage;
  const currentDocuments = documents.slice(offset, offset + itemsPerPage);

  const handleSortChange = (order) => {
    setSortOrder(order);
    setCurrentPage(0);
    setIsModalOpen(false);
  };

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
    <div className="containerListDocument">
      <div className="titleListDocument">Tất cả các tài liệu</div>
      <div className="containerSort">
        <div className="titleSort">Sắp xếp theo</div>
        <div className="filterContainer">
          <Button
            className="buttonSort"
            onClick={() => handleSortChange("view_desc")}
          >
            Xem nhiều nhất
          </Button>
          <Button
            className="buttonSort"
            onClick={() => handleSortChange("view")}
          >
            Xem ít nhất
          </Button>
          <Button className="buttonSort" onClick={() => setIsModalOpen(true)}>
            Xem thêm sắp xếp
          </Button>
        </div>
      </div>
      {isModalOpen && (
        <div className="modalOverlay">
          <div className="sortModal">
            <h2 className="titleSortDocument">Sắp xếp</h2>
            {/* <Button
              className="buttonSort"
              onClick={() => handleSortChange("view_desc")}
            >
              Xem nhiều nhất
            </Button>
            <Button
              className="buttonSort"
              onClick={() => handleSortChange("view")}
            >
              Xem ít nhất
            </Button> */}
            <Button
              className="buttonSortToast"
              onClick={() => handleSortChange("createdAt")}
            >
              Ngày tạo mới nhất
            </Button>
            <Button
              className="buttonSortToast"
              onClick={() => handleSortChange("createdAt_asc")}
            >
              Ngày tạo cũ nhất
            </Button>
            <Button
              className="buttonSortToast"
              onClick={() => handleSortChange("a_to_z")}
            >
              Từ A - Z
            </Button>
            <Button
              className="buttonSortToast"
              onClick={() => handleSortChange("z_to_a")}
            >
              Từ Z - A
            </Button>
            <Button
              className="buttonSortToast"
              onClick={() => handleShowAllDocuments()}
            >
              Tất cả
            </Button>
            <Button
              className="buttonClose"
              onClick={() => setIsModalOpen(false)}
            >
              Đóng
            </Button>
          </div>
        </div>
      )}
      <div className="containerListItemDocument">
        {currentDocuments.length > 0 ? (
          currentDocuments.map((doc) => (
            <div
              key={doc.id}
              className="itemDocumentList"
              onClick={() => handleItemClick(doc.id)}
              style={{
                marginBottom: "38%",
              }}
            >
              <img
                src={doc.image}
                alt={doc.title}
                className="imgDocumentList"
                onError={(e) => {
                  e.target.src = imgDocument; // Thay đổi src nếu không tải được
                }}
              />
              <div
                className="listInfo"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-start",
                  gap: "8px",
                  width: "100%",
                }}
              >
                <div
                  className="titleInfo"
                  style={{
                    fontWeight: "bold",
                    fontSize: "18px",
                    minHeight: "48px", // Đảm bảo đồng bộ chiều cao
                    textAlign: "center",
                    overflow: "hidden",
                    display: "-webkit-box",
                    WebkitLineClamp: 2, // Giới hạn 2 dòng
                    WebkitBoxOrient: "vertical",
                    cursor: "pointer", // Con trỏ hiển thị như liên kết
                  }}
                  title={doc.title}
                >
                  {doc.title}
                </div>
                {/* <div className="listItemInfo">
                  <TbClipboardList />
                  Thể loại: {doc.categoryName}
                </div>
                <div className="listItemInfo">
                  <WiTime5 />
                  Thời gian: {doc.relativeCreatedAt}
                </div>
                <div className="listItemInfo">
                  <LuUser2 />
                  {doc.userName}
                </div>
                <div className="listItemInfo">
                  <FaEye />
                  Lượt xem: {doc.view}
                </div>
                <div className="listItemInfoAcp">
                  <FiCheckCircle />

                  {getStatusText(doc.status)}
                </div>
                <div className="star-rating">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <FaStar
                      key={star}
                      className={`star ${star <= 5 ? "filled" : ""}`}
                    />
                  ))}
                </div> */}
                <div
                  className="listItemInfo"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    fontSize: "14px",
                    color: "#555",
                    justifyContent: "flex-start",
                    textAlign: "left",
                  }}
                >
                  <TbClipboardList />
                  <span>Thể loại: {doc.categoryName}</span>
                </div>

                <div
                  className="listItemInfo"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    fontSize: "14px",
                    color: "#555",
                    justifyContent: "flex-start",
                    textAlign: "left",
                  }}
                >
                  <WiTime5 />
                  <span>Thời gian: {doc.relativeCreatedAt}</span>
                </div>

                <div
                  className="listItemInfo"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    fontSize: "14px",
                    color: "#555",
                    justifyContent: "flex-start",
                    textAlign: "left",
                  }}
                >
                  <LuUser2 />
                  <span>{doc.userName}</span>
                </div>

                <div
                  className="listItemInfo"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    fontSize: "14px",
                    color: "#555",
                    justifyContent: "flex-start",
                    textAlign: "left",
                  }}
                >
                  <FaEye />
                  <span>Lượt xem: {doc.view}</span>
                </div>

                <div
                  className="listItemInfoAcp"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    width: "100%",
                  }}
                >
                  <FiCheckCircle />
                  <span>{getStatusText(doc.status)}</span>
                </div>

                <div
                  className="star-rating"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    width: "100%",
                  }}
                >
                  {[1, 2, 3, 4, 5].map((star) => (
                    <FaStar
                      key={star}
                      className={`star ${star <= 5 ? "filled" : ""}`}
                    />
                  ))}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div>Không có tài liệu nào.</div>
        )}
      </div>
      <ReactPaginate
        previousLabel={"←"}
        nextLabel={" →"}
        breakLabel={"..."}
        pageCount={Math.ceil(documents.length / itemsPerPage)}
        marginPagesDisplayed={2}
        pageRangeDisplayed={5}
        onPageChange={handlePageClick}
        containerClassName={"pagination"}
        activeClassName={"active"}
      />
    </div>
  );
}

export default ListDocument;
