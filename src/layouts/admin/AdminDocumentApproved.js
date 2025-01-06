import React, { useEffect, useState } from "react";
import NavBar from "../../components/Admin/NavBar/NavBar";
import avatar from "../../assets/itemDocument.png";
import { FaUser } from "react-icons/fa6";
import { FiSearch } from "react-icons/fi";
import Button from "../../components/Button";
import HeaderAdmin from "../../components/Admin/HeaderAdmin/HeaderAdmin";
import { toast, ToastContainer } from "react-toastify";
import ReactPaginate from "react-paginate"; // Import ReactPaginate
import { useNavigate } from "react-router-dom";

function AdminDocumentApproved() {
  const [verifiedDocuments, setVerifiedDocuments] = useState([]);
  const [currentPage, setCurrentPage] = useState(0); // Khởi tạo currentPage với 0
  const itemsPerPage = 10; // số lượng tài liệu mỗi trang
  const navigate = useNavigate();
  const [documents, setDocuments] = useState([]);

  const fetchVerifiedDocuments = async () => {
    const authToken = localStorage.getItem("authToken");

    try {
      const response = await fetch(
        "http://localhost:8080/api/admin/documents/verified",
        {
          method: "GET",
          headers: {
            Authorization: `${authToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch verified documents");
      }

      const data = await response.json();
      setVerifiedDocuments(data);
    } catch (error) {
      console.error("Error fetching verified documents:", error);
      toast.error("Không thể tải tài liệu đã duyệt.");
    }
  };

  const handleDeleteDocument = async (id) => {
    const authToken = localStorage.getItem("authToken"); // Get the token from local storage

    // Confirmation dialog
    if (window.confirm("Bạn có chắc là muốn xoá tài liệu ?")) {
      try {
        const response = await fetch(
          `http://localhost:8080/api/admin/documents/${id}`,
          {
            method: "DELETE",
            headers: {
              Authorization: `${authToken}`, // Set the Authorization header
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to delete document");
        }

        // Update state to remove the deleted document
        setDocuments((prevDocuments) =>
          prevDocuments.filter((doc) => doc.id !== id)
        );
        toast.success("Xoá tài liệu thành công"); // Show success toast
      } catch (error) {
        console.error("Error deleting document:", error);
        toast.error("Failed to delete document"); // Show error toast
      }
    }
  };

  useEffect(() => {
    fetchVerifiedDocuments();
  }, []);

  // Tính toán số lượng trang
  const pageCount = Math.ceil(verifiedDocuments.length / itemsPerPage);

  // Cắt tài liệu để chỉ hiển thị những tài liệu của trang hiện tại
  const indexOfLastDocument = (currentPage + 1) * itemsPerPage;
  const indexOfFirstDocument = indexOfLastDocument - itemsPerPage;
  const currentDocuments = verifiedDocuments.slice(
    indexOfFirstDocument,
    indexOfLastDocument
  );

  // Hàm xử lý sự kiện khi chuyển trang
  const handlePageClick = (event) => {
    const selectedPage = event.selected;
    setCurrentPage(selectedPage);
  };

  const getStatusInfo = (status) => {
    switch (status) {
      case "VERIFIED":
        return { text: "Đã duyệt", className: "status-verified" }; // Green
      case "CREATED":
        return { text: "Chưa duyệt", className: "status-created" }; // Blue
      case "REJECTED":
        return { text: "Từ chối", className: "status-rejected" }; // Red
      default:
        return { text: status, className: "" };
    }
  };

  const handleAdminDetailDocumentClick = (id) => {
    navigate(`/admin/adminDetailDocument/documents/${id}`); // Pass ID for detail
  };

  const handleAdminUpdateDocumentClick = (id) => {
    navigate(`/admin/adminUpdateDocument/${id}`); // Pass ID for update
  };

  return (
    <div className="containerAdminDocumentApproved">
      <div className="leftAdminWaitDocument">
        <NavBar />
      </div>
      <div className="rightAdminDocumentApproved">
        <HeaderAdmin />
        <div className="containerInfoDocument">
          <div className="containerSearchAdmin">
            <span className="titleInfoAdmin">
              <FaUser className="iconUser" />
              <span className="titleInfo">Tài liệu đã duyệt</span>
            </span>
          </div>
          <div className="infoDocumentAdmin">
            <table className="documentTable">
              <thead>
                <tr>
                  <th>STT</th>
                  <th>Hình ảnh</th>
                  <th>Tên hiển thị</th>
                  <th>Tên người tạo</th>
                  <th>Lượt xem</th>
                  <th>Thể loại</th>
                  <th>Trạng thái</th>
                  <th>Chi tiết</th>
                  <th>Sửa tài liệu</th>
                  <th>Xoá tài liệu</th>
                </tr>
              </thead>
              <tbody>
                {currentDocuments.map((document, index) => (
                  <tr key={document.id}>
                    <td>{index + 1 + indexOfFirstDocument}</td>
                    <td>
                      <img
                        src={document.image || avatar}
                        alt="User"
                        className="userImage"
                        onError={(e) => {
                          e.target.src = avatar; // Thay đổi src nếu không tải được
                        }}
                      />
                    </td>
                    <td>{document.title}</td>
                    <td>{document.userName}</td>
                    <td>{document.view}</td>
                    <td>{document.categoryName}</td>
                    <td>
                      <div
                        className={`status ${
                          getStatusInfo(document.status).className
                        }`}
                      >
                        {getStatusInfo(document.status).text}
                      </div>
                    </td>
                    <td>
                      <button
                        className="btnOpenDocument"
                        onClick={() =>
                          handleAdminDetailDocumentClick(document.id)
                        } // Pass document ID
                      >
                        Xem
                      </button>
                    </td>
                    <td>
                      <button
                        className="btnUpdateDocument"
                        onClick={() =>
                          handleAdminUpdateDocumentClick(document.id)
                        } // Pass document ID
                      >
                        Sửa
                      </button>
                    </td>
                    <td>
                      <button
                        className="btnDelete"
                        onClick={() => handleDeleteDocument(document.id)} // Pass document ID for deletion
                      >
                        Xoá
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <ReactPaginate
            previousLabel={"←"}
            nextLabel={" →"}
            breakLabel={"..."}
            pageCount={pageCount}
            marginPagesDisplayed={2}
            pageRangeDisplayed={3}
            onPageChange={handlePageClick}
            containerClassName={"pagination"}
            activeClassName={"active"}
          />
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

export default AdminDocumentApproved;
