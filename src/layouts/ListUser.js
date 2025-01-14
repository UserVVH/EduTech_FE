import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Table,
  Card,
  Input,
  Avatar,
  Typography,
  Space,
  Alert,
  Tag,
} from "antd";
import {
  UserOutlined,
  SearchOutlined,
  FileTextOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import styles from "./css/ListUser.module.css";

const { Title } = Typography;

function ListUser() {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      const authToken = localStorage.getItem("authToken");
      if (!authToken) {
        navigate("/login");
        return;
      }

      setLoading(true);
      try {
        const response = await fetch(
          "http://localhost:8080/api/user/by-document-count",
          {
            headers: {
              Authorization: `${authToken}`,
            },
          }
        );
        if (!response.ok) throw new Error("Failed to fetch users");
        const data = await response.json();
        setUsers(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [navigate]);

  const handleUserClick = (userId) => {
    navigate(`/documents/user/${userId}/verified`);
  };

  const filteredUsers = users.filter((user) =>
    user.fullname.toLowerCase().includes(searchText.toLowerCase())
  );

  const columns = [
    {
      title: "STT",
      key: "index",
      width: 80,
      render: (_, __, index) => index + 1,
    },
    {
      title: "Người dùng",
      key: "user",
      render: (_, record) => (
        <Space>
          <Avatar
            size={40}
            src={record.avatar}
            icon={<UserOutlined />}
            className={styles.userAvatar}
          />
          <span className={styles.userName}>{record.fullname}</span>
        </Space>
      ),
    },
    {
      title: "Tổng tài liệu",
      dataIndex: "documentCount",
      key: "documentCount",
      render: (count) => (
        <Tag color="blue" icon={<FileTextOutlined />}>
          {count} tài liệu
        </Tag>
      ),
    },
    {
      title: "Tổng lượt xem",
      dataIndex: "totalViews",
      key: "totalViews",
      render: (views) => (
        <Tag color="green" icon={<EyeOutlined />}>
          {views} lượt xem
        </Tag>
      ),
    },
  ];

  return (
    <div className={styles.container}>
      <Card className={styles.headerCard}>
        <Title level={2}>Danh sách người dùng đăng bài</Title>
        <Input
          placeholder="Tìm kiếm người dùng..."
          prefix={<SearchOutlined />}
          onChange={(e) => setSearchText(e.target.value)}
          className={styles.searchInput}
        />
      </Card>

      {error && (
        <Alert
          message="Error"
          description={error}
          type="error"
          showIcon
          className={styles.errorAlert}
        />
      )}

      <Card className={styles.tableCard}>
        <Table
          columns={columns}
          dataSource={filteredUsers}
          rowKey="userId"
          loading={loading}
          pagination={{
            pageSize: 10,
            showSizeChanger: false,
            showTotal: (total) => `Tổng số ${total} người dùng`,
          }}
          onRow={(record) => ({
            onClick: () => handleUserClick(record.userId),
            className: styles.tableRow,
          })}
        />
      </Card>
    </div>
  );
}

export default ListUser;
