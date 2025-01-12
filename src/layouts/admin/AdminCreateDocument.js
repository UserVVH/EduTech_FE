import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../../components/Button/index";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import NavBar from "../../components/Admin/NavBar/NavBar";
import HeaderAdmin from "../../components/Admin/HeaderAdmin/HeaderAdmin";

function AdminCreateDocument() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [author, setAuthor] = useState("");
  const [publisher, setPublisher] = useState("");
  const [publishingYear, setPublishingYear] = useState("");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [pdfFile, setPdfFile] = useState([]);
  const [pdfFileName, setPdfFileName] = useState([]);
  const [categories, setCategories] = useState([]);
  const [categoryId, setCategoryId] = useState(null);
  const [error, setError] = useState(null);
  const pdfInputRef = useRef(null);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/category");
        if (!response.ok) throw new Error("Failed to fetch categories");
        const data = await response.json();
        setCategories(data);
      } catch (err) {
        setError("Failed to fetch categories");
      }
    };
    fetchCategories();
  }, []);

  const handlePdfUpload = (files) => {
    const fileArray = Array.from(files);
    const invalidFiles = fileArray.filter(
      (file) => file.type !== "application/pdf"
    );

    if (invalidFiles.length > 0) {
      toast.error("Chỉ chấp nhận file PDF", {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      return;
    }

    setPdfFile((prevFiles) => [...prevFiles, ...fileArray]);
    setPdfFileName(fileArray.map((file) => file.name));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!image) {
      toast.error("Bạn chưa tải hình lên.", {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      return;
    }

    if (!title) {
      toast.error("Bạn chưa nhập tên tài liệu.", {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      return;
    }

    if (!publishingYear) {
      toast.error("Bạn chưa nhập năm xuất bản.", {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      return;
    }

    if (!categoryId) {
      toast.error("Bạn chưa chọn thể loại.", {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      return;
    }

    if (pdfFile.length === 0) {
      toast.error("Bạn chưa tải tệp PDF.", {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      return;
    }

    if (!description) {
      toast.error("Bạn chưa nhập mô tả chi tiết.", {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      return;
    }

    setIsLoading(true);

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("author", author);
    formData.append("publisher", publisher);
    formData.append("publishingYear", publishingYear);
    if (categoryId) formData.append("categoryId", categoryId); // Append the selected category ID
    if (image) formData.append("image", image);
    pdfFile.forEach((file) => formData.append("pdfFiles", file));

    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        throw new Error("No token found");
      }

      const response = await fetch(
        "http://localhost:8080/api/admin/documents",
        {
          method: "POST",
          headers: {
            Authorization: ` ${token}`,
          },
          body: formData,
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `Failed to create document: ${response.statusText} - ${errorText}`
        );
      }

      const result = await response.json();
      toast.success("Tạo tài liệu thành công!", {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });

      console.log(result);
      setTimeout(() => {
        navigate("/admin/adminAllDocument");
      }, 1000);
    } catch (err) {
      setError(`Failed to create document: ${err.message}`);
      console.error(err);
      toast.error(`Failed to create document: ${err.message}`);
    } finally {
      // Stop loading
      setIsLoading(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];

    if (file && !allowedTypes.includes(file.type)) {
      toast.error("Chỉ chấp nhận file JPG, JPEG hoặc PNG", {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      e.target.value = ""; // Reset input
      return;
    }

    setImage(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemovePdf = (fileName) => {
    setPdfFileName((prevFileNames) =>
      prevFileNames.filter((name) => name !== fileName)
    );
    setPdfFile((prevFiles) =>
      prevFiles.filter((file) => file.name !== fileName)
    );
    pdfInputRef.current.value = null;
  };

  return (
    <div className="containerAdminCreateDocument">
      <ToastContainer />
      <div className="leftAdminCreateDocument">
        <NavBar />
      </div>
      <div className="rightAdminCreateDocument">
        <HeaderAdmin />
        <div className="containerFormAdminCreate">
          <div className="formCreateDocumentsAdmin">
            <div className="titleCreateDocuments">Tạo mới tài liệu</div>
            <form onSubmit={handleSubmit}>
              <div className="formRow">
                <div className="formColum">
                  <div className="itemFormCreate">
                    <div className="titleCoverImage">
                      Ảnh bìa tài liệu<span className="requiredStar">*</span>
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
                        accept=".jpg,.jpeg,.png"
                        className="fileInput"
                        onChange={handleImageChange}
                      />
                      {!image && <div className="uploadText">Tải ảnh lên</div>}
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
                    <select
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
                    </select>
                  </div>
                  <div className="itemFormUpload">
                    <label className="titleLabel" htmlFor="pdfInput">
                      Tải tệp PDF<span className="requiredStar">*</span>
                    </label>
                    <div className="pdfUploadContainer">
                      <div className="pdfFileList">
                        {pdfFileName.length === 0 ? (
                          <div className="noFilesText">Hãy chọn file</div>
                        ) : (
                          pdfFileName.map((fileName, index) => (
                            <div key={index} className="pdfFileItem">
                              <span>{fileName}</span>
                              <button
                                className="removeButton"
                                onClick={() => handleRemovePdf(fileName)}
                              >
                                Xóa
                              </button>
                            </div>
                          ))
                        )}
                      </div>
                      <input
                        type="file"
                        id="pdfInput"
                        accept=".pdf"
                        onChange={(e) => handlePdfUpload(e.target.files)}
                        ref={pdfInputRef}
                        style={{ display: "none" }}
                        multiple
                      />
                      <input
                        type="file"
                        accept="application/pdf"
                        onChange={(e) => handlePdfUpload(e.target.files)}
                        ref={pdfInputRef}
                        multiple
                        className="fileInputAdmin"
                      />
                    </div>
                  </div>
                  <div className="itemFormUpload">
                    <label className="titleLabel" htmlFor="publisher">
                      Nhà xuất bản
                    </label>
                    <input
                      type="text"
                      id="publisher"
                      placeholder="Nhập tên nhà xuất bản"
                      className="inputItem"
                      value={publisher}
                      onChange={(e) => setPublisher(e.target.value)}
                      // required
                    />
                  </div>
                  <div className="itemFormUpload">
                    <label className="titleLabel" htmlFor="author">
                      Tên tác giả
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
                    <label className="titleLabel" htmlFor="description">
                      Mô tả chi tiết<span className="requiredStar">*</span>
                    </label>
                    <textarea
                      id="description"
                      placeholder="Nhập mô tả chi tiết"
                      className="textareaItem"
                      rows="4"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
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
                    {isLoading ? "Đang tạo..." : "Xác nhận"}
                  </span>
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminCreateDocument;
