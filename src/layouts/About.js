import React from "react";
import img from "../assets/MyPhoto.jpg";

function About() {
  return (
    <div className="containerAbout">
      <div className="containerAbout">
        <img src={img} alt="avatar" className="imgAbout" />
        <div className="titleNameAbout">Họ Tên: Vũ Văn Hải</div>
        <div className="itemMssvAbout">MSV: 642328</div>
        <div className="itemClassABout">Lớp: K64ATTT</div>
        <div className="itemText">
          <p>
            Chào mừng bạn đến với EduTech VNUA – nền tảng chia sẻ tài liệu công
            nghệ thông tin và học thuật miễn phí, nơi tri thức hội tụ.
          </p>
          <p>
            Chúng tôi cung cấp kho tài liệu đa dạng, được cập nhật liên tục,
            cùng công cụ tìm kiếm thông minh giúp bạn dễ dàng tìm thấy thông tin
            cần thiết. Giao diện thân thiện và chuyên nghiệp đảm bảo trải nghiệm
            tối ưu cho người dùng..
          </p>
          <p>
            Hãy tham gia cộng đồng EduTech VNUA để khám phá, thảo luận và kết
            nối với những người cùng đam mê tri thức. Cùng chúng tôi mở ra cánh
            cửa dẫn đến thành công của bạn!
          </p>
        </div>
      </div>
    </div>
  );
}

export default About;
