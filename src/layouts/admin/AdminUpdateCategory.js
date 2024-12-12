import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./css/index.css";
import NavBar from "../../components/Admin/NavBar/NavBar";
import avatar from "../../assets/iconAva.png";
import { FaUser } from "react-icons/fa6";
import Button from "../../components/Button/index";
import { toast, ToastContainer } from "react-toastify"; // Import toast for notifications

function AdminUpdateCategory() {
  const { id } = useParams(); // Get the category ID from the URL params
  const navigate = useNavigate(); // Initialize useNavigate for navigation
  const [category, setCategory] = useState("");

  // Fetch category data when the component mounts
  useEffect(() => {
    const fetchCategory = async () => {
      const token = localStorage.getItem("authToken"); // Get the token from local storage
      try {
        const response = await fetch(
          `http://localhost:8080/api/admin/categories/${id}`,
          {
            method: "GET",
            headers: {
              Authorization: ` ${token}`, // Include the token in the request
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch category data");
        }

        const data = await response.json();
        setCategory(data.name); // Assuming the response contains a `name` property
      } catch (error) {
        console.error("Error fetching category:", error);
      }
    };

    fetchCategory();
  }, [id]); // Include id in the dependency array

  // Function to handle input change
  const handleInputChange = (e) => {
    setCategory(e.target.value);
  };

  // Function to handle category update
  const handleUpdateCategory = async () => {
    const token = localStorage.getItem("authToken"); // Get the token from local storage

    // Check if the input is empty
    if (category.trim() === "") {
      toast.error("Bạn chưa nhập thông tin!"); // Show error message
      return; // Prevent further execution
    }

    try {
      const response = await fetch(
        `http://localhost:8080/api/admin/categories/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: ` ${token}`, // Include the token in the request
          },
          body: JSON.stringify({ name: category }), // Adjust the body according to your API needs
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update category");
      }

      const data = await response.json();
      console.log("Category updated successfully:", data);

      // Show success toast notification
      toast.success("Cập nhật thể loại thành công!"); // Display success message

      // Delay navigation to category management page
      setTimeout(() => {
        navigate("/admin/adminManageCategory");
      }, 2000);
    } catch (error) {
      console.error("Error updating category:", error);
      // Show error toast notification
      toast.error("Có lỗi xảy ra khi cập nhật thể loại!"); // Display error message
    }
  };

  return (
    <div className="containerAdminUpdateCategory">
      <div className="leftAdminUpdateCategory">
        <NavBar />
      </div>
      <div className="rightAdminUpdateCategory">
        <div className="containerHeaderAdmin">
          <div className="avatarAdmin">
            <img src={avatar} alt="avatar" className="avatarAdminInfo" />
          </div>
          <div className="fullNameAdmin">Admin</div>
        </div>
        <div className="containerInfoDocument">
          <div className="containerSearchAdmin">
            <span className="titleInfoAdmin">
              <FaUser className="iconUser" />
              <span className="titleInfo">Cập nhật thể loại</span>
            </span>
          </div>
          <div className="containerCreateCategory">
            <div className="background">
              <div className="createCategoryInput">
                <input
                  className="inputCreateCategoryAdmin"
                  value={category}
                  onChange={handleInputChange} // Handle input change
                  placeholder="Nhập tên thể loại..." // Optional placeholder
                />
              </div>
              <div className="containerBtn">
                <Button
                  className="btnSendCategory"
                  onClick={handleUpdateCategory}
                >
                  Cập nhật
                </Button>
              </div>
            </div>
          </div>
        </div>
        <ToastContainer
          position="top-center"
          autoClose={3000}
          hideProgressBar={false}
          closeOnClick
          pauseOnHover
          draggable
          pauseOnFocusLoss
        />
      </div>
    </div>
  );
}

export default AdminUpdateCategory;
