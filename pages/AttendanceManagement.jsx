// import React, { useEffect, useState } from "react";
// import { Table, Button, Modal, message, Spin, Tag } from "antd";
// import API from "../api/axios"; // your axios base instance
// // import StudentAttendanceModal from "./pages/StudentAttendanceModal.jsx";
// import StudentAttendanceModal from "./StudentAttendanceModal.jsx";
// import { message, Button, Table, Tag, Spin } from "antd";


// export default function AttendanceManagement() {
//   const [students, setStudents] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [selectedStudent, setSelectedStudent] = useState(null);
//   const [attendanceModalVisible, setAttendanceModalVisible] = useState(false);

//   const fetchStudents = async () => {
//     setLoading(true);
//     try {
//       const res = await API.get("/users/school-students");
//       setStudents(res.data);
//     } catch (err) {
//       message.error("Failed to load students");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchStudents();
//   }, []);

//   const generateQR = async (studentId) => {
//     try {
//       await API.post(`/attendance/qr/generate/${studentId}`);
//       message.success("QR generated successfully");
//       fetchStudents();
//     } catch {
//       message.error("Failed to generate QR");
//     }
//   };

//   const handleGenerateQR = async (studentId) => {
//   try {
//     const res = await API.post(`/generate/${studentId}`);
//     message.success("QR generated successfully");
//     fetchStudents(); // reload list
//   } catch (err) {
//     message.error("Failed to generate QR");
//   }
// };

// const handleRevokeQR = async (studentId) => {
//   try {
//     await API.post(`/revoke/${studentId}`);
//     message.success("QR revoked successfully");
//     fetchStudents();
//   } catch (err) {
//     message.error("Failed to revoke QR");
//   }
// };


//   const revokeQR = async (studentId) => {
//     try {
//       await API.post(`/attendance/qr/revoke/${studentId}`);
//       message.success("QR revoked successfully");
//       fetchStudents();
//     } catch {
//       message.error("Failed to revoke QR");
//     }
//   };

//   const viewAttendance = (student) => {
//     setSelectedStudent(student);
//     setAttendanceModalVisible(true);
//   };

//   const columns = [
//     {
//       title: "Name",
//       dataIndex: "username",
//       key: "username",
//     },
//     {
//       title: "Registration No",
//       dataIndex: "registrationNumber",
//       key: "registrationNumber",
//     },
//     {
//       title: "QR Status",
//       dataIndex: "qr_active",
//       key: "qr_active",
//       render: (active) => (
//         <Tag color={active ? "green" : "volcano"}>{active ? "Active" : "Revoked"}</Tag>
//       ),
//     },
//     {
//   title: "QR Code",
//   dataIndex: "qr_image_url",
//   render: (url) =>
//     url ? (
//       <img src={url} alt="QR" width={70} height={70} />
//     ) : (
//       <Tag color="volcano">No QR</Tag>
//     ),
// },
// {
//   title: "Actions",
//   render: (record) => (
//     <>
//       <Button
//         type="primary"
//         onClick={() => handleGenerateQR(record.id)}
//         disabled={record.qr_active}
//       >
//         Generate QR
//       </Button>
//       <Button
//         danger
//         className="ml-2"
//         onClick={() => handleRevokeQR(record.id)}
//       >
//         Revoke QR
//       </Button>
//     </>
//   ),
// }
// ,
//     {
//       title: "Actions",
//       key: "actions",
//       render: (_, student) => (
//         <>
//           {student.qr_active ? (
//             <Button danger size="small" onClick={() => revokeQR(student.id)}>
//               Revoke QR
//             </Button>
//           ) : (
//             <Button type="primary" size="small" onClick={() => generateQR(student.id)}>
//               Generate QR
//             </Button>
//           )}
//           <Button
//             style={{ marginLeft: 10 }}
//             onClick={() => viewAttendance(student)}
//           >
//             View Attendance
//           </Button>
//         </>
//       ),
//     },
//   ];

//   return (
//     <div style={{ padding: 20 }}>
//       <h2>🎓 Student Attendance Management</h2>
//       {loading ? (
//         <Spin />
//       ) : (
//         <Table
//           dataSource={students}
//           columns={columns}
//           rowKey="id"
//           pagination={{ pageSize: 10 }}
//         />
//       )}
//       {attendanceModalVisible && (
//         <StudentAttendanceModal
//           visible={attendanceModalVisible}
//           onCancel={() => setAttendanceModalVisible(false)}
//           student={selectedStudent}
//         />
//       )}
//     </div>
//   );
// }


