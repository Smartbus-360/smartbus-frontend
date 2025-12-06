import React, { useEffect, useState } from "react";
import { Table, Button, Modal, Form, Input, Tag, message, Space, Spin } from "antd";
import { QRCode ,Select} from "antd";
import API from "../api/axios"; // ✅ axios instance

export default function ManageAttendanceTakers() {
  const [takers, setTakers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTaker, setEditingTaker] = useState(null);
  const [form] = Form.useForm();

  const [qrModal, setQrModal] = useState({ visible: false, data: null });
  const [qrLoading, setQrLoading] = useState(false);
  const [qrStatus, setQrStatus] = useState({}); 

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

  const handleGenerateQR = async (takerId) => {
    setQrLoading(true);
    try {
      const res = await API.post("/attendance-takers/generate-qr", {
        attendanceTakerId: takerId,
      });
      setQrModal({
        visible: true,
        data: res.data.data, // { token, qrData }
      });
      message.success("QR generated successfully");
      setQrStatus((prev) => ({ ...prev, [takerId]: true }));
    } catch (err) {
      message.error("Failed to generate QR");
    } finally {
      setQrLoading(false);
    }
  };


  const handleRevokeQR = async (takerId) => {
    Modal.confirm({
      title: "Revoke QR access for this Attendance Taker?",
      okText: "Yes, Revoke",
      okType: "danger",
      onOk: async () => {
        try {
          await API.post("/attendance-takers/revoke-qr", {
            attendanceTakerId: takerId,
          });
          message.success("QR revoked successfully");
          setQrStatus((prev) => ({ ...prev, [takerId]: false }));
        } catch (err) {
          message.error("Failed to revoke QR");
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
  title: "Role",
  dataIndex: "role",
  key: "role",
  render: (role) =>
    role === "teacher" ? (
      <Tag color="blue">Teacher</Tag>
    ) : (
      <Tag color="purple">Taker</Tag>
    ),
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
      title: "QR Status",
      key: "qrstatus",
      render: (_, record) => (
        <Tag color={qrStatus[record.id] ? "green" : "red"}>
          {qrStatus[record.id] ? "Active" : "Revoked"}
        </Tag>
      ),
    },
    {
      title: "QR Actions",
      key: "qractions",
      render: (_, record) => (
        <Space>
          <Button
            loading={qrLoading}
            type="link"
            onClick={() => handleGenerateQR(record.id)}
          >
            Generate QR
          </Button>
          <Button
            danger
            type="link"
            onClick={() => handleRevokeQR(record.id)}
          >
            Revoke
          </Button>
        </Space>
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
          <Form.Item
  label="Role"
  name="role"
  rules={[{ required: true, message: "Please select a role" }]}
>
  <Select placeholder="Select role">
    <Select.Option value="taker">Attendance Taker</Select.Option>
    <Select.Option value="teacher">Teacher</Select.Option>
  </Select>
</Form.Item>

        </Form>
      </Modal>
            {/* ✅ QR Modal */}
      <Modal
        open={qrModal.visible}
        onCancel={() => setQrModal({ visible: false, data: null })}
        footer={null}
        title="Attendance-Taker QR Code"
      >
        {qrModal.data ? (
          <div style={{ textAlign: "center" }}>
            <QRCode value={qrModal.data.qrData} size={200} />
            <p style={{ marginTop: 10 }}>
              <strong>Token:</strong> {qrModal.data.token}
            </p>
            <Button
  style={{ marginTop: 15 }}
  onClick={() => {
    const canvas = document.querySelector("canvas");
    const link = document.createElement("a");
    link.download = `attendance_taker_qr_${qrModal.data.token}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  }}
>
  ⬇️ Download QR
</Button>
          </div>
        ) : (
          <p>Loading QR...</p>
        )}
      </Modal>
    </div>
  );
}
