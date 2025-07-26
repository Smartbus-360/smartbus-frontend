import React, { useState, useEffect } from "react";
import { Button, TextField, Snackbar, Alert, MenuItem, FormControlLabel,
  Checkbox, } from "@mui/material";
import {
  DataGrid,
  Column,
  Paging,
  Pager,
  Editing,
  SearchPanel,
} from "devextreme-react/data-grid";
import "devextreme/dist/css/dx.material.blue.light.css";
import axiosInstance from "../../../api/axios";
import { getUser } from "../../../config/authService";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [newNotification, setNewNotification] = useState({
    message: "",
    instituteType: "",
    expiryDate: "",
    isMandatory: false,
  });
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const token = sessionStorage.getItem("authToken");
  const user = getUser();
  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const response = await axiosInstance.get("notifications");

      const formattedNotifications = response.data.notifications.map(
        (notification) => ({
          ...notification,
          id: Number(notification.id),
        })
      );

      setNotifications(formattedNotifications);
    } catch (error) {
      console.error("Error fetching notification:", error);
      showSnackbar("Error fetching notification");
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === "checkbox") {
      setNewNotification((prev) => ({
        ...prev,
        [name]: checked ? 1 : 0,
      }));
    }else {
      setNewNotification((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
    // setNewNotification({ ...newNotification, [name]: value });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const role = user?.role || "";
    if (role === "viewer") {
      setSnackbar({
        open: true,
        message:
          "You do not have the necessary permissions to perform this action",
        severity: "error",
      });
      return;
    }
    try {
      await axiosInstance.post("notifications/create", newNotification);

      setNewNotification({ message: "", instituteType: "", expiryDate: "", isMandatory: false });
      fetchNotifications();
      setSnackbarMessage("Notification sent successfully!");
      setSnackbarOpen(true);
    } catch (error) {
      console.error("Error adding notification:", error);
      setSnackbarMessage("Error adding notification");
      setSnackbarOpen(true);
    }
  };

  const handleDeleteNotification = async (notification) => {
    const role = user?.role || "";
    if (role === "viewer") {
      setSnackbar({
        open: true,
        message:
          "You do not have the necessary permissions to perform this action",
        severity: "error",
      });
      return;
    }
    try {
      const response = await axiosInstance.delete(
        `notifications/${notification}`
      );
      fetchNotifications();
      setSnackbarMessage("Notification deleted successfully!");
      setSnackbarOpen(true);
    } catch (error) {
      console.error("Error deleting notification:", error);
      showSnackbar("Error deleting notification");
    }
  };

  const showSnackbar = (message) => {
    setSnackbarMessage(message);
    setSnackbarOpen(true);
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  const renderHtmlContent = (cellData) => {
    return <div dangerouslySetInnerHTML={{ __html: cellData.value }} />;
  };

  return (
    <div className="p-6 mt-4 bg-gradient-to-r from-gray-100 to-gray-200 rounded-lg shadow-lg max-w-full mx-auto">
      <h2 className="mb-6 text-3xl font-semibold text-gray-800">
        Manage Notifications
      </h2>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
      >
        <Alert onClose={handleCloseSnackbar} severity="info">
          {snackbarMessage}
        </Alert>
      </Snackbar>

      <div className="mb-6">
        <h3 className="text-xl mb-4">Add New Notification</h3>
        <form onSubmit={handleFormSubmit}>
          <div className="mb-4">
            <ReactQuill
              name="message"
              value={newNotification.message}
              onChange={(value) =>
                setNewNotification({ ...newNotification, message: value })
              }
              theme="snow"
              placeholder="Enter message here..."
              className="custom-quill-editor"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            {/* <TextField
              name="message"
              label="Message"
              value={newNotification.message}
              onChange={handleInputChange}
              fullWidth
            /> */}
            <TextField
              select
              name="instituteType"
              label="Institution Type"
              value={newNotification.instituteType}
              onChange={handleInputChange}
              fullWidth
            >
              <MenuItem value="college">College</MenuItem>
              <MenuItem value="school">School</MenuItem>
              <MenuItem value="university">University</MenuItem>
              <MenuItem value="company">Company</MenuItem>
            </TextField>
            <TextField
              name="expiryDate"
              label="Expiry Date"
              type="date"
              InputLabelProps={{ shrink: true }}
              value={newNotification.expiryDate}
              onChange={handleInputChange}
              fullWidth
            />
            <FormControlLabel
              control={
                <Checkbox
                  name="isMandatory"
                  checked={newNotification.isMandatory}
                  onChange={handleInputChange}
                />
              }
              label="Mandatory"
            />
            <Button
              variant="contained"
              color="primary"
              onClick={handleFormSubmit}
            >
              Send Notification
            </Button>
          </div>
        </form>
      </div>
      <h3 className="text-xl mb-4">Manage Notifications</h3>
      <div
        style={{
          minHeight: "600px",
          height: "auto",
          width: "100%",
          marginTop: "16px",
        }}
      >
        <DataGrid
          dataSource={notifications}
          keyExpr="id"
          showBorders={true}
          //   onRowUpdating={(e) => handleUpdateAdvertisement(e.oldData.id, e.newData)}
          onRowRemoving={(e) => handleDeleteNotification(e.data.id)}
          rowAlternationEnabled={true}
          allowColumnResizing={true}
          scrolling={{ mode: "virtual", useNative: true }}
        >
          <Editing
            mode="cell"
            allowUpdating={true}
            allowDeleting={true}
            allowAdding={false}
            useIcons={true}
          />
          <SearchPanel visible={true} highlightCaseSensitive={true} />
          <Paging defaultPageSize={5} />
          <Pager showPageSizeSelector={false} showInfo={true} />

          <Column
            dataField="message"
            caption="Message"
            minWidth={150}
            cellRender={renderHtmlContent}
          />
          <Column
            dataField="instituteType"
            caption="Institution Type"
            lookup={{
              dataSource: [
                { value: "college", display: "College" },
                { value: "school", display: "School" },
                { value: "university", display: "University" },
                { value: "company", display: "Company" },
              ],
              valueExpr: "value",
              displayExpr: "display",
            }}
            minWidth={150}
          />
          <Column
            dataField="expiryDate"
            caption="Expiry Date"
            dataType="date"
            minWidth={150}
          />

          {/* Command Column for Save/Delete */}
          <Column type="buttons" buttons={["delete"]} minWidth={150} />
        </DataGrid>
      </div>
    </div>
  );
};

export default Notifications;
