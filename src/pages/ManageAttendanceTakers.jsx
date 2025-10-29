import React, { useEffect, useState } from "react";
import { Table, Button, Modal, Form, Input, Tag, message, Space, Spin } from "antd";
import API from "../api/axios"; // ✅ axios instance

export default function ManageAttendanceTakers() {
  const [takers, setTakers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTaker, setEditingTaker] = useState(null);
  const [form] = Form.useForm();

  // ✅ Fetch all attendance-takers
  const fetchTakers = async () => {
    setLoading(true);
    try {
      const res = await API.get("/attendance-takers");
      setTakers(res.data);
    } catch (err) {
      message.error("Failed to load attendance-takers");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTakers();
  }, []);

  // ✅ Add / Update Attendance-Taker
  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      if (editingTaker) {
        await API.put(`/attendance-takers/${editingTaker.id}`, values);
        message.success("Attendance-Taker updated successfully");
      } else {
        await API.post("/attendance-takers", values);
        message.success("Attendance-Taker added successfully");
      }
      fetchTakers();
      setIsModalOpen(false);
      form.resetFields();
      setEditingTaker(null);
    } catch (err) {
      message.error("Error saving Attendance-Taker");
    }
  };

  // ✅ Delete Attendance-Taker
  const handleDelete = async (id) => {
    Modal.confirm({
      title: "Are you sure you want to delete this Attendance-Taker?",
      okText: "Yes",
      okType: "danger",
      onOk: async () => {
        try {
          await API.delete(`/attendance-takers/${id}`);
          message.success("Deleted successfully");
          fetchTakers();
        } catch {
          message.error("Failed to delete");
        }
      },
    });
  };

  // ✅ Open Add/Edit Modal
  const openModal = (record = null) => {
    setEditingTaker(record);
    form.resetFields();
    if (record) form.setFieldsValue(record);
    setIsModalOpen(true);
  };

  // ✅ Columns for Table
  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Phone",
      dataIndex: "phone",
      key: "phone",
    },
    {
      title: "Status",
      dataIndex: "availabilityStatus",
      key: "availabilityStatus",
      render: (status) => (
        <Tag color={status === "Available" ? "green" : "volcano"}>
          {status || "Unknown"}
        </Tag>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Button type="link" onClick={() => openModal(record)}>
            Edit
          </Button>
          <Button danger type="link" onClick={() => handleDelete(record.id)}>
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: 20 }}>
      <h2>👥 Attendance-Taker Management</h2>
      <Button
        type="primary"
        style={{ marginBottom: 15 }}
        onClick={() => openModal()}
      >
        ➕ Add Attendance-Taker
      </Button>

      {loading ? (
        <Spin />
      ) : (
        <Table
          dataSource={takers}
          columns={columns}
          rowKey="id"
          pagination={{ pageSize: 10 }}
        />
      )}

      <Modal
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={handleSubmit}
        title={editingTaker ? "Edit Attendance-Taker" : "Add Attendance-Taker"}
      >
        <Form layout="vertical" form={form}>
          <Form.Item
            label="Full Name"
            name="name"
            rules={[{ required: true, message: "Please enter full name" }]}
          >
            <Input placeholder="Enter name" />
          </Form.Item>

          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: "Please enter email" },
              { type: "email", message: "Invalid email format" },
            ]}
          >
            <Input placeholder="Enter email" />
          </Form.Item>

          {!editingTaker && (
            <Form.Item
              label="Password"
              name="password"
              rules={[{ required: true, message: "Please enter password" }]}
            >
              <Input.Password placeholder="Enter password" />
            </Form.Item>
          )}

          <Form.Item label="Phone" name="phone">
            <Input placeholder="Enter phone number" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
