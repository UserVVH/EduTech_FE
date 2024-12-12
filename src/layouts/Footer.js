import React, { useState } from "react";
import "./css/index.css";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Button from "../components/Button";
import logo from "../assets/logo2.png";

const Footer = () => {
  const [email, setEmail] = useState("");

  const handleSubscribe = async () => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      toast.error("Vui lòng đăng nhập trước khi đăng ký!", {
        autoClose: 1000,
        position: "top-center",
      });
      setEmail("");
      return;
    }

    if (!email) {
      toast.error("Vui lòng nhập vào email của bạn.", {
        autoClose: 1000,
        position: "top-center",
      });
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:8080/api/subscribe?email=${email}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
          body: JSON.stringify({}),
        }
      );

      if (response.ok) {
        toast.success("Đăng ký thành công!", {
          autoClose: 2000,
          position: "top-center",
        });
        setEmail("");
      } else {
        const errorMessage = await response.text();

        // Kiểm tra các thông điệp lỗi cụ thể từ API
        if (errorMessage.includes("Email does not match the token's email")) {
          toast.error("Vui lòng nhập vào email của bạn.", {
            autoClose: 2000,
            position: "top-center",
          });
        } else if (errorMessage.includes("Email is already being followed")) {
          toast.info("Email đã được đăng ký trước đó!", {
            autoClose: 2000,
            position: "top-center",
          });
        } else {
          toast.error("Có lỗi xảy ra. Vui lòng thử lại.", {
            autoClose: 2000,
            position: "top-center",
          });
        }
        setEmail("");
      }
    } catch (error) {
      console.error("Lỗi trong quá trình đăng ký:", error);
      toast.error("Không thể đăng ký. Vui lòng thử lại sau.", {
        autoClose: 2000,
        position: "top-center",
      });
    }
  };

  return (
    <div className="containerFooter">
      <div className="containerSub">
        <div className="avaSub">
          <img src={logo} alt="logo" className="logoSub" />
        </div>
        <div className="subscribeContainer">
          <div className="titleRegisterDocumentNew">
            Đăng ký nhận tài liệu mới
          </div>
          <div className="containerEmailRegister">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Nhập email...."
              className="subscribeInput"
            />
            <Button onClick={handleSubscribe} className="subscribeButton">
              Đăng ký
            </Button>
          </div>
        </div>
      </div>

      <p className="titleFooter">Địa chỉ: Trâu Quỳ - Gia Lâm - Hà Nội</p>
      <p className="titleFooter">
        Điện thoại: (024) 62617701 - Fax: (024) 38276554 / cntt@vnua.edu.vn
      </p>
      <p className="titleFooter">Copyright @2024</p>

      {/* <ToastContainer /> */}
    </div>
  );
};

export default Footer;
