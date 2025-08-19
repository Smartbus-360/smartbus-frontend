import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  DataGrid,
  Column,
  Paging,
  Pager,
  Lookup,
  Editing,
  SearchPanel,
  Toolbar,
  Item,
  Export,
  Selection,
  GridButton,
  RequiredRule,
} from "devextreme-react/data-grid";
import "devextreme/dist/css/dx.material.blue.light.css";
import {
  Button,
  TextField,
  Select,
  MenuItem,
  Snackbar,
  Alert,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tooltip,
  FormControl,
  InputLabel,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import SaveIcon from "@mui/icons-material/Save";
import axiosInstance from "../../../api/axios";
import { getUser } from "../../../config/authService";

const convertUrlToFile = async (url, fileName = "logo.png") => {
  const response = await fetch(url);
  const blob = await response.blob();
  const file = new File([blob], fileName, { type: blob.type });
  return file;
};

const ManageUser = () => {
  const [users, setUsers] = useState([]);
  const [institutes, setInstitutes] = useState([]);
  const [stoppages, setStoppages] = useState([]);
  const [stoppageId, setStoppageId] = useState("");
  const [instituteId, setInstituteId] = useState("");
const [newUser, setNewUser] = useState({
  registrationNumber: "",
  password: "",
  instituteCode: "",
  stop:"",
});
  const [profilePicturePreview, setProfilePicturePreview] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [openModal, setOpenModal] = useState(false);
  const handleSnackbarClose = () => setSnackbar({ ...snackbar, open: false });
  const token = sessionStorage.getItem("authToken");
  const [editedUsers, setEditedUsers] = useState({});
  useEffect(() => {
    fetchInitialData();
  }, []);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const user = getUser();
  const fetchInitialData = async () => {
    try {
      const [usersResponse, institutesResponse, stoppagesResponse] =
        await Promise.all([
          axiosInstance.get("users"),
          axiosInstance.get("institutes"),
          axiosInstance.get("stoppages"),
        ]);
      setUsers(usersResponse.data);
      setInstitutes(institutesResponse.data);
      setStoppages(stoppagesResponse.data.stoppages);
    } catch (err) {
      setSnackbar({
        open: true,
        message: "Failed to load data.",
        severity: "error",
      });
    }
  };
  const totalPages = Math.ceil(users.length / pageSize);

  // Paginated data
  const paginatedUsers = users.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  // const paginatedUsers = users.slice(
  //   currentPage * pageSize,
  //   currentPage * pageSize + pageSize
  // );

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setNewUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleStoppageChange = (event) => {
    setStoppageId(event.target.value);
    setNewUser((prev) => ({ ...prev, stop: event.target.value }));
  };

  const handleInstituteChange = (event) => {
    setInstituteId(event.target.value);
    setNewUser((prev) => ({ ...prev, institute: event.target.value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setNewUser((prev) => ({ ...prev, profilePicture: file }));
    setProfilePicturePreview(URL.createObjectURL(file));
  };

const handleAddUser = async () => {
  const { registrationNumber, instituteCode,stop } = newUser;

  if (!registrationNumber || !instituteCode ||!stop) {
    setSnackbar({
      open: true,
      message: "Please provide both registration number and institute code,Stoppage",
      severity: "error",
    });
    return;
  }
    console.log("Sending data:", {
    registrationNumber,
    instituteCode,
    stopId: stop,
  });

  // const response = await axiosInstance.post("pending-student",{
  //   registrationNumber,
  //   instituteCode,
  //   stopId: stop,

  // });

    // const payload = {
    //   ...newUser,
    //   institute: instituteId,
    //   stop: stoppageId,
    //   status: "active"
    // };

    const formData = new FormData();
    Object.keys(newUser).forEach((key) => {
      formData.append(key, newUser[key]);
    });

    // formData.append("institute", instituteId);
    // formData.append("stop", stoppageId);
    // formData.append("status", "active");

  try {
    const response = await axiosInstance.post("pending-student", {
      registrationNumber,
      instituteCode,
      stopId: stop,
    });

    if (response.data.success) {
      fetchInitialData();
      setSnackbar({
        open: true,
        message: `Student added! Temp password: ${response.data.tempPassword}`,
        severity: "success",
      });
      setOpenModal(false);
      setNewUser({ registrationNumber: "", instituteCode: "" ,stop:""});
    } else {
      setSnackbar({
        open: true,
        message: "Failed to add student.",
        severity: "error",
      });
    }
} catch (error) {
  console.error("Backend error:", error.response?.data || error.message);
    setSnackbar({
      open: true,
      message: error.response?.data?.message || "Error adding student.",
      severity: "error",
    });
  }
};

  const handleCellEditCommit = async (params) => {
    const { id, field, value } = params;
    // Find the user being updated
    const updatedUser = users.find((user) => user.id === id);
    if (!updatedUser) return; // Safety check
    // Update the specific field of the user with the new value
    const updatedUserData = { ...updatedUser, [field]: value };
    // Now call the update handler with the updated user data
    handleUpdateUser(id, updatedUserData);
  };

  const handleUpdateUser = async (userId, updatedData = {}) => {
    const role = user?.role || "";
    if (role === "viewer") {
      setSnackbar({
        open: true,
        message: "You do not have the necessary permissions to perform this action",
        severity: "error",
      });
      return;
    }
    // Find the selected user in the current user list
    const selectedUser = users.find((user) => user.id === userId);

    if (!selectedUser) {
      setSnackbar({
        open: true,
        message: "User not found.",
        severity: "error",
      });
      return;
    }

    const matchedInstitute = institutes.find(
      (institute) => institute.name === selectedUser.instituteName
    );

    // const matchedStops = stoppages.find(
    //   (institute) => institute.name === (selectedUser.instituteName)
    // );

    // Validate input for required fields
    // if (!updatedData.full_name && !selectedUser.full_name ||
    //   !updatedData.username && !selectedUser.username ||
    //   !updatedData.email && !selectedUser.email ||
    //   !updatedData.phone && !selectedUser.phone ||
    //   !updatedData.registrationNumber && !selectedUser.registrationNumber) {
    //   setSnackbar({ open: true, message: "Please fill in all required fields.", severity: "error" });
    //   return;
    // }
    const formData = new FormData();
    formData.append("full_name", updatedData.full_name ?? selectedUser.full_name ?? "");
    formData.append("username", updatedData.username ?? selectedUser.username);
    formData.append("email", updatedData.email ?? selectedUser.email);
    formData.append("phone", updatedData.phone ?? selectedUser.phone ?? "");
    formData.append("registrationNumber", updatedData.registrationNumber ?? selectedUser.registrationNumber ?? "");
    formData.append("institute", matchedInstitute?.id || "");
    formData.append("stop", updatedData.stop ?? selectedUser.stopId);
    formData.append("gender", updatedData.gender ?? selectedUser.gender ?? "");
    formData.append("address", updatedData.address ?? selectedUser.address ?? "");
    formData.append("emergency_contact_info", updatedData.emergency_contact_info ?? selectedUser.emergency_contact_info ?? "");
    formData.append("dateOfBirth", updatedData.dateOfBirth ?? selectedUser.dateOfBirth ?? "");
    formData.append("nationality", updatedData.nationality ?? selectedUser.nationality ?? "");
    formData.append("password", updatedData.password ?? selectedUser.password ?? "");
    formData.append("status", updatedData.status ?? selectedUser.status ?? "");
    formData.append("verified", "yes");
    formData.append("accountType", updatedData.accountType ?? selectedUser.accountType ?? "");
    formData.append("payment_status", updatedData.payment_status ?? selectedUser.payment_status ?? "na");
    formData.append("notes", updatedData.notes ?? selectedUser.notes ?? "");
    
    // Handle profile picture (File or URL)
    let file = null;
    if (updatedData.profilePicture instanceof File) {
      file = updatedData.profilePicture;
    } else if (typeof updatedData.profilePicture === "string") {
      file = await convertUrlToFile(updatedData.profilePicture);
    }
    
    if (file) {
      formData.append("profilePicture", file);
    }
    
    try {
      const response = await axiosInstance.put(`users/${userId}`, formData);
      if (response.data.success) {
        fetchInitialData();
        // const updatedUserData = response.data.user;
        // setUsers(users.map(user => (user.id === updatedUserData.id ? updatedUserData : user)));
        setSnackbar({
          open: true,
          message: "User updated successfully!",
          severity: "success",
        });
      } else {
        setSnackbar({
          open: true,
          message: "Failed to update user.",
          severity: "error",
        });
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Failed to update user.",
        severity: "error",
      });
    }
  };

  const handleDeleteUser = async (userId) => {
    const role = user?.role || "";
    if (role === "viewer") {
      setSnackbar({
        open: true,
        message: "You do not have the necessary permissions to perform this action",
        severity: "error",
      });
      return;
    }
    try {
      const response = await axiosInstance.delete(`users/${userId}`);
      if (response.data.message === "User deleted successfully.") {
        setUsers(users.filter((user) => user.id !== userId));
        setSnackbar({
          open: true,
          message: "User deleted successfully!",
          severity: "success",
        });
      } else {
        setSnackbar({
          open: true,
          message: "Failed to delete user.",
          severity: "error",
        });
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Failed to delete user.",
        severity: "error",
      });
    }
  };

  return (
    <div className="mx-auto mt-4 max-w-full rounded-lg bg-gradient-to-r from-gray-100 to-gray-200 p-6 shadow-2xl">
      <h2 className="mb-6 text-3xl font-semibold text-gray-800">
        Manage Users
      </h2>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
      <Button
        variant="contained"
        color="primary"
        className="mb-4 mt-2 w-full max-w-xs"
        onClick={() => setOpenModal(true)}
      >
        Add New User
      </Button>

      <Dialog
        open={openModal}
        onClose={() => setOpenModal(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Add New User</DialogTitle>
<DialogContent>
  <div className="grid grid-cols-1 gap-4 p-2">
    <TextField
      label="Registration Number"
      name="registrationNumber"
      value={newUser.registrationNumber}
      onChange={handleInputChange}
      fullWidth
      required
    />
    <TextField
      label="Institute Code"
      name="instituteCode"
      value={newUser.instituteCode}
      onChange={handleInputChange}
      fullWidth
      required
    />
    <FormControl fullWidth required>
  <InputLabel>Stoppage</InputLabel>
  <Select
    label="Stoppage"
    name="stop"
    value={newUser.stop}
    onChange={handleInputChange}
    fullWidth
  >
    <MenuItem value="">Select Stoppage</MenuItem>
    {stoppages.map((stoppage) => (
      <MenuItem key={stoppage.id} value={stoppage.id}>
        {stoppage.stopName} - {stoppage.routeName}
      </MenuItem>
    ))}
  </Select>
</FormControl>

  </div>
</DialogContent>

        <DialogActions>
          <Button onClick={() => setOpenModal(false)} color="secondary">
            Cancel
          </Button>
          <Button variant="contained" color="primary" onClick={handleAddUser}>
            Add User
          </Button>
        </DialogActions>
      </Dialog>
      <div style={{ minHeight: "600px", height: "auto", width: "100%", marginTop: "16px" }}>
        {/* <DataGrid
          rows={users}
          columns={columns}
          pageSize={5}
          checkboxSelection
          onRowEditCommit={(params) => handleUpdateUser(params.id, params)}
          onCellEditCommit={handleCellEditCommit}
          getRowClassName={(params) => "hover:bg-gray-100"}
          disableSelectionOnClick
          sortingOrder={["asc", "desc"]}
          sx={{
            "& .MuiDataGrid-columnHeaders": {
              backgroundColor: "#f5f5f5",
              fontWeight: "bold",
              fontSize: "16px",
            },
            "& .MuiDataGrid-row": {
              "&:hover": {
                backgroundColor: "#f0f0f0",
              },
            },
          }}
        /> */}
        <DataGrid
          dataSource={paginatedUsers}
          keyExpr="id"
          showBorders={true}
          rowAlternationEnabled={true}
          allowColumnResizing={true}
          onRowUpdating={(e) => handleUpdateUser(e.oldData.id, e.newData)}
          onRowRemoving={(e) => handleDeleteUser(e.data.id)}
          scrolling={{ mode: 'virtual', useNative: true }}
        >
          <Editing
            mode="cell"
            allowUpdating={true}
            allowDeleting={true}
            useIcons={true}
          />
          <SearchPanel visible={true} highlightCaseSensitive={true} />
          <Paging defaultPageSize={10} />
          <Pager showPageSizeSelector={false} showInfo={true} />

          {/* Define your columns with editable fields */}
          <Column dataField="full_name" caption="Full Name" minWidth={150}/>
          <Column dataField="username" caption="User Name" minWidth={150}/>
          <Column
            dataField="profilePicture"
            caption="Profile Picture"
            cellRender={(cellData) =>
              cellData.value ? (
                <img
                  src={cellData.value}
                  alt="Profile"
                  style={{ width: "50px", height: "50px", borderRadius: "4px" }}
                />
              ) : (
                "No Image"
              )
            }
            editCellComponent={({ data }) => (
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onloadend = () => data.setValue(reader.result);
                    reader.readAsDataURL(file);
                  }
                }}
              />
            )}
          minWidth={150}/>
          <Column dataField="email" caption="Email" minWidth={150}/>
          <Column dataField="phone" caption="Phone" minWidth={150}/>
          <Column dataField="registrationNumber" caption="Registration No." minWidth={150}/>
          <Column
            dataField="instituteName"
            caption="Institute Name"
            allowEditing={false}
          minWidth={150}/>
          <Column
            dataField="busNumber"
            caption="Bus Number"
            allowEditing={false}
          minWidth={150}/>
          <Column
            dataField="stopName"
            caption="Stoppage"
            allowEditing={false}
          minWidth={150}/>

          <Column
            dataField="stop"
            caption="Change Stoppage"
            lookup={{
              dataSource: stoppages,
              valueExpr: "id",
              displayExpr: "stopName",
            }}
          minWidth={150}/>

          <Column
            dataField="gender"
            caption="Gender"
            lookup={{
              dataSource: [
                { value: "male", display: "Male" },
                { value: "female", display: "Female" },
              ],
              valueExpr: "value",
              displayExpr: "display",
            }}
          minWidth={150}/>

          <Column dataField="address" caption="Address" minWidth={150}/>
          <Column
            dataField="emergency_contact_info"
            caption="mergency Contact"
          minWidth={150}/>
          <Column
            dataField="dateOfBirth"
            caption="Date of Birth"
            dataType="date"
          minWidth={150}/>
          <Column dataField="nationality" caption="Nationality" minWidth={150}/>
          <Column dataField="notes" caption="Notes" minWidth={150}/>
          <Column
            dataField="accountType"
            caption="Account Type"
            lookup={{
              dataSource: ["student", "staff", "admin"],
              valueExpr: "this",
              displayExpr: "this",
            }}
          minWidth={150}/>
          <Column
            dataField="payment_status"
            caption="Payment Status"
            lookup={{
              dataSource: ["na", "paid", "unpaid"],
              valueExpr: "this",
              displayExpr: "this",
            }}
          minWidth={150}/>
          <Column dataField="password" caption="Password" minWidth={150}/>
          <Column
            dataField="status"
            caption="Status"
            lookup={{
              dataSource: ["active", "inactive", "suspended"],
              valueExpr: "this",
              displayExpr: "this",
            }}
          minWidth={150}/>

          <Column
            type="buttons"
            buttons={[
              "edit",
              "delete",
              {
                hint: "Save Changes",
                icon: "save",
                onClick: (e) => handleUpdateUser(e.row.data.id, e.row.data),
              },
            ]}
          />
        </DataGrid>
      <div style={{ display: "flex", justifyContent: "space-between", margin: "10px 0" }}>
        <Button
          variant="contained"
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 0))}
          disabled={currentPage === 1}
        >
          Previous
        </Button>
        {/* <span>
          Page {currentPage + 1} of {Math.ceil(stoppages.length / pageSize)}
        </span> */}
                <span>
          Page {currentPage} of {totalPages}
        </span>
        <Button
          variant="contained"
          // onClick={() =>
          //   setCurrentPage((prev) =>
          //     Math.min(prev + 1, Math.ceil(stoppages.length / pageSize) - 1)
          //   )
          // }
          // disabled={(currentPage + 1) * pageSize >= stoppages.length}
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
        >
          Next
        </Button>
      </div>
      <div style={{ textAlign: "center" }}>
      <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", margin: "0 10px" }}>
          {Array.from({ length: totalPages }, (_, index) => index + 1).map((pageNumber) => (
            <Button
              key={pageNumber}
              onClick={() => setCurrentPage(pageNumber)}
              variant={currentPage === pageNumber ? "contained" : "outlined"}
              style={{ margin: "0 5px" }}
            >
              {pageNumber}
            </Button>
          ))}
        </div>
      </div>
      </div>
    </div>
  );
};

export default ManageUser;
