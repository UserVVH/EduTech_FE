import React, { useEffect, useState } from "react";
import { Carousel } from "antd";
import imgDocument from "../../assets/itemDocument.png"; // Use a default image if necessary
import { TbClipboardList } from "react-icons/tb";
import { WiTime5 } from "react-icons/wi";
import { LuUser2 } from "react-icons/lu";
import { FiCheckCircle } from "react-icons/fi";
import { FaStar, FaEye } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "antd/dist/reset.css";
import "./index.css";

const Slider = () => {
  const [items, setItems] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch data from the new API endpoint with authToken
    const fetchDocuments = async () => {
      try {
        const authToken = localStorage.getItem("authToken"); // Get authToken from localStorage

        const response = await fetch(
          "http://localhost:8080/api/documents/top-10-most-viewed",
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `${authToken}`, // Add the auth token to the request
            },
          }
        );

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const data = await response.json();
        // Sort by views and get the top 10 items
        // const topViewedItems = data
        //   .sort((a, b) => b.views - a.views) // Sort by views descending
        //   .slice(0, 10); // Get top 10 items
        //   setItems(topViewedItems);
        setItems(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchDocuments();
  }, []);

  const handleItemClick = (id) => {
    navigate(`/documents/${id}`);
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
    <div className="banner-container">
      <Carousel
        autoplay
        slidesToShow={3}
        slidesToScroll={1}
        dots={false}
        infinite={true}
        autoplaySpeed={3000}
        speed={1000}
        style={{
          lineHeight: 1.3,
        }}
      >
        {items.map((item, index) => (
          // <div
          //   key={index}
          //   className="itemDocumentHome"
          //   onClick={() => handleItemClick(item.id)}
          //   style={{ cursor: "pointer" }}
          // >
          //   <img
          //     src={item.image || imgDocument}
          //     alt={item.title}
          //     className="imgDocumentHome"
          //     onError={(e) => {
          //       e.target.src = imgDocument; // Thay đổi src nếu không tải được
          //     }}
          //   />
          //   <div className="listInfo">
          //     <div className="titleInfo">{item.title}</div>
          //     <div className="listItemInfo">
          //       <TbClipboardList />
          //       Thể loại: {item.categoryName}
          //     </div>
          //     <div className="listItemInfo">
          //       <WiTime5 />
          //       Thời gian: {item.relativeCreatedAt}
          //     </div>
          //     <div className="listItemInfo">
          //       <LuUser2 />
          //       {item.userName}
          //     </div>
          //     <div className="listItemInfo">
          //       <FaEye />
          //       <span className="titleView">Lượt xem: {item.view}</span>
          //     </div>
          //     <div className="listItemInfoAcp">
          //       <FiCheckCircle />
          //       {getStatusText(item.status)}
          //     </div>
          //     <div className="star-rating">
          //       {[1, 2, 3, 4, 5].map((star) => (
          //         <FaStar
          //           key={star}
          //           className={`star ${star <= 5 ? "filled" : ""}`}
          //         />
          //       ))}
          //     </div>
          //   </div>
          // </div>
          // <div
          //   key={index}
          //   className="itemDocumentHome"
          //   onClick={() => handleItemClick(item.id)}
          //   style={{
          //     cursor: "pointer",
          //     display: "flex",
          //     flexDirection: "column",
          //     alignItems: "center",
          //     justifyContent: "space-between",
          //     textAlign: "center",
          //     border: "1px solid #ddd",
          //     borderRadius: "8px",
          //     boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
          //     padding: "16px",
          //     backgroundColor: "#fff",
          //     height: "100%",
          //     minHeight: "300px",
          //     maxWidth: "300px",
          //     margin: "10px",
          //     overflow: "hidden",
          //   }}
          // >
          //   <img
          //     src={item.image || imgDocument}
          //     alt={item.title}
          //     className="imgDocumentHome"
          //     onError={(e) => {
          //       e.target.src = imgDocument; // Thay đổi src nếu không tải được
          //     }}
          //     style={{
          //       width: "100%",
          //       height: "150px",
          //       objectFit: "cover",
          //       borderRadius: "8px",
          //     }}
          //   />
          //   <div
          //     className="listInfo"
          //     style={{
          //       display: "flex",
          //       flexDirection: "column",
          //       gap: "8px",
          //       marginTop: "10px",
          //     }}
          //   >
          //     <div
          //       className="titleInfo"
          //       style={{
          //         fontWeight: "bold",
          //         fontSize: "16px",
          //         color: "#333",
          //       }}
          //     >
          //       {item.title}
          //     </div>
          //     <div
          //       className="listItemInfo"
          //       style={{
          //         display: "flex",
          //         alignItems: "center",
          //         fontSize: "14px",
          //         color: "#555",
          //       }}
          //     >
          //       <TbClipboardList style={{ marginRight: "5px" }} />
          //       Thể loại: {item.categoryName}
          //     </div>
          //     <div
          //       className="listItemInfo"
          //       style={{ fontSize: "14px", color: "#555" }}
          //     >
          //       <WiTime5 style={{ marginRight: "5px" }} />
          //       Thời gian: {item.relativeCreatedAt}
          //     </div>
          //     <div
          //       className="listItemInfo"
          //       style={{ fontSize: "14px", color: "#555" }}
          //     >
          //       <LuUser2 style={{ marginRight: "5px" }} />
          //       {item.userName}
          //     </div>
          //     <div
          //       className="listItemInfo"
          //       style={{ fontSize: "14px", color: "#555" }}
          //     >
          //       <FaEye style={{ marginRight: "5px" }} />
          //       <span className="titleView">Lượt xem: {item.view}</span>
          //     </div>
          //     <div
          //       className="listItemInfoAcp"
          //       style={{
          //         display: "flex",
          //         alignItems: "center",
          //         fontSize: "14px",
          //       }}
          //     >
          //       <FiCheckCircle style={{ marginRight: "5px" }} />
          //       {getStatusText(item.status)}
          //     </div>
          //     <div
          //       className="star-rating"
          //       style={{
          //         display: "flex",
          //         justifyContent: "center",
          //         gap: "4px",
          //         marginTop: "8px",
          //       }}
          //     >
          //       {[1, 2, 3, 4, 5].map((star) => (
          //         <FaStar
          //           key={star}
          //           className={`star ${star <= 5 ? "filled" : ""}`}
          //         />
          //       ))}
          //     </div>
          //   </div>
          // </div>

          <div
            key={index}
            className="itemDocumentHome"
            onClick={() => handleItemClick(item.id)}
            style={{
              cursor: "pointer",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "space-between",
              textAlign: "center",
              border: "1px solid #ddd",
              borderRadius: "8px",
              boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
              backgroundColor: "#fff",
              minHeight: "400px", // Đặt chiều cao cố định
              maxWidth: "300px",
              margin: "10px",
              overflow: "hidden",
            }}
          >
            <img
              src={item.image || imgDocument}
              alt={item.title}
              className="imgDocumentHome"
              onError={(e) => {
                e.target.src = imgDocument; // Thay đổi src nếu không tải được
              }}
              style={{
                width: "100%",
                height: "180px", // Giữ chiều cao cố định
                objectFit: "cover",
                borderRadius: "8px",
              }}
            />

            <div
              className="listInfo"
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "8px",
                marginTop: "10px",
                flexGrow: 1, // Cho phép thẻ chiếm phần còn lại của chiều cao
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
                className="listItemInfo"
                style={{
                  display: "flex",
                  alignItems: "center",
                  fontSize: "14px",
                  color: "#555",
                  justifyContent: "flex-start",
                  textAlign: "left",
                  height: "40px", // Đặt chiều cao cố định
                }}
              >
                <TbClipboardList
                  style={{ marginRight: "8px", flexShrink: 0 }}
                />
                <span>Thể loại: {item.categoryName}</span>
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
                  height: "40px", // Đặt chiều cao cố định
                }}
              >
                <WiTime5 style={{ marginRight: "8px", flexShrink: 0 }} />
                <span>Thời gian: {item.relativeCreatedAt}</span>
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
                  height: "40px", // Đặt chiều cao cố định
                }}
              >
                <LuUser2 style={{ marginRight: "8px", flexShrink: 0 }} />
                <span>{item.userName}</span>
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
                  height: "40px", // Đặt chiều cao cố định
                }}
              >
                <FaEye style={{ marginRight: "8px", flexShrink: 0 }} />
                <span>Lượt xem: {item.view}</span>
              </div>
              <div
                className="listItemInfoAcp"
                style={{
                  display: "flex",
                  alignItems: "center",
                  fontSize: "14px",
                  height: "40px", // Đặt chiều cao cố định
                }}
              >
                <FiCheckCircle style={{ marginRight: "8px", flexShrink: 0 }} />
                <span>{getStatusText(item.status)}</span>
              </div>
              <div
                className="star-rating"
                style={{
                  display: "flex",
                  justifyContent: "center",
                  gap: "4px",
                  marginTop: "8px",
                  height: "40px", // Đặt chiều cao cố định
                }}
              >
                {[1, 2, 3, 4, 5].map((star) => (
                  <FaStar
                    key={star}
                    className={`star ${star <= 5 ? "filled" : ""}`}
                    style={{ height: "100%" }}
                  />
                ))}
              </div>
            </div>
          </div>
        ))}
      </Carousel>
    </div>
  );
};

export default Slider;
