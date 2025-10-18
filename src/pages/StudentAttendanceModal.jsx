import React, { useEffect, useState } from "react";
import { Modal, Table, Spin, message } from "antd";
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
