import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // Thay đổi từ useHistory thành useNavigate
import "./index.css";

function Submenu() {
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate(); // Khởi tạo navigate

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/category", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Không thể lấy dữ liệu");
        }

        const data = await response.json();
        setCategories(data); // Giả sử `data` là mảng các danh mục
      } catch (error) {
        console.error("Lỗi khi lấy danh mục:", error);
      }
    };

    fetchCategories();
  }, []);

  const handleCategoryClick = (categoryName) => {
    const encodedCategoryName = encodeURIComponent(categoryName);
    navigate(`/documents/category/${encodedCategoryName}`);
  };

  return (
    <div className="listItemMenu">
      {categories.length > 0 ? (
        categories.map((category) => (
          <div
            key={category.id}
            className="itemMenu"
            onClick={() => handleCategoryClick(category.name)} // Thêm sự kiện click
          >
            {category.name}
          </div>
        ))
      ) : (
        <div className="itemMenu">Không có danh mục nào</div>
      )}
    </div>
  );
}

export default Submenu;
