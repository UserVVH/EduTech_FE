import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ReactPaginate from "react-paginate";
import avatar from "../assets/iconAva.png";

function ListUser() {
  const [users, setUsers] = useState([]);
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
      }
    };

    fetchUsers();
  }, [navigate]);

  const handleUserClick = (userId) => {
    navigate(`/documents/user/${userId}/verified`);
  };

  const handlePageClick = ({ selected }) => {
    setCurrentPage(selected);
  };

  const offset = currentPage * usersPerPage;
  const currentUsers = users.slice(offset, offset + usersPerPage);
  const pageCount = Math.ceil(users.length / usersPerPage);

  return (
    <div className="containerListUser">
      <div className="titleListUser">Danh sách người dùng đăng bài</div>
      {error && <div className="error">{error}</div>}
      <div className="userTable">
        <div className="userTableHeader">
          <div className="userTableCell">STT</div>
          <div className="userTableCell">Hình ảnh</div>
          <div className="userTableCell">Tên người dùng</div>
          <div className="userTableCell">Tổng tài liệu</div>
          <div className="userTableCell">Tổng lượt xem</div>
        </div>
        {currentUsers.map((user, index) => (
          <div
            key={user.userId}
            className="userTableRow"
            onClick={() => handleUserClick(user.userId)}
          >
            <div className="userTableCell">{offset + index + 1}</div>
            <div className="userTableCell">
              <img
                src={user.avatar || avatar}
                alt="User"
                className="userImage"
                onError={(e) => {
                  e.target.src = avatar;
                }}
              />
            </div>
            <div className="userTableCell">{user.fullname}</div>
            <div className="userTableCell">{user.documentCount}</div>
            <div className="userTableCell">{user.totalViews}</div>
          </div>
        ))}
      </div>

      {pageCount > 1 && (
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
  );
}

export default ListUser;
