import React, { useEffect, useState } from "react";
import NavBar from "../../components/Admin/NavBar/NavBar";
import { FaUser } from "react-icons/fa6";
import { FiSearch } from "react-icons/fi";
import "./css/index.css";
import { useNavigate } from "react-router-dom";
import HeaderAdmin from "../../components/Admin/HeaderAdmin/HeaderAdmin";
import { ToastContainer } from "react-toastify";

function AdminManageCategory() {
  const [categories, setCategories] = useState([]); // State to hold categories
  const [loading, setLoading] = useState(true); // State for loading status
  const [error, setError] = useState(null); // State for error handling
  const navigate = useNavigate();

  // Function to fetch categories
  const fetchCategories = async () => {
    const authToken = localStorage.getItem("authToken");
    if (!authToken) {
      navigate("/login");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        "http://localhost:8080/api/admin/categories",
        {
          headers: {
            Authorization: `${authToken}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch categories");
      }

      const data = await response.json();
      setCategories(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const deleteCategory = async (categoryId) => {
    const authToken = localStorage.getItem("authToken");
    if (!authToken) {
      navigate("/login");
      return;
    }

    if (window.confirm("Bạn có chắc chắn muốn xoá thể loại này?")) {
      // Confirmation dialog
      try {
        const response = await fetch(
          `http://localhost:8080/api/admin/categories/${categoryId}`,
          {
            method: "DELETE",
            headers: {
              Authorization: `${authToken}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to delete category");
        }

        // Refetch categories after successful deletion
        fetchCategories();
      } catch (err) {
        setError(err.message);
      }
    }
  };

  // Fetch categories when the component mounts
  useEffect(() => {
    fetchCategories();
  }, [navigate]);

  const handleAdminCreateCategoryClick = () => {
    navigate("/admin/adminCreateCategory");
  };

  const handleAdminUpdateCategoryClick = (categoryId) => {
    navigate(`/admin/adminUpdateCategory/${categoryId}`);
  };

  return (
    <div className="containerAdminManageCategory">
      <div className="leftAdminManageCategory">
        <NavBar />
      </div>
      <div className="rightAdminManageCategory">
        <HeaderAdmin />
        <div className="containerInfoDocument">
          <div className="containerSearchAdmin">
            <span className="titleInfoAdmin">
              <FaUser className="iconUser" />
              <span className="titleInfo">Quản lí thể loại</span>
            </span>
            <div className="searchDocumentAdmin">
              <button
                className="btnAddAdmin"
                onClick={handleAdminCreateCategoryClick}
              >
                Thêm
              </button>
            </div>
          </div>
          <div className="infoDocumentAdmin">
            <table className="documentTable">
              <thead>
                <tr>
                  <th>STT</th>
                  <th>Tên thể loại</th>
                  <th>Chức năng</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="5">Loading...</td>
                  </tr>
                ) : error ? (
                  <tr>
                    <td colSpan="5">{error}</td>
                  </tr>
                ) : (
                  categories.map((category, index) => (
                    <tr key={category.id}>
                      <td>{index + 1}</td>
                      <td>{category.name}</td>
                      <td>
                        <button
                          className="btnUpdate"
                          onClick={() =>
                            handleAdminUpdateCategoryClick(category.id)
                          }
                        >
                          Chỉnh sửa
                        </button>
                        <button
                          className="btnDelete"
                          onClick={() => deleteCategory(category.id)}
                        >
                          Xoá
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
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

export default AdminManageCategory;
