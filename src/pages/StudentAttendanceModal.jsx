import React, { useEffect, useState } from "react";
import { Modal, Table, Spin, message,Button } from "antd";
import API from "../api/axios";

export default function StudentAttendanceModal({ visible, onCancel, student }) {
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(false);

  

  const fetchAttendance = async () => {
    setLoading(true);
    try {
      const res = await API.get(`/attendance/student/${student.registrationNumber}`);
      setAttendance(res.data);
    } catch {
      message.error("Failed to fetch attendance history");
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadExcel = async () => {
  try {
    const token = localStorage.getItem("token");

    const response = await fetch(
      `${import.meta.env.VITE_API_BASE_URL}/attendance/student-export/${student.id}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to download");
    }

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `attendance_${student.username}.xlsx`;
    document.body.appendChild(a);
    a.click();
    a.remove();

  } catch (err) {
    message.error("Failed to download Excel");
  }
};

  useEffect(() => {
    if (visible) fetchAttendance();
  }, [visible]);

  const columns = [
    { title: "Bus ID", dataIndex: "bus_id", key: "bus_id" },
    { title: "Driver ID", dataIndex: "driver_id", key: "driver_id" },
    { title: "Latitude", dataIndex: "latitude", key: "latitude" },
    { title: "Longitude", dataIndex: "longitude", key: "longitude" },
    { title: "Time (IST)", dataIndex: "scan_time", key: "scan_time" },
  ];

  return (
    <Modal
      open={visible}
      onCancel={onCancel}
      width={700}
      footer={null}
      title={`Attendance History - ${student.username}`}
    >
      <Button
  type="primary"
  style={{ marginBottom: 15 }}
  onClick={() => handleDownloadExcel()}
>
  Download Excel
</Button>

      {loading ? (
        <Spin />
      ) : (
        <Table
          dataSource={attendance}
          columns={columns}
          rowKey="id"
          pagination={{ pageSize: 8 }}
        />
      )}
    </Modal>
  );
}
