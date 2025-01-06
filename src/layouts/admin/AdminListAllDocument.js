import React, { useEffect, useState } from "react";
import { TbClipboardList } from "react-icons/tb";
import { WiTime5 } from "react-icons/wi";
import { LuUser2 } from "react-icons/lu";
import { FiCheckCircle } from "react-icons/fi";
import ReactPaginate from "react-paginate";
import { useNavigate, useParams } from "react-router-dom";
import { FaUser, FaEye, FaStar } from "react-icons/fa";
import NavBar from "../../components/Admin/NavBar/NavBar";
import HeaderAdmin from "../../components/Admin/HeaderAdmin/HeaderAdmin";
import { FiSearch } from "react-icons/fi";
import Button from "../../components/Button";
import imageDoc from "../../assets/itemDocument.png";
import defaultAvatar from "../../assets/iconAva.png";
import { Tooltip } from "antd";

function AdminListAllDocument() {
  const { userId } = useParams(); // Dynamic userId from URL
  const [documents, setDocuments] = useState([]); // Approved documents
  const [user, setUser] = useState(null);
  const [rejectedDocuments, setRejectedDocuments] = useState([]); // Rejected documents
  const [pendingDocuments, setPendingDocuments] = useState([]); // Pending documents
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingRejected, setLoadingRejected] = useState(false); // Loading state for rejected documents
  const [loadingPending, setLoadingPending] = useState(false); // Loading state for pending documents
  const [currentPage, setCurrentPage] = useState(0); // Track current page
  const [documentsPerPage] = useState(8); // Set documents per page
  const [showRejected, setShowRejected] = useState(false); // New state for showing rejected documents
  const [showPending, setShowPending] = useState(false); // New state for showing pending documents
  const navigate = useNavigate();
  const [role, setRole] = useState("");

  // Get authToken from localStorage
  const authToken = localStorage.getItem("authToken");

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await fetch(
          `http://localhost:8080/api/admin/users/${userId}`,
          {
            headers: {
              Authorization: `${authToken}`, // Include authToken in the Authorization header
            },
          }
        );
        if (!response.ok) throw new Error("Failed to fetch user information");
        const data = await response.json();
        setUser(data);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchUserInfo();
  }, [authToken, userId]);

  useEffect(() => {
    const fetchDocuments = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `http://localhost:8080/api/admin/documents/user/${userId}/verified`, // Use dynamic userId
          {
            headers: {
              Authorization: `${authToken}`, // Include authToken in the Authorization header
            },
          }
        );
        if (!response.ok) throw new Error("Failed to fetch documents");
        const data = await response.json();
        setDocuments(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDocuments();
  }, [authToken, userId]); // Re-run the effect if authToken or userId changes

  useEffect(() => {
    if (user) {
      setRole(() => {
        if (user.role === "ADMIN") {
          return "ADMIN";
        } else if (user.identifier?.startsWith("SV")) {
          return "Sinh Viên";
        } else if (user.identifier?.startsWith("GV")) {
          return "Giảng Viên";
        } else {
          return "Người Dùng";
        }
      });
    }
  }, [user]);

  const fetchRejectedDocuments = async () => {
    setLoadingRejected(true);
    try {
      const response = await fetch(
        `http://localhost:8080/api/admin/documents/user/${userId}/rejected`,
        {
          headers: {
            Authorization: `${authToken}`, // Include authToken in the Authorization header
          },
        }
      );
      if (!response.ok) throw new Error("Failed to fetch rejected documents");
      const data = await response.json();
      setRejectedDocuments(data);
      setShowRejected(true); // Update to show rejected documents
      setCurrentPage(0); // Reset current page
      setShowPending(false); // Reset pending documents display
    } catch (err) {
      setError(err.message);
    } finally {
      setLoadingRejected(false);
    }
  };

  const fetchPendingDocuments = async () => {
    setLoadingPending(true);
    try {
      const response = await fetch(
        `http://localhost:8080/api/admin/documents/user/${userId}/created`,
        {
          headers: {
            Authorization: `${authToken}`, // Include authToken in the Authorization header
          },
        }
      );
      if (!response.ok) throw new Error("Failed to fetch pending documents");
      const data = await response.json();
      setPendingDocuments(data);
      setShowPending(true); // Update to show pending documents
      setCurrentPage(0); // Reset current page
      setShowRejected(false); // Reset rejected documents display
    } catch (err) {
      setError(err.message);
    } finally {
      setLoadingPending(false);
    }
  };

  const handlePageClick = ({ selected }) => {
    setCurrentPage(selected);
  };

  const handleItemClick = (id) => {
    navigate(`/admin/adminDetailDocument/documents/${id}`);
  };

  // Calculate the current documents to display based on pagination
  const indexOfLastDocument = (currentPage + 1) * documentsPerPage;
  const indexOfFirstDocument = indexOfLastDocument - documentsPerPage;
  const currentDocuments = showRejected
    ? rejectedDocuments.slice(indexOfFirstDocument, indexOfLastDocument)
    : showPending
    ? pendingDocuments.slice(indexOfFirstDocument, indexOfLastDocument)
    : documents.slice(indexOfFirstDocument, indexOfLastDocument);

  // const avatarUrl = user?.avatar;

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
    <div className="containerAdminListAllDocument">
      <div className="leftAdminListAllDocument">
        <NavBar />
      </div>
      <div className="rightAdminListAllDocument">
        <HeaderAdmin />
        <div className="containerInfoDocument">
          <div className="containerSearchAdminInfo">
            <span className="titleInfoAdmin">
              <FaUser className="iconUser" />
              <span className="titleInfo">Danh sách người dùng</span>
            </span>
          </div>
          <div className="bl">
            <div className="containerListDocumentCreate">
              {user ? (
                <div className="formUser">
                  <div className="avatarContainer">
                    <img
                      src={user.avatar || defaultAvatar}
                      alt="avatar"
                      className="avatar"
                      onError={(e) => {
                        e.target.src = defaultAvatar;
                      }}
                    />
                    <div className="titleRole">{role || "Người Dùng"}</div>
                  </div>
                  <div className="titleNameUser">{user.fullname || "Name"}</div>
                  <div className="titleEmailUser">
                    Mã số: {user.identifier || "Mã số"}
                  </div>

                  <div className="titleEmailUser">
                    Email: {user.email || "Email"}
                  </div>
                  <div className="titleAddreesUser">
                    Địa chỉ: {user.address || "Address"}
                  </div>
                </div>
              ) : (
                <p>Loading...</p>
              )}
              <div className="titleListUserAdmin">Danh sách tài liệu</div>
              <div className="containerBtnSearch">
                <div className="containerBtnSearchCancel">
                  <Button
                    className="btnSearchCancel"
                    onClick={fetchRejectedDocuments}
                  >
                    Tài liệu từ chối
                  </Button>
                </div>
                <div className="containerBtnSearchCancel">
                  <Button
                    className="btnSearchCancel"
                    onClick={fetchPendingDocuments}
                  >
                    Tài liệu chờ duyệt
                  </Button>
                </div>
                <div className="containerBtnSearchCancel">
                  <Button
                    className="btnSearchCancel"
                    onClick={() => {
                      setShowRejected(false);
                      setShowPending(false);
                      setCurrentPage(0); // Reset current page
                    }}
                  >
                    Tài liệu đã duyệt
                  </Button>
                </div>
              </div>
              {loading ? (
                <div className="loadingDocument">Loading...</div>
              ) : error ? (
                <div className="error">{error}</div>
              ) : (
                <div className="containerListUserDocument">
                  {currentDocuments.map((document) => (
                    <div
                      className="itemDocumentOfUser"
                      key={document.id}
                      onClick={() => handleItemClick(document.id)}
                      style={{ cursor: "pointer" }}
                    >
                      <img
                        src={document.image}
                        alt={document.title}
                        className="imgDocument"
                        onError={(e) => {
                          e.target.src = imageDoc;
                        }}
                      />
                      <div className="listInfo">
                        <Tooltip title={document.title}>
                          <div className="titleInfo">
                            {document.title.split(" ").slice(0, 3).join(" ") +
                              "..."}
                          </div>
                        </Tooltip>
                        <div className="listItemInfo">
                          <TbClipboardList />
                          Thể loại: {document.categoryName}
                        </div>
                        <div className="listItemInfo">
                          <WiTime5 />
                          Thời gian: {document.relativeCreatedAt}
                        </div>
                        <div className="listItemInfo">
                          <LuUser2 />
                          {document.userName}
                        </div>
                        <div className="listItemInfo">
                          <FaEye />
                          <span className="titleView">
                            Lượt xem: {document.view}
                          </span>
                        </div>
                        <div className="listItemInfoAcpHome">
                          <FiCheckCircle />
                          <span className="titleApproved">
                            {getStatusText(document.status)}
                          </span>
                        </div>
                        <div className="star-rating">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <FaStar
                              key={star}
                              className={`star ${
                                star <= document.rating ? "filled" : ""
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              <ReactPaginate
                previousLabel={"<"}
                nextLabel={">"}
                pageCount={Math.ceil(
                  (showRejected
                    ? rejectedDocuments.length
                    : showPending
                    ? pendingDocuments.length
                    : documents.length) / documentsPerPage
                )}
                onPageChange={handlePageClick}
                containerClassName={"pagination"}
                previousLinkClassName={"previousButton"}
                nextLinkClassName={"nextButton"}
                disabledClassName={"paginationDisabled"}
                activeClassName={"active"}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminListAllDocument;
