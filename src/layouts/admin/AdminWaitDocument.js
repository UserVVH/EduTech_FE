import React, { useEffect, useState } from "react";
import NavBar from "../../components/Admin/NavBar/NavBar";
import avatar from "../../assets/itemDocument.png";
import { FaUser } from "react-icons/fa6";
import { FiSearch } from "react-icons/fi";
import Button from "../../components/Button";
import HeaderAdmin from "../../components/Admin/HeaderAdmin/HeaderAdmin";
import { toast, ToastContainer } from "react-toastify";
import ReactPaginate from "react-paginate";
import { useNavigate } from "react-router-dom";

function AdminWaitDocument() {
  const [waitingDocuments, setWaitingDocuments] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 10;
  const navigate = useNavigate();

  const fetchWaitingDocuments = async () => {
    const authToken = localStorage.getItem("authToken");

    try {
      const response = await fetch(
        "http://localhost:8080/api/admin/documents/created",
        {
          method: "GET",
          headers: {
            Authorization: `${authToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch waiting documents");
      }

      const data = await response.json();
      setWaitingDocuments(data);
    } catch (error) {
      console.error("Error fetching waiting documents:", error);
      toast.error("Không thể tải tài liệu chờ duyệt.");
    }
  };

  const handleDeleteDocument = async (id) => {
    const authToken = localStorage.getItem("authToken");

    if (window.confirm("Bạn có chắc chắn muốn xoá tài liệu ?")) {
      try {
        const response = await fetch(
          `http://localhost:8080/api/admin/documents/${id}`,
          {
            method: "DELETE",
            headers: {
              Authorization: `${authToken}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to delete document");
        }

        setWaitingDocuments((prevDocuments) =>
          prevDocuments.filter((doc) => doc.id !== id)
        );
        toast.success("Xoá tài liệu thành công");
      } catch (error) {
        console.error("Error deleting document:", error);
        toast.error("Failed to delete document");
      }
    }
  };

  const handleVerifyDocument = async (id) => {
    const authToken = localStorage.getItem("authToken");

    try {
      const response = await fetch(
        `http://localhost:8080/api/admin/documents/${id}/status?status=VERIFIED`,
        {
          method: "PUT",
          headers: {
            Authorization: `${authToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to verify document");
      }

      // Xóa tài liệu khỏi danh sách ngay sau khi duyệt
      setWaitingDocuments((prevDocuments) =>
        prevDocuments.filter((doc) => doc.id !== id)
      );

      toast.success("Duyệt tài liệu thành công");
    } catch (error) {
      console.error("Error verifying document:", error);
      toast.error("Failed to verify document");
    }
  };

  // Hàm từ chối tài liệu
  const handleRejectDocument = async (id) => {
    const authToken = localStorage.getItem("authToken");

    try {
      const response = await fetch(
        `http://localhost:8080/api/admin/documents/${id}/status?status=REJECTED`,
        {
          method: "PUT",
          headers: {
            Authorization: `${authToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to reject document");
      }

      // Xóa tài liệu khỏi danh sách ngay sau khi từ chối
      setWaitingDocuments((prevDocuments) =>
        prevDocuments.filter((doc) => doc.id !== id)
      );

      toast.success("Từ chối tài liệu thành công");
    } catch (error) {
      console.error("Error rejecting document:", error);
      toast.error("Failed to reject document");
    }
  };

  useEffect(() => {
    fetchWaitingDocuments();
  }, []);

  const indexOfLastDocument = (currentPage + 1) * itemsPerPage;
  const indexOfFirstDocument = indexOfLastDocument - itemsPerPage;
  const currentDocuments = waitingDocuments.slice(
    indexOfFirstDocument,
    indexOfLastDocument
  );

  const handlePageClick = (data) => {
    setCurrentPage(data.selected);
  };

  const pageCount = Math.ceil(waitingDocuments.length / itemsPerPage);

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
    navigate(`/admin/adminDetailDocument/documents/${id}`);
  };

  return (
    <div className="containerAdminWaitDocument">
      <div className="leftAdminWaitDocument">
        <NavBar />
      </div>
      <div className="rightAdminWaitDocument">
        <HeaderAdmin />
        <div className="containerInfoDocument">
          <div className="containerSearchAdmin">
            <span className="titleInfoAdmin">
              <FaUser className="iconUser" />
              <span className="titleInfo">Tài liệu chờ duyệt</span>
            </span>
            {/* <div className="searchDocumentAdmin">
              <input
                type="text"
                placeholder="Tìm kiếm tài liệu"
                className="inputSearchAdmin"
              />
              <FiSearch className="searchIcon" />
            </div> */}
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
                  <th>Chức năng</th>
                  <th>Trạng thái</th>
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
                        }
                      >
                        Xem
                      </button>
                      <button
                        className="btnDelete"
                        onClick={() => handleDeleteDocument(document.id)}
                      >
                        Xoá
                      </button>
                    </td>
                    <td>
                      <button
                        className="btnVerifiedDocument"
                        onClick={() => handleVerifyDocument(document.id)}
                      >
                        Duyệt
                      </button>
                      <button
                        className="btnCancel"
                        onClick={() => handleRejectDocument(document.id)} // Gọi hàm từ chối tài liệu
                      >
                        Từ chối
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

export default AdminWaitDocument;
