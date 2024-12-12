import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Submenu from "../components/Submenu";
import "./css/index.css";
import bannerImg from "../assets/Banner/bannerImg.png";
import Slider from "../components/Slider";
import Button from "../components/Button";
import { FaStar, FaEye } from "react-icons/fa";
import { TbClipboardList } from "react-icons/tb";
import { WiTime5 } from "react-icons/wi";
import { LuUser2 } from "react-icons/lu";
import { FiCheckCircle } from "react-icons/fi";
import imgDocument from "../assets/itemDocument.png";

function Home() {
  const [items, setItems] = useState([]);
  const [showAll, setShowAll] = useState(false); // State to control visibility of all items
  const navigate = useNavigate();

  // Fetch documents from the new API endpoint
  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        // Retrieve the auth token from localStorage
        const authToken = localStorage.getItem("authToken");

        const response = await fetch(
          "http://localhost:8080/api/documents/top-10-newest",
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `${authToken}`, // Add Authorization header
            },
          }
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setItems(data);
      } catch (error) {
        console.error("Failed to fetch documents:", error);
      }
    };

    fetchDocuments();
  }, []);

  const handleItemClick = (id) => {
    navigate(`/documents/${id}`);
  };

  const toggleShowAll = () => {
    setShowAll(!showAll);
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
    <div className="containerHome">
      <Submenu />
      <div className="containerImg">
        <div className="bannerImg">
          <img src={bannerImg} alt="bannerImg" />
        </div>
      </div>
      <div className="titleHome">Tài Liệu Nổi Bật</div>
      <Slider />
      <div className="titleHomeNew">Tài Liệu Mới</div>
      <div className="containerList">
        {items.length > 0 ? (
          (showAll ? items : items.slice(0, 8)).map((item) => (
            // <div
            //   key={item.id}
            //   className="itemHome"
            //   onClick={() => handleItemClick(item.id)}
            // >
            //   <img
            //     src={item.image || imgDocument}
            //     alt={item.title}
            //     className="imgHomeNew"
            //     onError={(e) => {
            //       e.target.src = imgDocument; // Thay đổi src nếu không tải được
            //     }}
            //   />
            //   <div className="listInfoHome">
            //     <div className="titleInfo">{item.title}</div>
            //     <div className="listItemInfoHome">
            //       <TbClipboardList />
            //       Thể loại: {item.categoryName}
            //     </div>
            //     <div className="listItemInfoHome">
            //       <WiTime5 />
            //       Thời gian: {item.relativeCreatedAt}
            //     </div>
            //     <div className="listItemInfoHome">
            //       <LuUser2 />
            //       <span className="titleHomeUser">{item.userName}</span>
            //     </div>
            //     <div className="listItemInfoHome">
            //       <FaEye />
            //       <span className="titleView">Lượt xem: {item.view}</span>
            //     </div>
            //     <div className="listItemInfoAcpHome">
            //       <FiCheckCircle />
            //       <span className="titleApproved">
            //         {" "}
            //         {getStatusText(item.status)}
            //       </span>
            //     </div>
            //     <div className="star-rating">
            //       {[1, 2, 3, 4, 5].map((star) => (
            //         <FaStar
            //           key={star}
            //           className={`star ${star <= item.rating ? "filled" : ""}`}
            //         />
            //       ))}
            //     </div>
            //   </div>
            // </div>

            <div
              key={item.id}
              className="itemHome"
              onClick={() => handleItemClick(item.id)}
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                alignItems: "center",
                border: "1px solid #ddd",
                borderRadius: "8px",
                padding: "16px",
                boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                backgroundColor: "#fff",
                height: "100%",
                maxWidth: "300px",
              }}
            >
              <img
                src={item.image || imgDocument}
                alt={item.title}
                style={{
                  width: "100%",
                  height: "250px",
                  objectFit: "cover",
                  borderRadius: "8px",
                }}
                onError={(e) => {
                  e.target.src = imgDocument; // Thay đổi src nếu không tải được
                }}
              />
              <div
                className="listInfoHome"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  flexGrow: 1,
                  width: "100%",
                  marginTop: "16px",
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
                  title={item.title} // Tooltip mặc định
                >
                  {item.title}
                </div>

                <div
                  className="listItemInfoHome"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    margin: "8px 0",
                    minHeight: "24px",
                  }}
                >
                  <TbClipboardList style={{ marginRight: "8px" }} />
                  Thể loại: {item.categoryName}
                </div>
                <div
                  className="listItemInfoHome"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    margin: "8px 0",
                    minHeight: "24px",
                  }}
                >
                  <WiTime5 style={{ marginRight: "8px" }} />
                  Thời gian: {item.relativeCreatedAt}
                </div>
                <div
                  className="listItemInfoHome"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    margin: "8px 0",
                    minHeight: "24px",
                  }}
                >
                  <LuUser2 style={{ marginRight: "8px" }} />
                  <span className="titleHomeUser">{item.userName}</span>
                </div>
                <div
                  className="listItemInfoHome"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    margin: "8px 0",
                    minHeight: "24px",
                  }}
                >
                  <FaEye style={{ marginRight: "8px" }} />
                  <span className="titleView">Lượt xem: {item.view}</span>
                </div>
                <div
                  className="listItemInfoAcpHome"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    margin: "8px 0",
                    minHeight: "24px",
                  }}
                >
                  <FiCheckCircle style={{ marginRight: "8px" }} />
                  <span className="titleApproved">
                    {getStatusText(item.status)}
                  </span>
                </div>
                <div
                  className="star-rating"
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    marginTop: "12px",
                  }}
                >
                  {[1, 2, 3, 4, 5].map((star) => (
                    <FaStar
                      key={star}
                      className={`star ${star <= item.rating ? "filled" : ""}`}
                    />
                  ))}
                </div>
              </div>
            </div>
          ))
        ) : (
          <p>Loading...</p>
        )}
      </div>
      {/* See More Button */}
      {items.length > 8 && (
        <Button className="seeMoreButton" onClick={toggleShowAll}>
          {showAll ? "Ẩn bớt" : "Xem thêm"}
        </Button>
      )}
    </div>
  );
}

export default Home;
