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
        const topViewedItems = data
          .sort((a, b) => b.views - a.views) // Sort by views descending
          .slice(0, 10); // Get top 10 items
        setItems(topViewedItems);
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
        slidesToShow={4}
        slidesToScroll={1}
        dots={false}
        infinite={true}
        autoplaySpeed={3000}
        speed={1000}
      >
        {items.map((item, index) => (
          <div
            key={index}
            className="itemDocumentHome"
            onClick={() => handleItemClick(item.id)}
            style={{ cursor: "pointer" }}
          >
            <img
              src={item.image || imgDocument}
              alt={item.title}
              className="imgDocumentHome"
              onError={(e) => {
                e.target.src = imgDocument; // Thay đổi src nếu không tải được
              }}
            />
            <div className="listInfo">
              <div className="titleInfo">{item.title}</div>
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
              <div className="listItemInfoAcp">
                <FiCheckCircle />
                {getStatusText(item.status)}
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
      </Carousel>
    </div>
  );
};

export default Slider;
