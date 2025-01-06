import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import NavBar from "../../components/Admin/NavBar/NavBar";
import HeaderAdmin from "../../components/Admin/HeaderAdmin/HeaderAdmin";
import Button from "../../components/Button/index";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function AdminUpdateDocument() {
  const { documentId } = useParams();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [author, setAuthor] = useState("");
  const [publisher, setPublisher] = useState("");
  const [publishingYear, setPublishingYear] = useState("");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [pdfFile, setPdfFile] = useState(null);
  const [pdfFileName, setPdfFileName] = useState("PDF");
  const [categories, setCategories] = useState([]);
  const [categoryId, setCategoryId] = useState(null);
  const [existingPdfUrl, setExistingPdfUrl] = useState(null);
  const [categoryName, setCategoryName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const pdfInputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/category");
        if (!response.ok) throw new Error("Failed to fetch categories");
        const data = await response.json();
        setCategories(data);
      } catch (err) {
        toast.error("Failed to fetch categories");
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    if (documentId) {
      const fetchDocumentDetails = async () => {
        try {
          const token = localStorage.getItem("authToken");
          if (!token) throw new Error("No token found");

          const response = await fetch(
            `http://localhost:8080/api/admin/documents/${documentId}`,
            {
              headers: {
                Authorization: `${token}`,
              },
            }
          );

          if (!response.ok) throw new Error("Failed to fetch document details");

          const data = await response.json();

          setTitle(data.title);
          setDescription(data.description);
          setAuthor(data.author);
          setPublisher(data.publisher);
          setPublishingYear(data.publishingYear);
          setImagePreview(data.image);
          // setCategoryId(data.categoryId);
          if (categories.length > 0) {
            setCategoryId(
              categories.find((cat) => cat.name === data.categoryName)?.id
            );
          }
          setCategoryName(data.categoryName);

          if (data.pdfFiles) {
            setExistingPdfUrl(data.pdfFiles);
          }
        } catch (err) {
          toast.error("Failed to fetch document details");
        }
      };
      fetchDocumentDetails();
    }
  }, [documentId, categories]);

  const handlePdfUpload = (file) => {
    // Ensure file is a File object
    if (file instanceof File) {
      setPdfFile(file);
      setPdfFileName(file.name);

      // Clear the input so the user can re-select the file if needed
      if (pdfInputRef.current) {
        pdfInputRef.current.value = null;
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title) {
      toast.error("Bạn chưa nhập tên tài liệu.");
      return;
    }

    if (!publishingYear) {
      toast.error("Bạn chưa nhập năm xuất bản.");
      return;
    }

    if (!categoryId) {
      toast.error("Bạn chưa chọn thể loại.");
      return;
    }

    if (!description) {
      toast.error("Bạn chưa nhập mô tả chi tiết.");
      return;
    }

    setIsLoading(true);

    try {
      const token = localStorage.getItem("authToken");
      if (!token) throw new Error("No token found");

      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("author", author);
      formData.append("publisher", publisher);
      formData.append("publishingYear", publishingYear);

      if (categoryId) {
        formData.append("categoryId", categoryId);
      } else if (categoryName) {
        formData.append("categoryName", categoryName);
      }

      if (image) formData.append("image", image);
      if (pdfFile && pdfFile instanceof File)
        formData.append("pdfFiles", pdfFile);

      const response = await fetch(
        `http://localhost:8080/api/admin/documents/${documentId}`,
        {
          method: "PUT",
          headers: {
            Authorization: `${token}`,
          },
          body: formData,
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `Failed to update document: ${response.statusText} - ${errorText}`
        );
      }

      toast.success("Chỉnh sửa tài liệu thành công!", {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      setTimeout(() => {
        navigate("/admin/adminAllDocument");
      }, 1000);
    } catch (err) {
    } finally {
      // Stop loading
      setIsLoading(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="containerAdminUpdateDocument">
      <div className="leftAdminUpdateDocument">
        <NavBar />
      </div>

      <div className="rightAdminUpdateDocument">
        <HeaderAdmin />
        <div className="containerFormAdminUpdate">
          <div className="formCreateDocumentsAdmin">
            <div className="titleCreateDocuments">Chỉnh sửa tài liệu</div>
            <form onSubmit={handleSubmit}>
              <div className="formRow">
                <div className="formColum">
                  <div className="itemFormCreate">
                    <div className="titleCoverImage">
                      Chọn lại Ảnh bìa tài liệu nếu thay đổi PDF
                      <span className="requiredStar">*</span>
                    </div>
                    <div className="titleSelectFile">
                      Vui lòng chọn tệp định dạng
                      <span className="requiredStar">JPG, PNG *</span>
                    </div>
                    <div
                      className="imgCover"
                      style={{ backgroundImage: `url(${imagePreview})` }}
                    >
                      <input
                        type="file"
                        accept="image/*"
                        className="fileInput"
                        onChange={handleImageChange}
                      />
                      {!imagePreview && (
                        <div className="uploadText">Chọn ảnh bìa</div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="formColum">
                  <div className="itemFormCreate">
                    <div className="titleFileName">
                      Tên tài liệu<span className="requiredStar">*</span>
                      <input
                        type="text"
                        id="documentName"
                        className="inputItem"
                        placeholder="Nhập tên tài liệu"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        // required
                      />
                    </div>
                  </div>
                  <div className="itemFormUpload">
                    <label className="titleLabel" htmlFor="publicationYear">
                      Năm xuất bản<span className="requiredStar">*</span>
                    </label>
                    <input
                      type="number"
                      id="publicationYear"
                      placeholder="Nhập năm xuất bản"
                      className="inputItem"
                      value={publishingYear}
                      onChange={(e) => setPublishingYear(e.target.value)}
                      // required
                    />
                  </div>
                  <div className="itemFormUpload">
                    <label className="titleLabel" htmlFor="categoryId">
                      Hãy Chọn Thể loại<span className="requiredStar">*</span>
                    </label>
                    {/* <select
                      id="categoryId"
                      className="inputItem"
                      value={categoryId || ""}
                      onChange={(e) => setCategoryId(e.target.value)}
                      // required
                    >
                      <option value="">Chọn thể loại</option>
                      {categories.map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </select> */}
                    <select
                      id="categoryId"
                      className="inputItem"
                      value={categoryId}
                      onChange={(e) => setCategoryId(e.target.value)}
                    >
                      {categories.map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                    {/* <div className="itemFormUpload">
                      <label className="titleLabel" htmlFor="categoryName">
                        Thể loại mới (nếu có)
                      </label>
                      <input
                        type="text"
                        id="categoryName"
                        className="inputItem"
                        placeholder="Nhập tên thể loại mới"
                        value={categoryName}
                        onChange={(e) => setCategoryName(e.target.value)}
                      />
                    </div> */}
                  </div>

                  {/* <div className="itemFormUpload">
                    <label className="titleLabel" htmlFor="pdfInput">
                      Tải tệp PDF mới<span className="requiredStar">*</span>
                    </label>
                    <div className="pdfUploadContainer">
                      <div className="pdfFileList">
                        {pdfFileName ? (
                          <div className="pdfFileItem">
                            <span>{pdfFileName}</span>
                            <button
                              className="removeButton"
                              onClick={handleRemovePdf}
                            >
                              Xóa
                            </button>
                          </div>
                        ) : (
                          <div className="noFilesText">Hãy chọn file</div>
                        )}
                      </div>
                      <input
                        type="file"
                        accept="application/pdf"
                        onChange={(e) => handlePdfUpload(e.target.files[0])}
                        ref={pdfInputRef}
                        className="fileInputAdmin"
                      />
                    </div>
                  </div> */}
                  <div className="itemFormUpload">
                    <label className="titleLabel" htmlFor="pdfInput">
                      Tải tệp PDF<span className="requiredStar">*</span>
                    </label>
                    <div className="pdfUploadContainer">
                      <div className="pdfFileList">
                        {existingPdfUrl ? (
                          <div className="pdfFileItem">
                            <a
                              href={existingPdfUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="pdfFileLink"
                            >
                              {pdfFileName}
                            </a>
                          </div>
                        ) : (
                          <div className="noFilesText">Hãy chọn file</div>
                        )}
                      </div>
                      <div className="containerUpdateDocument">
                        <div
                          className="changeUpdate"
                          onClick={() => pdfInputRef.current.click()}
                        >
                          <span className="titleChangeDocument">
                            Đổi tài liệu
                          </span>
                        </div>
                      </div>
                      <input
                        type="file"
                        accept="application/pdf"
                        onChange={(e) => handlePdfUpload(e.target.files[0])}
                        ref={pdfInputRef}
                        className="fileInputAdmin"
                        style={{ display: "none" }}
                      />
                    </div>
                  </div>

                  <div className="itemFormUpload">
                    <label className="titleLabel" htmlFor="author">
                      Tác giả<span className="requiredStar">*</span>
                    </label>
                    <input
                      type="text"
                      id="author"
                      placeholder="Nhập tên tác giả"
                      className="inputItem"
                      value={author}
                      onChange={(e) => setAuthor(e.target.value)}
                      // required
                    />
                  </div>
                  <div className="itemFormUpload">
                    <label className="titleLabel" htmlFor="publisher">
                      Nhà xuất bản<span className="requiredStar">*</span>
                    </label>
                    <input
                      type="text"
                      id="publisher"
                      placeholder="Nhập nhà xuất bản"
                      className="inputItem"
                      value={publisher}
                      onChange={(e) => setPublisher(e.target.value)}
                      // required
                    />
                  </div>

                  <div className="itemFormUpload">
                    <label className="titleLabel" htmlFor="description">
                      Mô tả<span className="requiredStar">*</span>
                    </label>
                    <textarea
                      id="description"
                      placeholder="Nhập mô tả tài liệu"
                      className="inputItem"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      // required
                    />
                  </div>
                </div>
              </div>

              <div className="btnAcp">
                <Button
                  type="submit"
                  disabled={isLoading}
                  className={`submit-btn ${isLoading ? "loading" : ""}`}
                >
                  <span className="titleAcp">
                    {isLoading ? "Đang cập nhật..." : "Xác nhận"}
                  </span>
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}

export default AdminUpdateDocument;
