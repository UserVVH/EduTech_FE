import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./css/index.css";
import { TbClipboardList } from "react-icons/tb";
import { WiTime5 } from "react-icons/wi";
import { LuUser2 } from "react-icons/lu";
import { FiCheckCircle } from "react-icons/fi";
import { FaEye } from "react-icons/fa";
import avatarComment from "../assets/iconAva.png";
import { VscSend } from "react-icons/vsc";
import imgDocument from "../assets/itemDocument.png";
import Button from "../components/Button/index";
import { toast } from "react-toastify";
import { FaRegCommentDots } from "react-icons/fa6";

function Detail() {
  const { id } = useParams();
  const [document, setDocument] = useState(null);
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);
  const [authToken, setAuthToken] = useState(
    localStorage.getItem("authToken") || ""
  );
  const [user, setUser] = useState(null);
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editedComment, setEditedComment] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const validateToken = async () => {
      if (!authToken) {
        toast.error("Vui lòng đăng nhập để xem tài liệu", {
          position: "top-center",
          autoClose: 2000,
          closeOnClick: true,
        });
        navigate("/login");
        return false;
      }

      try {
        const response = await fetch("http://localhost:8080/api/user/me", {
          headers: {
            Authorization: `${authToken}`,
          },
        });

        if (!response.ok) {
          // Token is invalid
          localStorage.removeItem("authToken"); // Clear invalid token
          setAuthToken("");
          toast.error("Phiên đăng nhập không hợp lệ. Vui lòng đăng nhập lại", {
            position: "top-center",
            autoClose: 2000,
          });
          navigate("/login");
          return false;
        }

        return true;
      } catch (error) {
        console.error("Token validation failed:", error);
        localStorage.removeItem("authToken");
        setAuthToken("");
        navigate("/login");
        return false;
      }
    };

    const initializeData = async () => {
      const isValid = await validateToken();
      if (!isValid) return;

      // Only fetch data if token is valid
      fetchDocument();
      fetchUserInfo();
      fetchComments();
    };

    initializeData();
  }, [id, authToken, navigate]);

  const handleKeyPress = (e, isEditing, commentId) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (isEditing) {
        handleEditComment(commentId);
      } else {
        if (comment.trim() === "") {
          toast.error("Bình luận không được trống", {
            position: "top-center",
            autoClose: 1000,
            closeOnClick: true,
            className: "custom-toast",
            progressClassName: "custom-progress",
          });
        } else if (authToken === "") {
          toast.error("Bạn phải đăng nhập để bình luận", {
            position: "top-center",
            autoClose: 1000,
            closeOnClick: true,
            className: "custom-toast",
            progressClassName: "custom-progress",
          });
        } else {
          handleCommentSubmit();
        }
      }
    }
  };

  const handleCommentSubmit = async () => {
    // if (!comment.trim()) return;
    if (comment.trim() === "") {
      toast.error("Bình luận không được trống", {
        position: "top-center",
        autoClose: 1000,
        closeOnClick: true,
        className: "custom-toast",
        progressClassName: "custom-progress",
      });
      return;
    }
    if (authToken === "") {
      toast.error("Bạn phải đăng nhập để bình luận", {
        position: "top-center",
        autoClose: 1000,
        closeOnClick: true,
        className: "custom-toast",
        progressClassName: "custom-progress",
      });
      return;
    }
    try {
      const response = await fetch(
        `http://localhost:8080/api/comments/${id}/add`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `${authToken}`,
          },
          body: comment,
        }
      );

      if (!response.ok) {
        throw new Error("Failed to submit comment");
      }

      const newComment = await response.json();
      setComments((prevComments) => [newComment, ...prevComments]);
      setComment("");
    } catch (error) {
      console.error("Error submitting comment:", error);
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/comments/${commentId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `${authToken}`,
          },
        }
      );
      if (!response.ok) {
        throw new Error("Failed to delete comment");
      }
      setComments((prevComments) =>
        prevComments.filter((comment) => comment.id !== commentId)
      );
      toast.success("Xoá bình luận thành công", {
        position: "top-center",
        autoClose: 1000,
        closeOnClick: true,
        className: "custom-toast",
        progressClassName: "custom-progress",
      });
    } catch (error) {
      console.error("Error deleting comment:", error);
      toast.error("Bạn không thể xoá được bình luận người khác", {
        position: "top-center",
        autoClose: 1000,
        closeOnClick: true,
        className: "custom-toast",
        progressClassName: "custom-progress",
      });
    }
  };

  const handleEditComment = async (commentId) => {
    if (!editedComment.trim()) {
      toast.error("Nội dung bình luận không được trống");
      setEditedComment("");
      setEditingCommentId(null);
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:8080/api/comments/${commentId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `${authToken}`,
          },
          body: editedComment,
        }
      );

      if (!response.ok) {
        throw new Error("Failed to edit comment");
      }
      setComments((prevComments) =>
        prevComments.map((comment) =>
          comment.id === commentId
            ? { ...comment, content: editedComment }
            : comment
        )
      );
      toast.success("Cập nhật bình luận thành công", {
        position: "top-center",
        autoClose: 1000,
        closeOnClick: true,
        className: "custom-toast",
        progressClassName: "custom-progress",
      });
      setEditedComment("");
      setEditingCommentId(null);
    } catch (error) {
      console.error("Error editing comment:", error);
      toast.error("Bạn không thể chỉnh sửa bình luận người khác", {
        position: "top-center",
        autoClose: 1000,
        closeOnClick: true,
        className: "custom-toast",
        progressClassName: "custom-progress",
      });
      setEditedComment("");
      setEditingCommentId(null);
    }
  };

  const handleDownload = () => {
    if (document && document.pdfFiles) {
      window.open(document.pdfFiles, "_blank");
    }
  };

  const handleUserClick = (userId) => {
    navigate(`/documents/user/${userId}/verified`);
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

  const fetchDocument = async () => {
    try {
      const response = await fetch(`http://localhost:8080/api/documents/${id}`);
      if (!response.ok) throw new Error("Failed to fetch document");
      const data = await response.json();
      setDocument(data);
    } catch (error) {
      console.error("Error fetching document:", error);
      toast.error("Không thể tải tài liệu");
    }
  };

  const fetchUserInfo = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/user/me", {
        headers: {
          Authorization: `${authToken}`,
        },
      });
      if (!response.ok) throw new Error("Failed to fetch user info");
      const data = await response.json();
      setUser(data);
    } catch (error) {
      console.error("Error fetching user info:", error);
    }
  };

  const fetchComments = async () => {
    try {
      const response = await fetch(`http://localhost:8080/api/comments/${id}`, {
        headers: {
          Authorization: `${authToken}`,
        },
      });
      if (!response.ok) throw new Error("Failed to fetch comments");
      const data = await response.json();
      setComments(data);
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };

  return (
    <div className="containerDetail">
      {!authToken ? (
        <div className="loading">Vui lòng đăng nhập để xem tài liệu...</div>
      ) : !document ? (
        <div className="loading">Loading...</div>
      ) : (
        <div className="formDetail">
          <div className="titleDetail">{document.title}</div>
          <div className="imgContainerDetail">
            <div className="left">
              <img
                src={document.image}
                alt={document.title}
                className="imgDetail"
                onError={(e) => {
                  e.target.src = imgDocument;
                }}
              />
            </div>
            <div className="right">
              <div className="itemListDetail">
                <TbClipboardList className="iconDetail" />
                Thể loại: {document.categoryName}
              </div>
              <div className="itemListDetail">
                <WiTime5 className="iconDetail" />
                Thời Gian: {document.relativeCreatedAt}
              </div>
              <div className="itemListDetail">
                <LuUser2 className="iconDetail" />
                <div
                  className="cp"
                  onClick={() => handleUserClick(document.userId)}
                >
                  {document.userName}
                </div>
              </div>
              <div className="itemListAcpDetail">
                <FiCheckCircle className="iconDetail" />
                {getStatusText(document.status)}
              </div>
              <div className="itemListDetail">
                <FaEye className="iconDetail" />
                Lượt xem: {document.view}
              </div>
              <div className="itemListDetail">
                <Button className="btnDownload" onClick={handleDownload}>
                  Tải về
                </Button>
              </div>
            </div>
          </div>
          <div className="listPDF">
            <iframe
              src={document.pdfFiles}
              width="100%"
              height="1000px"
              title="PDF Document"
            />
          </div>
          <div className="containerDescription">
            <div className="description">{document.description}</div>
          </div>
          <div className="containerComment">
            <div className="titleComment">
              <FaRegCommentDots />
              <span className="titleCommentDetail">Bình luận:</span>
            </div>
            <div className="listComment">
              {comments.length > 0 ? (
                comments.map((comment) => (
                  <div key={comment.id} className="itemComment">
                    <div className="avatarComment">
                      <img
                        src={comment.avatar || avatarComment}
                        alt="avatar"
                        className="imgAva"
                      />
                    </div>
                    <div className="containerCommentBody">
                      <div className="commentRep">
                        <div className="userComment">{comment.userName}</div>
                        {editingCommentId === comment.id ? (
                          <div className="bodyComment">
                            <textarea
                              value={editedComment}
                              onChange={(e) => setEditedComment(e.target.value)}
                              className="inputComment"
                              onKeyDown={(e) =>
                                handleKeyPress(e, true, comment.id)
                              }
                            />
                            <div
                              className="btnSend"
                              onClick={() => handleEditComment(comment.id)}
                            >
                              <VscSend className="iconSend" />
                            </div>
                          </div>
                        ) : (
                          <div className="bodyComment">{comment.content}</div>
                        )}
                      </div>
                      <div className="repComment">
                        <span
                          className="itemFix"
                          onClick={() => {
                            setEditingCommentId(comment.id);
                            setEditedComment(comment.content);
                          }}
                        >
                          Chỉnh sửa
                        </span>
                        <span
                          className="itemDel"
                          onClick={() => handleDeleteComment(comment.id)}
                        >
                          Xoá
                        </span>
                        {editingCommentId === comment.id && (
                          <span
                            className="itemClose"
                            onClick={() => setEditingCommentId(null)}
                          >
                            Đóng
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="titleNotice">Chưa có bình luận nào</p>
              )}
            </div>
            <div className="itemComment">
              <div className="avatarComment">
                <img
                  src={user?.avatar || avatarComment}
                  alt="avatar"
                  className="imgAva"
                />
              </div>
              <div className="containerCommentBody">
                <div className="commentRep">
                  <div className="userComment">{user?.fullname}</div>
                  <div className="bodyComment">
                    <textarea
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder="Viết bình luận của bạn..."
                      className="inputComment"
                      onKeyDown={handleKeyPress}
                    />
                    <div className="btnSend" onClick={handleCommentSubmit}>
                      <VscSend className="iconSend" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Detail;
