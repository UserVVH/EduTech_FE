import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FaStar } from "react-icons/fa";
import ReactPaginate from "react-paginate";
import imgDocument from "../assets/itemDocument.png";
import { TbClipboardList } from "react-icons/tb";
import { WiTime5 } from "react-icons/wi";
import { LuUser2 } from "react-icons/lu";
import { FiCheckCircle } from "react-icons/fi";
import { FaEye } from "react-icons/fa";
import { Tooltip } from "antd";

function DetailSearch() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [searchInput, setSearchInput] = useState(""); // New state for search input
  const navigate = useNavigate();
  const location = useLocation();
  const itemsPerPage = 12;

  // Get search parameters from the URL
  const queryParams = new URLSearchParams(location.search);
  const searchTerm = queryParams.get("searchText");
  const searchType = queryParams.get("type");

  useEffect(() => {
    if (searchTerm) {
      setSearchInput(searchTerm); // Initialize input with searchTerm from URL
      handleSearch(searchTerm);
    }
  }, [searchTerm]);

  const handleSearch = async (term) => {
    if (!term) return;

    setLoading(true);
    setError("");
    setCurrentPage(0);

    try {
      const query = new URLSearchParams({
        searchText: term,
        type: searchType || "title,user,category",
      }).toString();
      const response = await fetch(`http://localhost:8080/api/search?${query}`);

      if (!response.ok) {
        throw new Error("Có lỗi xảy ra khi tìm kiếm");
      }
      const data = await response.json();
      const combinedResults = [
        ...(data.documentsByTitle || []),
        // ...(data.documentsByCategory || []),
      ];
      setResults(combinedResults);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const offset = currentPage * itemsPerPage;
  const currentItems = results.slice(offset, offset + itemsPerPage);

  const handlePageClick = (data) => {
    setCurrentPage(data.selected);
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

  const handleItemClick = (id) => {
    navigate(`/documents/${id}`);
  };

  const handleInputChange = (e) => {
    setSearchInput(e.target.value);
  };

  const handleSearchSubmit = () => {
    handleSearch(searchInput);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearchSubmit();
    }
  };

  return (
    <div className="containerSearch">
      <div className="listItemSearch">
        <div className="titleDetailSearch">Tìm Kiếm</div>
        <div className="containerDetailSearch">
          <input
            type="text"
            value={searchInput}
            onChange={handleInputChange} // Update input value on change
            onKeyDown={handleKeyDown} // Trigger search on Enter key press
            placeholder="Nhập tên tài liệu hoặc thể loại..."
            className="inputDetailSearch"
          />
          <button onClick={handleSearchSubmit} className="btnDetailSearch">
            Tìm kiếm
          </button>
        </div>
      </div>

      <div className="containerListResult">
        <div className="listResult">
          {loading ? (
            <div className="titleLoading">Đang tìm kiếm...</div>
          ) : results.length === 0 && searchTerm ? (
            <div className="titleSearchNo">
              Không có tài liệu nào phù hợp với tìm kiếm của bạn.
            </div>
          ) : (
            currentItems.map((item) => (
              <div
                key={item.id}
                className="itemDetailSearch"
                onClick={() => handleItemClick(item.id)}
                style={{
                  marginBottom: "38%",
                  cursor: "pointer",
                  height: "584px",
                  overflow: "hidden",
                }}
              >
                <img
                  src={item.image}
                  alt={item.title}
                  className="imgDetailSearch"
                  style={{ width: "100%" }}
                  onError={(e) => {
                    e.target.src = imgDocument;
                  }}
                />
                <div
                  className="listInfoDetailSearch"
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start",
                    gap: "8px",
                    width: "100%",
                  }}
                >
                  <Tooltip title={item.title}>
                    <div
                      className="titleInfo"
                      style={{
                        fontWeight: "bold",
                        fontSize: "18px",
                        minHeight: "48px",
                        textAlign: "center",
                        overflow: "hidden",
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        width: "100%",
                      }}
                    >
                      {item.title.split(" ").slice(0, 3).join(" ") + "..."}
                    </div>
                  </Tooltip>
                  <div className="listItemInfo">
                    <TbClipboardList />
                    Thể loại: {item.categoryName}
                  </div>
                  <div className="listItemInfo">
                    <WiTime5 />
                    Thời gian: {item.relativeCreatedAt}
                  </div>
                  <div className="listItemInfo">
                    <LuUser2 />
                    {item.userName}
                  </div>
                  <div className="listItemInfo">
                    <FaEye />
                    <span className="titleView">Lượt xem: {item.view}</span>
                  </div>
                  <div className="listItemInfoAcp" style={{ width: "100%" }}>
                    <FiCheckCircle />
                    {getStatusText(item.status)}
                  </div>
                  <div
                    className="star-rating"
                    style={{ margin: "0px", width: "100%" }}
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
          )}
        </div>
      </div>

      <ReactPaginate
        previousLabel={"←"}
        nextLabel={" →"}
        breakLabel={"..."}
        pageCount={Math.ceil(results.length / itemsPerPage)}
        marginPagesDisplayed={2}
        pageRangeDisplayed={5}
        onPageChange={handlePageClick}
        containerClassName={"pagination"}
        activeClassName={"active"}
      />
    </div>
  );
}

export default DetailSearch;