import React, { useEffect, useState } from "react";
import { Table, Button, message, Spin, Tag,Modal, Image  } from "antd";
import API from "../api/axios";
import StudentAttendanceModal from "./StudentAttendanceModal.jsx";

export default function AttendanceManagement() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [attendanceModalVisible, setAttendanceModalVisible] = useState(false);
const [qrPreviewVisible, setQrPreviewVisible] = useState(false);
const [selectedQr, setSelectedQr] = useState(null);

  // ✅ Fetch all students (modify API if needed)
  const fetchStudents = async () => {
    setLoading(true);
    try {
      const res = await API.get("/users/school-students");
      setStudents(res.data);
    } catch (err) {
      message.error("Failed to load students");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  // ✅ Generate QR for a student
  const handleGenerateQR = async (studentId) => {
    try {
      await API.post(`/attendance/qr/generate/${studentId}`);
      message.success("QR generated successfully");
      fetchStudents();
    } catch (err) {
      message.error("Failed to generate QR");
    }
  };

  // ✅ Revoke QR for a student
  const handleRevokeQR = async (studentId) => {
    try {
      await API.post(`/attendance/qr/revoke/${studentId}`);
      message.success("QR revoked successfully");
      fetchStudents();
    } catch (err) {
      message.error("Failed to revoke QR");
    }
  };

  // ✅ Open student attendance modal
  const viewAttendance = (student) => {
    setSelectedStudent(student);
    setAttendanceModalVisible(true);
  };

  // ✅ Table columns
  const columns = [
    {
      title: "Name",
      dataIndex: "username",
      key: "username",
    },
    {
      title: "Registration No",
      dataIndex: "registrationNumber",
      key: "registrationNumber",
    },
    {
      title: "QR Status",
      dataIndex: "is_active",
      key: "is_active",
      render: (active) => (
        <Tag color={active ? "green" : "volcano"}>
          {active ? "Active" : "Revoked"}
        </Tag>
      ),
    },
    // {
    //   title: "QR Code",
    //   dataIndex: "qr_image_url",
    //   render: (url) =>
    //     url ? (
    //       <img
    //         src={url}
    //         alt="QR"
    //         width={70}
    //         height={70}
    //         style={{ borderRadius: 4 }}
    //       />
    //     ) : (
    //       <Tag color="volcano">No QR</Tag>
    //     ),
    // },
    {
  title: "QR Code",
  dataIndex: "qr_image_url",
  render: (url) =>
    url ? (
      <>
        <img
          src={`http://localhost:3000${url}`}
          alt="QR"
          width={70}
          height={70}
          style={{ borderRadius: 4, cursor: "pointer" }}
          onClick={() => {
            setSelectedQr(`http://localhost:3000${url}`);
            setQrPreviewVisible(true);
          }}
        />
        <Button
          size="small"
          type="link"
          onClick={() => window.open(`http://localhost:3000${url}`, "_blank")}
        >
          Download
        </Button>
      </>
    ) : (
      <Tag color="volcano">No QR</Tag>
    ),
},

    {
      title: "Actions",
      key: "actions",
      render: (record) => (
        <>
          {record.is_active ? (
            <Button
              danger
              size="small"
              onClick={() => handleRevokeQR(record.id)}
            >
              Revoke QR
            </Button>
          ) : (
            <Button
              type="primary"
              size="small"
              onClick={() => handleGenerateQR(record.id)}
            >
              Generate QR
            </Button>
          )}
          <Button
            style={{ marginLeft: 10 }}
            onClick={() => viewAttendance(record)}
          >
            View Attendance
          </Button>
        </>
      ),
    },
  ];

  return (
    <div style={{ padding: 20 }}>
      <h2>🎓 Student Attendance Management</h2>

      {loading ? (
        <Spin />
      ) : (
        <Table
          dataSource={students}
          columns={columns}
          rowKey="id"
          pagination={{ pageSize: 10 }}
        />
      )}

      {attendanceModalVisible && (
        <StudentAttendanceModal
          visible={attendanceModalVisible}
          onCancel={() => setAttendanceModalVisible(false)}
          student={selectedStudent}
        />
      )}
      <Modal
  open={qrPreviewVisible}
  onCancel={() => setQrPreviewVisible(false)}
  footer={null}
  centered
>
  <div style={{ textAlign: "center" }}>
    <Image
      src={selectedQr}
      alt="QR Preview"
      width={300}
      height={300}
      style={{ borderRadius: 8 }}
    />
    <Button
      type="primary"
      style={{ marginTop: 10 }}
      onClick={() => window.open(selectedQr, "_blank")}
    >
      Download QR
    </Button>
  </div>
</Modal>

    </div>
  );
}
