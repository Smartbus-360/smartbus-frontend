import React, { useState, useEffect } from "react";
import axios from "axios";
// import { DataGrid } from "@mui/x-data-grid";
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
import DeleteIcon from "@mui/icons-material/Delete";
import SaveIcon from "@mui/icons-material/Save";
import axiosInstance from "../../../api/axios";
// import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
// import AdapterDateFns from '@date-io/date-fns';

const ManageAdmin = () => {
  const [admins, setAdmins] = useState([]);
  const [institutes, setInstitutes] = useState([]);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [openModal, setOpenModal] = useState(false);
  const [adminData, setAdminData] = useState({
    username: "",
    email: "",
    password: "",
    phone: "",
    gender: "",
    dateOfBirth: "",
    address: "",
    role: "",
    emergency_contact_info: "",
    nationality: "",
    instituteId: "",
  });
  const token = sessionStorage.getItem("authToken");
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const handleSnackbarClose = () => setSnackbar({ ...snackbar, open: false });
  const [editedAdmins, setEditedAdmins] = useState({});
  useEffect(() => {
    (async () => {
      try {
        const [institutesResponse, adminsResponse] = await Promise.all([
          axiosInstance.get("institutes"),
          axiosInstance.get("admins"),
        ]);
        setInstitutes(institutesResponse.data);
        setAdmins(adminsResponse.data);
      } catch {
        setSnackbar({
          open: true,
          message: "Failed to load data.",
          severity: "error",
        });
      }
    })();
  }, []);

  const paginatedAdmins = admins.slice(
    currentPage * pageSize,
    currentPage * pageSize + pageSize
  );
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAdminData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddAdmin = async () => {
    try {
      const { data } = await axiosInstance.post(
        "admins",
        { ...adminData, isAdmin: 2 }
      );
      setAdmins((prev) => [...prev, data.admin]);
      setSnackbar({
        open: true,
        message: "Admin added successfully!",
        severity: "success",
      });
      setOpenModal(false);
    } catch {
      setSnackbar({
        open: true,
        message: "Failed to add admin.",
        severity: "error",
      });
    }
  };

  const handleUpdateAdmin = async (id, updatedData) => {
    try {
      // Merge the updated data with the current admin's data
      const currentAdmin = admins.find((admin) => admin.id === id);
      const formData = { ...currentAdmin, ...updatedData, isAdmin: 2 };

      // Send the update request
      await axiosInstance.put(
        `admins/${id}`,
        formData
      );

      // Update the local state
      setAdmins((prev) =>
        prev.map((admin) => (admin.id === id ? formData : admin))
      );

      // Show success notification
      setSnackbar({
        open: true,
        message: "Admin updated successfully!",
        severity: "success",
      });
    } catch {
      setSnackbar({
        open: true,
        message: "Failed to update admin.",
        severity: "error",
      });
    }
  };

  const handleDeleteAdmin = async (id) => {
    try {
      await axiosInstance.delete(`admins/${id}`);
      setAdmins((prev) => prev.filter((admin) => admin.id !== id));
      setSnackbar({
        open: true,
        message: "Admin deleted successfully!",
        severity: "success",
      });
    } catch {
      setSnackbar({
        open: true,
        message: "Failed to delete admin.",
        severity: "error",
      });
    }
  };

  const columns = [
    {
      field: "username",
      headerName: "User Name",
      width: 150,
      editable: true,
      renderEditCell: (params) => (
        <TextField
          value={editedAdmins[params.id]?.username || params.value || ""}
          onChange={(e) =>
            setEditedAdmins((prev) => ({
              ...prev,
              [params.id]: { ...prev[params.id], username: e.target.value },
            }))
          }
        />
      ),
    },
    {
      field: "instituteName",
      headerName: "Institute Name",
      width: 150,
      editable: false,
    },
    {
      field: "email",
      headerName: "Email",
      width: 200,
      editable: true,
      renderEditCell: (params) => (
        <TextField
          value={editedAdmins[params.id]?.email || params.value || ""}
          onChange={(e) =>
            setEditedAdmins((prev) => ({
              ...prev,
              [params.id]: { ...prev[params.id], email: e.target.value },
            }))
          }
        />
      ),
    },
    {
      field: "phone",
      headerName: "Phone",
      width: 150,
      editable: true,
      renderEditCell: (params) => (
        <TextField
          value={editedAdmins[params.id]?.phone || params.value || ""}
          onChange={(e) =>
            setEditedAdmins((prev) => ({
              ...prev,
              [params.id]: { ...prev[params.id], phone: e.target.value },
            }))
          }
        />
      ),
    },
    {
      field: "gender",
      headerName: "Gender",
      width: 150,
      editable: true,
      renderEditCell: (params) => (
        <Select
          value={editedAdmins[params.id]?.gender || params.value || ""}
          onChange={(e) =>
            setEditedAdmins((prev) => ({
              ...prev,
              [params.id]: { ...prev[params.id], gender: e.target.value },
            }))
          }
        >
          <MenuItem value="male">Male</MenuItem>
          <MenuItem value="female">Female</MenuItem>
        </Select>
      ),
    },
    {
      field: "dateOfBirth",
      headerName: "Date of Birth",
      width: 150,
      editable: true,
      renderEditCell: (params) => (
        <TextField
          type="date"
          value={editedAdmins[params.id]?.dateOfBirth || params.value || ""}
          onChange={(e) =>
            setEditedAdmins((prev) => ({
              ...prev,
              [params.id]: { ...prev[params.id], dateOfBirth: e.target.value },
            }))
          }
        />
      ),
    },
    {
      field: "address",
      headerName: "Address",
      width: 200,
      editable: true,
      renderEditCell: (params) => (
        <TextField
          value={editedAdmins[params.id]?.address || params.value || ""}
          onChange={(e) =>
            setEditedAdmins((prev) => ({
              ...prev,
              [params.id]: { ...prev[params.id], address: e.target.value },
            }))
          }
        />
      ),
    },
    {
      field: "role",
      headerName: "Role",
      width: 150,
      editable: true,
      renderEditCell: (params) => (
        <Select
          value={editedAdmins[params.id]?.role || params.value || ""}
          onChange={(e) =>
            setEditedAdmins((prev) => ({
              ...prev,
              [params.id]: { ...prev[params.id], role: e.target.value },
            }))
          }
        >
          <MenuItem value="approver">Approver</MenuItem>
          {/* <MenuItem value="initiator">Initiator</MenuItem> */}
          <MenuItem value="viewer">Viewer</MenuItem>
        </Select>
      ),
    },
    {
      field: "password",
      headerName: "Password",
      width: 200,
      editable: true,
      renderEditCell: (params) => (
        <TextField
          value={editedAdmins[params.id]?.password || params.value || ""}
          onChange={(e) =>
            setEditedAdmins((prev) => ({
              ...prev,
              [params.id]: { ...prev[params.id], password: e.target.value },
            }))
          }
        />
      ),
    },
    {
      field: "instituteId",
      headerName: "Institute Name",
      width: 200,
      editable: true,
      renderEditCell: (params) => (
        <Select
          value={editedAdmins[params.id]?.instituteId || params.value || ""}
          onChange={(e) =>
            setEditedAdmins((prev) => ({
              ...prev,
              [params.id]: { ...prev[params.id], instituteId: e.target.value },
            }))
          }
        >
          {institutes.map((inst) => (
            <MenuItem key={inst.id} value={inst.id}>
              {inst.name}
            </MenuItem>
          ))}
        </Select>
      ),
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 150,
      renderCell: (params) => (
        <>
          <Tooltip title="Save">
            <IconButton
              color="primary"
              onClick={() =>
                handleUpdateAdmin(params.id, editedAdmins[params.id] || {})
              }
            >
              <SaveIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete">
            <IconButton
              color="error"
              onClick={() => handleDeleteAdmin(params.id)}
            >
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        </>
      ),
    },
  ];

  return (
    <div className="mx-auto mt-4 max-w-full rounded-lg p-6 bg-gradient-to-r from-gray-100 to-gray-200 shadow-2xl">
      <h2 className="mb-6 text-3xl font-semibold text-gray-800">
        Manage Admins
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
        Add New Admin
      </Button>

      <Dialog
        open={openModal}
        onClose={() => setOpenModal(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Add New Admin</DialogTitle>
        <DialogContent>
          <div className="grid grid-cols-2 gap-4 p-2">
            {[
              { label: "Admin Name", name: "username" },
              { label: "Email", name: "email" },
              { label: "Password", name: "password" },
              { label: "Phone", name: "phone" },
            ].map((field) => (
              <TextField
                key={field.name}
                label={field.label}
                name={field.name}
                type={field.type || "text"}
                value={adminData[field.name]}
                onChange={(e) =>
                  setAdminData({
                    ...adminData,
                    [e.target.name]: e.target.value,
                  })
                }
                required
              />
            ))}
            <FormControl>
              <InputLabel>Gender</InputLabel>
              <Select
                name="gender"
                value={adminData.gender}
                onChange={(e) =>
                  setAdminData({ ...adminData, gender: e.target.value })
                }
              >
                <MenuItem value="">Select Gender</MenuItem>
                <MenuItem value="male">Male</MenuItem>
                <MenuItem value="female">Female</MenuItem>
              </Select>
            </FormControl>
            <TextField
              label="Date of Birth"
              name="dateOfBirth"
              type="date"
              value={adminData.dateOfBirth}
              onChange={(e) =>
                setAdminData({ ...adminData, dateOfBirth: e.target.value })
              }
              required
              InputLabelProps={{
                shrink: true, // Ensures the label stays above the input
              }}
              inputProps={{
                placeholder: "", // Sets an empty placeholder
              }}
            />
            <TextField
              label="Address"
              name="address"
              value={adminData.address}
              onChange={(e) =>
                setAdminData({ ...adminData, address: e.target.value })
              }
              required
            />
            <FormControl>
              <InputLabel>Role</InputLabel>
              <Select
                name="role"
                value={adminData.role}
                onChange={(e) =>
                  setAdminData({ ...adminData, role: e.target.value })
                }
              >
                <MenuItem value="">Select Role</MenuItem>
                <MenuItem value="approver">Approver</MenuItem>
                {/* <MenuItem value="initiator">Initiator</MenuItem> */}
                <MenuItem value="viewer">Viewer</MenuItem>
              </Select>
            </FormControl>
            <TextField
              label="Emergency Contact Info"
              name="emergency_contact_info"
              value={adminData.emergency_contact_info}
              onChange={(e) =>
                setAdminData({
                  ...adminData,
                  emergency_contact_info: e.target.value,
                })
              }
              required
            />
            <TextField
              label="Nationality"
              name="nationality"
              value={adminData.nationality}
              onChange={(e) =>
                setAdminData({ ...adminData, nationality: e.target.value })
              }
              required
            />
            <FormControl required className="col-span-2">
              <InputLabel>Select Institute</InputLabel>
              <Select
                name="instituteId"
                value={adminData.instituteId}
                onChange={(e) =>
                  setAdminData({ ...adminData, instituteId: e.target.value })
                }
              >
                <MenuItem value="">Select Institute</MenuItem>
                {institutes.map((institute) => (
                  <MenuItem key={institute.id} value={institute.id}>
                    {institute.name}
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
          <Button variant="contained" color="primary" onClick={handleAddAdmin}>
            Add Admin
          </Button>
        </DialogActions>
      </Dialog>

      <div style={{ minHeight: "600px", height: "auto", width: "100%", marginTop: "16px" }}>
        <DataGrid
          dataSource={paginatedAdmins}
          keyExpr="id"
          showBorders={true}
          onRowUpdating={(e) => handleUpdateAdmin(e.oldData.id, e.newData)}
          onRowRemoving={(e) => handleDeleteAdmin(e.data.id)}
          rowAlternationEnabled={true}
          allowColumnResizing={true}
          scrolling={{ mode: 'virtual', useNative: true }}
        >
          <Editing
            mode="cell"
            allowUpdating={true}
            allowDeleting={true}
            allowAdding={false}
            useIcons={true} // Shows icons for editing actions
          />
          <SearchPanel visible={true} highlightCaseSensitive={true} />
          <Paging defaultPageSize={10} />
          <Pager showPageSizeSelector={false} showInfo={true} />

          {/* Toolbar Custom Save Button */}
          {/* <Toolbar>
            <Item name="addRowButton" />
            <Item
              location="after"
              widget="dxButton"
              options={{
                text: "Save All",
                icon: "save",
                onClick: () => {
                  admins.forEach((admin) => {
                    handleUpdateAdmin(admin.id, admin); // Save all rows
                  });
                },
              }}
            />
          </Toolbar> */}

          <Column dataField="username" caption="User Name" minWidth={150}/>
          <Column dataField="email" caption="Email" minWidth={150} />
          <Column dataField="phone" caption="Phone" minWidth={150} />
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
            minWidth={150}
          />
          <Column
            dataField="role"
            caption="Role"
            lookup={{
              dataSource: [
                { value: "approver", display: "Approver" },
                // { value: "initiator", display: "Initiator" },
                { value: "viewer", display: "Viewer" },
              ],
              valueExpr: "value",
              displayExpr: "display",
            }}
            minWidth={150}
          />
          <Column
            dataField="dateOfBirth"
            caption="Date of Birth"
            dataType="date"
            minWidth={150}
          />
          <Column dataField="address" caption="Address" minWidth={150}/>
          <Column dataField="password" caption="Password" visible={true} minWidth={150}/>
          <Column
            dataField="instituteId"
            caption="Institute Name"
            lookup={{
              dataSource: institutes,
              valueExpr: "id",
              displayExpr: "name",
            }}
            minWidth={150}
          />

          {/* Command Column for Save/Delete */}
          <Column
            type="buttons"
            buttons={[
              "edit",
              "delete",
              {
                hint: "Save Changes",
                icon: "save",
                onClick: (e) => handleUpdateAdmin(e.row.data.id, e.row.data), // Save specific row
              },
            ]}
            minWidth={150}/>
        </DataGrid>
        <div style={{ display: "flex", justifyContent: "space-between", margin: "10px 0" }}>
          <Button
            variant="contained"
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 0))}
            disabled={currentPage === 0}
          >
            Previous
          </Button>
          <span>
            Page {currentPage + 1} of {Math.ceil(admins.length / pageSize)}
          </span>
          <Button
            variant="contained"
            onClick={() =>
              setCurrentPage((prev) =>
                Math.min(prev + 1, Math.ceil(admins.length / pageSize) - 1)
              )
            }
            disabled={(currentPage + 1) * pageSize >= admins.length}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ManageAdmin;
