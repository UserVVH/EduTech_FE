import React, { useEffect, useState } from "react";
import NavBar from "../../components/Admin/NavBar/NavBar";
import avatar from "../../assets/iconAva.png";
import { FaUser } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import ReactPaginate from "react-paginate";
import "./css/index.css";
import HeaderAdmin from "../../components/Admin/HeaderAdmin/HeaderAdmin";

function AdminManageUser() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const usersPerPage = 10;
  const navigate = useNavigate();

  useEffect(() => {
    const authToken = localStorage.getItem("authToken");
    if (!authToken) {
      navigate("/login");
    }

    const fetchUsers = async () => {
      setLoading(true); // Start loading
      try {
        const response = await fetch(
          "http://localhost:8080/api/user/by-document-count",
          {
            headers: {
              Authorization: `${authToken}`,
            },
          }
        );
        if (!response.ok) throw new Error("Failed to fetch users");
        const data = await response.json();
        setUsers(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false); // Stop loading
      }
    };

    fetchUsers();
  }, [navigate]);

  const handleUserClick = (userId) => {
    navigate(
      `/admin/adminListAllDocument/admin/documents/user/${userId}/verified`
    );
  };

  const handlePageClick = ({ selected }) => {
    setCurrentPage(selected);
  };

  const offset = currentPage * usersPerPage;
  const currentUsers = users.slice(offset, offset + usersPerPage);
  const pageCount = Math.ceil(users.length / usersPerPage);

  return (
    <div className="containerAdminManageUser">
      <div className="leftAdminManageUser">
        <NavBar />
      </div>
      <div className="rightAdminManageUser">
        <HeaderAdmin />
        <div className="containerInfoDocument">
          <div className="containerSearchAdmin">
            <span className="titleInfoAdmin">
              <FaUser className="iconUser" />
              <span className="titleInfo">
                Thông tin người dùng đã tạo tài liệu
              </span>
            </span>
          </div>
          <div className="infoDocumentAdmin">
            <div className="tableContainer">
              {loading ? (
                <div className="loadingAdminManageUser">Loading...</div>
              ) : (
                <table className="documentTable">
                  <thead>
                    <tr>
                      <th>STT</th>
                      <th>Hình ảnh</th>
                      <th>Họ tên</th>
                      <th>Mã số</th>
                      <th>Email</th>
                      <th>Tổng lượt xem</th>
                      <th>Tổng tài liệu</th>
                      <th>Quyền</th>
                      <th>Tài liệu sở hữu</th>
                    </tr>
                  </thead>
                  <tbody>
                    {error ? (
                      <tr>
                        <td colSpan="10">{error}</td>
                      </tr>
                    ) : (
                      currentUsers.map((user, index) => (
                        <tr key={user.userId}>
                          <td>{offset + index + 1}</td>
                          <td>
                            <img
                              src={user.avatar || avatar}
                              alt="User"
                              className="userImage"
                              onError={(e) => {
                                e.target.src = avatar; // Change src if the image fails to load
                              }}
                            />
                          </td>
                          <td>{user.fullname}</td>
                          <td>{user.identifier}</td>
                          <td>{user.email}</td>
                          <td>{user.totalViews}</td>
                          <td>{user.documentCount}</td>
                          <td>
                            <div
                              className="userRoleName"
                              style={{
                                backgroundColor: "rgb(83, 98, 231)",
                                color: "#ffcc00",
                              }}
                            >
                              {user.roleName}
                            </div>
                          </td>
                          <td>
                            <button
                              className="btnOpen"
                              onClick={() => handleUserClick(user.userId)}
                              style={{
                                backgroundColor: "rgb(83, 98, 231)",
                                color: "#ffcc00",
                              }}
                            >
                              Xem
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              )}
            </div>
          </div>
          {pageCount > 1 && !loading && (
            <ReactPaginate
              previousLabel={"←"}
              nextLabel={"→"}
              breakLabel={"..."}
              pageCount={pageCount}
              marginPagesDisplayed={2}
              pageRangeDisplayed={5}
              onPageChange={handlePageClick}
              containerClassName={"pagination"}
              activeClassName={"active"}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminManageUser;
