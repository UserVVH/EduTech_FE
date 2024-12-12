import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchUserInfo } from "../Redux/actions/authActions";
import { useNavigate } from "react-router-dom";
import "./css/index.css";
import defaultAvatar from "../assets/iconAva.png";
import Button from "../components/Button";
import { TbClipboardList } from "react-icons/tb";
import { WiTime5 } from "react-icons/wi";
import { LuUser2 } from "react-icons/lu";
import { FiCheckCircle } from "react-icons/fi";
import ReactPaginate from "react-paginate";
import { FaStar, FaEye, FaEdit, FaTrash, FaDownload } from "react-icons/fa";
import imgDocument from "../assets/itemDocument.png";
import { toast } from "react-toastify";

function User() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const token = localStorage.getItem("authToken");
  const user = useSelector((state) => state.auth.user);
  const [role, setRole] = useState("");
  const [documents, setDocuments] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(false); // Add loading state

  useEffect(() => {
    if (token) {
      dispatch(fetchUserInfo());
    }
  }, [dispatch, token]);

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

  useEffect(() => {
    if (token) {
      setLoading(true); // Start loading
      let endpoint = "http://localhost:8080/api/documents/my";
      if (filter === "created") {
        endpoint += "/created";
      } else if (filter === "verified") {
        endpoint += "/verified";
      } else if (filter === "rejected") {
        endpoint += "/rejected";
      }

      fetch(endpoint, {
        headers: {
          Authorization: `${token}`,
        },
      })
        .then((response) => response.json())
        .then((data) => {
          if (Array.isArray(data)) {
            setDocuments(data);
          } else {
            console.error("Unexpected data format:", data);
            setDocuments([]);
          }
        })
        .catch((error) => {
          console.error("Error fetching documents:", error);
        })
        .finally(() => setLoading(false)); // Stop loading
    }
  }, [token, user, filter]);

  const itemsPerPage = 8;
  const offset = currentPage * itemsPerPage;
  const currentItems = Array.isArray(documents)
    ? documents.slice(offset, offset + itemsPerPage)
    : [];

  const handlePageClick = (data) => {
    setCurrentPage(data.selected);
  };

  const getFormattedIdentifier = () => {
    if (user?.role === "ADMIN") return null;
    if (!user?.identifier) return null;
    return user.identifier.startsWith("SV")
      ? `Mã số SV: ${user.identifier}`
      : user.identifier.startsWith("GV")
      ? `Mã số GV: ${user.identifier}`
      : null;
  };

  const avatarUrl = user?.avatar || defaultAvatar;

  const handleViewClick = (docId) => {
    navigate(`/documents/${docId}`);
  };

  const handleEditClick = (docId) => {
    navigate(`/updatedocument/${docId}`);
  };

  const handleDeleteClick = (docId) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa tài liệu này?")) {
      fetch(`http://localhost:8080/api/documents/${docId}`, {
        method: "DELETE",
        headers: {
          Authorization: `${token}`,
        },
      })
        .then((response) => {
          if (response.ok) {
            setDocuments(documents.filter((doc) => doc.id !== docId));
            toast.success("Tài liệu đã được xóa thành công!", {
              position: "top-center",
              autoClose: 1000,
              closeOnClick: true,
              className: "custom-toast",
              progressClassName: "custom-progress",
            });
          } else {
            throw new Error("Error deleting document");
          }
        })
        .catch((error) => {
          console.error("Error deleting document:", error);
          toast.error("Có lỗi xảy ra khi xóa tài liệu.", {
            position: "top-center",
            autoClose: 1000,
            closeOnClick: true,
            className: "custom-toast",
            progressClassName: "custom-progress",
          });
        });
    }
  };

  const handleCreatedDocuments = () => {
    setFilter("created");
    setCurrentPage(0);
  };

  const handleVerifiedDocuments = () => {
    setFilter("verified");
    setCurrentPage(0);
  };

  const handleRejectedDocuments = () => {
    setFilter("rejected");
    setCurrentPage(0);
  };

  const handleDownloadClick = (docId, title, fileUrl) => {
    // Nếu fileUrl không có, không làm gì cả
    if (!fileUrl) {
      toast.error("Không tìm thấy file để tải về.", {
        position: "top-center",
        autoClose: 1000,
        closeOnClick: true,
        className: "custom-toast",
        progressClassName: "custom-progress",
      });
      return;
    }

    // Tạo một thẻ <a> để tải file
    const link = document.createElement("a");
    link.href = fileUrl; // URL của tài liệu
    link.download = title; // Đặt tên file là tiêu đề tài liệu
    link.click(); // Tự động click để tải file
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
    <div className="containerUser">
      <div className="formUser">
        <div className="avatarContainer">
          <img
            src={avatarUrl}
            alt="avatar"
            className="avatar"
            onError={(e) => {
              e.target.src = defaultAvatar;
            }}
          />
          <div className="titleRole">{role || "Người Dùng"}</div>
        </div>
        <div className="titleNameUser">{user?.fullname || "Name"}</div>

        {getFormattedIdentifier() && (
          <div className="titleMSSVGV">{getFormattedIdentifier()}</div>
        )}

        <div className="titleEmailUser">Email: {user?.email || "Email"}</div>
        <div className="titleAddreesUser">
          Địa chỉ: {user?.address || "Address"}
        </div>
        <div className="rowUser">
          <div className="columUser">
            <div className="btnChangeUpdate">
              <Button type="submit">
                <span
                  className="titleAcp"
                  onClick={() => navigate("/updateuser")}
                >
                  Sửa thông tin
                </span>
              </Button>
            </div>
            <div className="btnChangePass">
              <Button type="submit">
                <span
                  className="titleAcp"
                  onClick={() => navigate("/changepassword")}
                >
                  Đổi mật khẩu
                </span>
              </Button>
            </div>
          </div>
        </div>
      </div>
      <div className="titleDocument">Tài liệu của tôi</div>
      <div className="containerBtnAction">
        <div className="btnAction">
          <Button className="btnAll" onClick={() => setFilter("all")}>
            Tất cả
          </Button>
        </div>
        <div>
          <Button className="btnVerified" onClick={handleVerifiedDocuments}>
            Tài liệu đã duyệt
          </Button>
        </div>
        <div>
          <Button className="btnCreate" onClick={handleCreatedDocuments}>
            Tài liệu chưa duyệt
          </Button>
        </div>
        <div>
          <Button className="btnRefuse" onClick={handleRejectedDocuments}>
            Tài liệu từ chối
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="loadingMessage">Đang tải tài liệu...</div>
      ) : (
        <div className="height">
          {documents.length === 0 ? (
            <div className="noDocumentsMessage">Không có tài liệu nào.</div>
          ) : (
            <div className="containerList">
              {currentItems.map((item, index) => (
                <div key={index} className="itemDocument">
                  <img
                    src={item.image || imgDocument}
                    alt={item.title}
                    className="imgDocument"
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
                  <div className="listItemFeature">
                    <div className="grView">
                      <FaEye
                      className="iconEye"
                      title="Xem"
                      onClick={() => handleViewClick(item.id)}
                      />
                      <label className="view">{item.view}</label>
                    </div>
                    <FaEdit
                      className="iconEdit"
                      title="Chỉnh sửa"
                      onClick={() => handleEditClick(item.id)}
                    />
                    <FaTrash
                      className="iconTrash"
                      title="Xóa"
                      onClick={() => handleDeleteClick(item.id)}
                    />
                    {/* <FaDownload className="iconDown" title="Tải xuống" /> */}
                  </div>
                </div>
              ))}
            </div>
          )}
          <ReactPaginate
            previousLabel={"←"}
            nextLabel={" →"}
            breakLabel={"..."}
            pageCount={Math.ceil(documents.length / itemsPerPage)}
            onPageChange={handlePageClick}
            containerClassName={"pagination"}
            activeClassName={"active"}
          />
        </div>
      )}
    </div>
  );
}

export default User;
