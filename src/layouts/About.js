import React from "react";
import { Row, Col, Card, Typography, Avatar, Space, Divider } from "antd";
import { UserOutlined, BookOutlined, TeamOutlined } from "@ant-design/icons";
import img from "../assets/fita.png";
import styles from "./css/About.module.css";

const { Title, Paragraph } = Typography;

function About() {
  return (
    <div className={styles.aboutWrapper}>
      <Row gutter={[24, 24]} justify="center" align="middle">
        <Col xs={24} md={8}>
          <div className={styles.profileSection}>
            <Avatar
              src={img}
              size={200}
              alt="avatar"
              className={styles.profileImage}
            />
            <div className={styles.profileInfo}>
              <Title level={3}>Vũ Văn Hải</Title>
              <Space direction="vertical" size="small">
                <div className={styles.infoItem}>
                  <UserOutlined /> MSV: 642328
                </div>
                <div className={styles.infoItem}>
                  <TeamOutlined /> Lớp: K64ATTT
                </div>
              </Space>
            </div>
          </div>
        </Col>

        <Col xs={24} md={16}>
          <Card
            className={styles.welcomeCard}
            title={
              <Space>
                <BookOutlined />
                <span>Giới thiệu về EduTech VNUA</span>
              </Space>
            }
          >
            <Typography>
              <Paragraph className={styles.paragraph}>
                Chào mừng bạn đến với EduTech VNUA – nền tảng chia sẻ tài liệu
                công nghệ thông tin và học thuật miễn phí, nơi tri thức hội tụ.
              </Paragraph>
              <Divider className={styles.divider} />
              <Paragraph className={styles.paragraph}>
                Chúng tôi cung cấp kho tài liệu đa dạng, được cập nhật liên tục,
                cùng công cụ tìm kiếm thông minh giúp bạn dễ dàng tìm thấy thông
                tin cần thiết. Giao diện thân thiện và chuyên nghiệp đảm bảo
                trải nghiệm tối ưu cho người dùng.
              </Paragraph>
              <Divider className={styles.divider} />
              <Paragraph className={styles.paragraph}>
                Hãy tham gia cộng đồng EduTech VNUA để khám phá, thảo luận và
                kết nối với những người cùng đam mê tri thức. Cùng chúng tôi mở
                ra cánh cửa dẫn đến thành công của bạn!
              </Paragraph>
            </Typography>
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default About;
