import React, { useState, useEffect, useRef } from "react";
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
  FormControlLabel,
  Checkbox,
} from "@mui/material";
// import {
//   DataGrid, Column, Paging, Pager, Lookup, Editing, SearchPanel,
//   Toolbar, Item, Export, Selection, GridButton, RequiredRule, MasterDetail
// } from "devextreme-react/data-grid";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import SaveIcon from "@mui/icons-material/Save";
import { AddCircleOutline, RemoveCircleOutline } from "@mui/icons-material";
import axiosInstance from "../../../api/axios";
import { getUser } from "../../../config/authService";

const convertUrlToFile = async (url, fileName = "logo.png") => {
  const response = await fetch(url);
  const blob = await response.blob();
  const file = new File([blob], fileName, { type: blob.type });
  return file;
};

const ManageDriver = () => {
  const gridRef = useRef(null);
  const [drivers, setDrivers] = useState([]);
  const [institutes, setInstitutes] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [instituteId, setInstituteId] = useState("");
  const [newDriver, setNewDriver] = useState({
    name: "",
    licenseNumber: "",
    email: "",
    password: "",
    phone: "",
    emergencyContact: "",
    aadhaarNumber: "",
    licenseExpiry: "",
    experienceYears: "",
    startDate: "",
    endDate: "",
    dateOfBirth: "",
    profilePicture: "",
    shiftType: "morning",
    vehicleAssigned: "",
    rating: "",
    lastLogin: "",
    isVerified: "no",
    availabilityStatus: "Available",
    assignedRoutes: [],
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [openDriverModal, setOpenDriverModal] = useState(false);
  const [profilePicturePreview, setProfilePicturePreview] = useState(null);
  const handleSnackbarClose = () => setSnackbar({ ...snackbar, open: false });
  const token = sessionStorage.getItem("authToken");
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const user = getUser();
  // Expand + subdriver
// const [expandedRowId, setExpandedRowId] = useState(null);
// const [subDrivers, setSubDrivers] = useState({});     // { [driverId]: [ ...subdriverRows ] }
// const [newSub, setNewSub] = useState({ name: "", phone: "", email: "", password: "" });

// QR modal
const [qrOpen, setQrOpen] = useState(false);
const [qrPng, setQrPng] = useState("");
const [qrExpiresAt, setQrExpiresAt] = useState("");
// const [qrDurationHrs, setQrDurationHrs] = useState(6); // default 6 hrs
  const [qrHours, setQrHours] = useState({}); // e.g. { [driverId]: 6 }
const [qrFor, setQrFor] = useState({ driverId: null });
  const [qrHistoryOpen, setQrHistoryOpen] = useState(false);
const [qrHistory, setQrHistory] = useState([]);
const [qrHistoryFor, setQrHistoryFor] = useState(null);
  const [qrHistoryFilter, setQrHistoryFilter] = useState('all');



// Busy flags
const [busy, setBusy] = useState(false);

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      const [institutesResponse, driversResponse] =
        await Promise.all([
          axiosInstance.get("institutes"),
          axiosInstance.get("drivers"),
        ]);
      setInstitutes(institutesResponse.data);
      setDrivers(driversResponse.data);
    } catch (err) {
      setSnackbar({
        open: true,
        message: "Failed to load data.",
        severity: "error",
      });
    }
  };

  // Handle case when drivers length reduces and currentPage is now out of bounds
  useEffect(() => {
    const maxPage = Math.ceil(drivers.length / pageSize) - 1;
    if (drivers.length > 0 && currentPage > maxPage) {
      setCurrentPage(maxPage);
    }
  }, [drivers, pageSize]);

  // Calculate paginated drivers using safe page index
  const maxPage = Math.max(Math.ceil(drivers.length / pageSize) - 1, 0);
  const safePage = Math.min(currentPage, maxPage);
  const paginatedDrivers = drivers.length > 0
    ? drivers.slice(safePage * pageSize, safePage * pageSize + pageSize)
    : [];




  // const handleInstituteChange = async (event) => {
  //   const selectedInstituteId = event.target.value;
  //   setInstituteId(selectedInstituteId);
  //   try {
  //     const response = await axiosInstance.get(
  //       `routes/institute/${selectedInstituteId}`
  //     );
  //     setRoutes(response.data);
  //   } catch (err) {}
  // };
  const handleInstituteChange = async (event) => {
  const selectedInstituteId = event.target.value;
  setInstituteId(selectedInstituteId);
  setNewDriver(prev => ({ ...prev, instituteId: selectedInstituteId })); // <-- add this
  try {
    const response = await axiosInstance.get(`routes/institute/${selectedInstituteId}`);
    setRoutes(response.data);
  } catch (err) {}
};


  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setNewDriver((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setNewDriver((prev) => ({ ...prev, profilePicture: file }));
    setProfilePicturePreview(URL.createObjectURL(file));
  };

  const handleAddDriver = async () => {
    if (
      !newDriver.name ||
      !newDriver.licenseNumber ||
      !newDriver.email ||
      !newDriver.phone ||
      !instituteId
    ) {
      setSnackbar({
        open: true,
        message: "Please fill in all required fields.",
        severity: "error",
      });
      return;
    }

    const role = user?.role || "";
    if (role === "viewer") {
      setSnackbar({
        open: true,
        message: "You do not have the necessary permissions to perform this action",
        severity: "error",
      });
      return;
    }

    // const payload = { ...newDriver,  instituteId };
    const formData = new FormData();
    Object.entries({ ...newDriver, instituteId }).forEach(([key, value]) => {
      formData.append(key, value);
    });

    try {
      const response = await axiosInstance.post(
        "drivers",
        formData
      );

      // Log the response to ensure it is successful
      console.log("Driver added response:", response.data);

      if (response.data.success) {
        const addedDriver = {
          id: response.data.driver.id,
          ...response.data.driver,
        };
        setDrivers([...drivers, addedDriver]);

        // Now update DriverRoutes if there are assigned routes
        if (newDriver.assignedRoutes.length > 0) {
          const driverRoutesPayload = newDriver.assignedRoutes.map((route) => ({
            driverId: addedDriver.id,
            routeName: route.routeName,
          }));

          await axiosInstance.post(
            "drivers/routes",
            driverRoutesPayload
          );
        }

        setNewDriver({
          name: "",
          licenseNumber: "",
          email: "",
          password: "",
          phone: "",
          emergencyContact: "",
          aadhaarNumber: "",
          licenseExpiry: "",
          experienceYears: "",
          startDate: "",
          endDate: "",
          dateOfBirth: "",
          profilePicture: "",
          shiftType: "morning",
          vehicleAssigned: "",
          rating: "",
          lastLogin: "",
          isVerified: "no",
          availabilityStatus: "Available",
          assignedRoutes: [],
        });
        setInstituteId("");
        setSnackbar({
          open: true,
          message: "Driver added successfully!",
          severity: "success",
        });
        // setOpenModal(false);
      } else {
        setSnackbar({
          open: true,
          message: `${response.data.message || "Failed to add driver."}`,
          severity: "error",
        });
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message: `${error.response?.data?.message || "Failed to add driver."}`,
        severity: "error",
      });
    }
  };

  const handleUpdateDriver = async (driverId, updatedDriver = {}) => {

    const role = user?.role || "";
    if (role === "viewer") {
      setSnackbar({
        open: true,
        message: "You do not have the necessary permissions to perform this action",
        severity: "error",
      });
      return;
    }

    // Fetch the driver data from `drivers` as a fallback for missing fields
    const selectedDriver = drivers.find((driver) => driver.id === driverId);
    if (!selectedDriver) {
      setSnackbar({
        open: true,
        message: "Driver not found.",
        severity: "error",
      });
      return;
    }

    // Validate required fields using fallback values
    if (
      (!updatedDriver.name && !selectedDriver.name) ||
      (!updatedDriver.licenseNumber && !selectedDriver.licenseNumber) ||
      (!updatedDriver.email && !selectedDriver.email) ||
      (!updatedDriver.phone && !selectedDriver.phone)
    ) {
      setSnackbar({
        open: true,
        message: "Please fill in all required fields.",
        severity: "error",
      });
      return;
    }
    
    let formData = new FormData();
    formData.append("name", updatedDriver.name || selectedDriver.name || "");
    formData.append("email", updatedDriver.email || selectedDriver.email || "");
    formData.append("phone", updatedDriver.phone || selectedDriver.phone || "");
    formData.append(
      "licenseNumber",
      updatedDriver.licenseNumber || selectedDriver.licenseNumber || ""
    );
    formData.append(
      "experienceYears",
      updatedDriver.experienceYears || selectedDriver.experienceYears || 0
    );
    formData.append(
      "availabilityStatus",
      updatedDriver.availabilityStatus ||
        selectedDriver.availabilityStatus ||
        "Unavailable"
    );
  
    formData.append(
      "aadhaarNumber",
      updatedDriver.aadhaarNumber || selectedDriver.aadhaarNumber || ""
    );
    formData.append(
      "licenseExpiry",
      updatedDriver.licenseExpiry || selectedDriver.licenseExpiry || ""
    );
    formData.append("startDate", updatedDriver.startDate || selectedDriver.startDate || "");
    formData.append("endDate", updatedDriver.endDate || selectedDriver.endDate || "");
    formData.append("dateOfBirth", updatedDriver.dateOfBirth || selectedDriver.dateOfBirth || "");
    formData.append("shiftType", updatedDriver.shiftType || selectedDriver.shiftType || "day");
    formData.append("vehicleAssigned", updatedDriver.vehicleAssigned || selectedDriver.vehicleAssigned || "");
    formData.append("rating", updatedDriver.rating || selectedDriver.rating || 0);
    formData.append("password", updatedDriver.password || selectedDriver.password || "");
    formData.append("lastLogin", updatedDriver.lastLogin || selectedDriver.lastLogin || "");
    formData.append("isVerified", updatedDriver.isVerified || selectedDriver.isVerified || false);
    formData.append("instituteId", updatedDriver.instituteId || selectedDriver.instituteId);
    formData.append("assignedRoutes", JSON.stringify(updatedDriver.assignedRoutes || selectedDriver.assignedRoutes || []));
  
    // Handle profile picture update
    let file = null;
    if (updatedDriver.profilePicture instanceof File) {
      file = updatedDriver.profilePicture;
    } else if (typeof updatedDriver.profilePicture === "string") {
      file = await convertUrlToFile(updatedDriver.profilePicture);
    }

    if (file) {
      formData.append("profilePicture", file);
    }

    try {
      // Make API call to update the driver
      const response = await axiosInstance.put(
        `drivers/${driverId}`,
        formData
      );

      // Check if the response indicates success
      if (response.data.success) {
        const updatedDriverData = response.data.driver;

        // Update the driver in the state
        setDrivers(
          drivers.map((driver) =>
            driver.id === updatedDriverData.id ? updatedDriverData : driver
          )
        );
        setSnackbar({
          open: true,
          message: "Driver updated successfully!",
          severity: "success",
        });
      } else {
        setSnackbar({
          open: true,
          message: "Failed to update driver.",
          severity: "error",
        });
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Failed to update driver.",
        severity: "error",
      });
    }
  };

  const handleDeleteDriver = async (driverId) => {

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
      const response = await axiosInstance.delete(
        `drivers/${driverId}`
      );
      if (response.data.message === "Driver deleted successfully.") {
        // Remove the deleted driver from the state
        setDrivers(drivers.filter((driver) => driver.id !== driverId));
        setSnackbar({
          open: true,
          message: "Driver deleted successfully!",
          severity: "success",
        });
      } else {
        setSnackbar({
          open: true,
          message: "Failed to delete driver!",
          severity: "error",
        });
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Failed to delete driver!",
        severity: "error",
      });
    }
  };

  // Fetch all subdrivers for one main driver
// const fetchSubDrivers = async (driverId) => {
//   try {
//     const { data } = await axiosInstance.get(`drivers/${driverId}/subdrivers`);
//     setSubDrivers(prev => ({ ...prev, [driverId]: data.subDrivers || [] }));
//   } catch (e) {
//     setSnackbar({ open: true, message: "Failed to load sub-drivers.", severity: "error" });
//   }
// };

// Create a sub-driver under a main driver
// const handleCreateSubDriver = async (driverId, instituteId) => {
//   if (!newSub.name || !newSub.phone || !newSub.email || !newSub.password) {
//     setSnackbar({ open: true, message: "Fill all sub-driver fields", severity: "warning" });
//     return;
//   }
//   try {
//     const { data } = await axiosInstance.post(
//       `drivers/${driverId}/subdriver`,
//       { ...newSub, instituteId }                // 👈 send instituteId
//     );
//     setNewSub({ name: "", phone: "", email: "", password: "" });
//     setSnackbar({ open: true, message: "Sub-driver created", severity: "success" });
//     fetchSubDrivers(driverId);
//   } catch {
//     setSnackbar({ open: true, message: "Failed to create sub-driver", severity: "error" });
//   }
// };

// Generate a QR for a (main driver, sub-driver, durationHours)
// const handleGenerateQR = async (originalDriverId, subDriverId,hours = 6) => {
//   try {
//     setBusy(true);
//     const { data } = await axiosInstance.post(`driver-qr/generate`, {
//       originalDriverId,
//       subDriverId,
//       durationHours: hours,
//     });
//     setQrPng(data.png);
//     setQrExpiresAt(data.expiresAt);
//     setQrFor({ originalDriverId, subDriverId });
//     setQrOpen(true);
//     setSnackbar({ open: true, severity: "success", message: "QR generated" });

//   } catch (e) {
//     setSnackbar({ open: true, message: "Failed to generate QR", severity: "error" });
//   } finally { setBusy(false); }
// };


const handleGenerateQR = async (driverId, hours = 6) => {
  try {
    setBusy(true);
    const { data } = await axiosInstance.post(`driver-qr/generate`, {
      driverId,
      durationHours: hours,
    });
    setQrPng(data.png);
    setQrExpiresAt(data.expiresAt);
    setQrFor({ driverId });
    setQrOpen(true);
    setSnackbar({ open: true, severity: "success", message: "QR generated" });
  } catch (e) {
    setSnackbar({ open: true, message: "Failed to generate QR", severity: "error" });
  } finally { setBusy(false); }
};

// Revoke a QR by id (optional list shows active QRs)
const handleRevokeQR = async (qrId) => {
  try {
    await axiosInstance.post(`driver-qr/revoke/${qrId}`);
    setSnackbar({ open: true, message: "QR revoked", severity: "success" });
  } catch {
    setSnackbar({ open: true, message: "Failed to revoke QR", severity: "error" });
  }
};
  const fetchQrHistory = async (driverId, status = "all") => {
  try {
    const { data } = await axiosInstance.get("driver-qr/history", {
      params: { driverId, limit: 100, status },
    });
    setQrHistory(data.items || []);
  } catch {
    setSnackbar({
      open: true,
      message: "Failed to load QR history",
      severity: "error",
    });
  }
};
  const revokeFromHistory = async (row) => {
  if (row?.status !== 'active') return;
  if (!window.confirm('Revoke this active QR?')) return;
  await handleRevokeQR(row.id);
  await fetchQrHistory(qrHistoryFor, qrHistoryFilter);
};



// Row expand toggle
// const toggleExpand = (driverId) => {
//   const grid = gridRef.current?.instance;
// if (!grid) return;
// if (expandedRowId === driverId) {
//   grid.collapseRow(driverId);
//  setExpandedRowId(null);
//  } else {
//  grid.expandRow(driverId);
// setExpandedRowId(driverId);
//  fetchSubDrivers(driverId);
//  }
//  };


  return (
    <div className="mx-auto mt-4 max-w-full rounded-lg bg-gradient-to-r from-gray-100 to-gray-200 p-6 shadow-2xl">
      <h2 className="mb-6 text-3xl font-semibold text-gray-800">
        Manage Drivers
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
          onClick={() => setOpenDriverModal(true)}
        >
          Add Driver
        </Button>
        {/* New Driver Form */}
        <Dialog
          open={openDriverModal}
          onClose={() => setOpenDriverModal(false)}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>Add New Driver</DialogTitle>
          <DialogContent>
            <div className="grid grid-cols-2 gap-4">
              {/* Driver input fields */}
              <TextField
                label="Driver Name"
                name="name"
                value={newDriver.name}
                onChange={handleInputChange}
                required
              />
              <TextField
                label="License Number"
                name="licenseNumber"
                value={newDriver.licenseNumber}
                onChange={handleInputChange}
                required
              />
              <TextField
                label="Aadhaar Number"
                name="aadhaarNumber"
                value={newDriver.aadhaarNumber}
                onChange={handleInputChange}
              />
              <TextField
                label="License Expiry"
                type="date"
                name="licenseExpiry"
                value={newDriver.licenseExpiry}
                onChange={handleInputChange}
                InputLabelProps={{ shrink: true }}
              />
              <TextField
                label="Job Start Date"
                type="date"
                name="startDate"
                value={newDriver.startDate}
                onChange={handleInputChange}
                InputLabelProps={{ shrink: true }}
              />
              <TextField
                label="Job End Date"
                type="date"
                name="endDate"
                value={newDriver.endDate}
                onChange={handleInputChange}
                InputLabelProps={{ shrink: true }}
              />
              <TextField
                label="Date of Birth"
                type="date"
                name="dateOfBirth"
                value={newDriver.dateOfBirth}
                onChange={handleInputChange}
                InputLabelProps={{ shrink: true }}
              />
              <TextField
                label="Driver Email"
                type="email"
                name="email"
                value={newDriver.email}
                onChange={handleInputChange}
                required
              />
              <TextField
                label="Driver Phone"
                name="phone"
                value={newDriver.phone}
                onChange={handleInputChange}
                required
              />
              <TextField
                label="Password"
                name="password"
                required
                value={newDriver.password}
                onChange={handleInputChange}
              />
              <TextField
                label="Experience (Years)"
                type="number"
                name="experienceYears"
                value={newDriver.experienceYears}
                onChange={handleInputChange}
              />
              <TextField
                label="Emergency Contact"
                name="emergencyContact"
                value={newDriver.emergencyContact}
                onChange={handleInputChange}
              />
              {/* Profile Picture Upload */}
              <FormControl fullWidth className="col-span-2">
                <InputLabel shrink>Upload Profile Picture</InputLabel>
                <input
                  accept="image/*"
                  type="file"
                  onChange={handleImageChange}
                  style={{ display: "block", marginTop: "8px" }}
                />
                {profilePicturePreview && (
                  <img
                    src={profilePicturePreview}
                    alt="Profile Preview"
                    style={{
                      width: "100px",
                      height: "100px",
                      marginTop: "8px",
                      borderRadius: "4px",
                    }}
                  />
                )}
              </FormControl>

              {/* Additional Driver Fields */}

              <FormControl>
              <InputLabel>Shift Type</InputLabel>
              <Select
                label="Shift Type"
                name="shiftType"
                value={newDriver.shiftType}
                onChange={handleInputChange}
              >
                <MenuItem value="morning">Morning</MenuItem>
                <MenuItem value="evening">Evening</MenuItem>
                <MenuItem value="both">Both</MenuItem>
              </Select>
            </FormControl>
              <TextField
                label="Rating"
                name="rating"
                type="number"
                value={newDriver.rating}
                onChange={handleInputChange}
              />
              <FormControl>
              <InputLabel>Is Verified</InputLabel>
              <Select
                label="Is Verified"
                name="isVerified"
                value={newDriver.isVerified}
                onChange={handleInputChange}
              >
                <MenuItem value="yes">Yes</MenuItem>
                <MenuItem value="no">No</MenuItem>
              </Select>
            </FormControl>

              <FormControl>
              <InputLabel>Availability Status</InputLabel>
              <Select
                label="Availability Status"
                name="availabilityStatus"
                value={newDriver.availabilityStatus}
                onChange={handleInputChange}
              >
                <MenuItem value="Available">Available</MenuItem>
                <MenuItem value="Unavailable">Unavailable</MenuItem>
              </Select>
            </FormControl>

              <FormControl required>
                <InputLabel>Select Institute</InputLabel>
                <Select
                  label="Select Institute"
                  value={instituteId}
                  onChange={handleInstituteChange}
                  className="col-span-2"
                >
                  <MenuItem value="">Select Institute</MenuItem>
                  {institutes.map((institute) => (
                    <MenuItem key={institute.id} value={institute.id}>
                      {institute.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <div className="col-span-2">
                <h4 className="mb-2 text-lg">Assign Routes</h4>
                {routes.length > 0 && (
                <FormControl required>
                <InputLabel>Select Route</InputLabel>
<Select
  label="Select Route"
  name="assignedRoutes"
  value={newDriver.assignedRoutes}
  onChange={handleInputChange}
  className="col-span-2"
    >
                    <MenuItem value="">Select Route</MenuItem>
                    {routes.map((route) => (
                      <MenuItem key={route.id} value={route.id}>
                        {route.routeName}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                )}
              </div>
            </div>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDriverModal(false)} color="secondary">
              Cancel
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={handleAddDriver}
            >
              Add Driver
            </Button>
          </DialogActions>
        </Dialog>
<div style={{ height: "600px", width: "100%", marginTop: "16px" }}>        {/* <DataGrid
          rows={drivers}
          columns={columns}
          pageSize={5}
          checkboxSelection
          onRowEditCommit={(params) => handleUpdateDriver(params.id, params)}
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
        <Dialog open={qrOpen} onClose={() => setQrOpen(false)} maxWidth="xs" fullWidth>
  <DialogTitle>Driver QR</DialogTitle>
  <DialogContent>
    {qrPng ? (
      <div className="flex flex-col items-center gap-3">
        <img src={qrPng} alt="QR Code" style={{ width: 260, height: 260 }} />
        <div className="text-sm text-gray-600">
          Expires at: {new Date(qrExpiresAt).toLocaleString()}
        </div>
        <Button
          variant="outlined"
          onClick={() => {
            const a = document.createElement("a");
            a.href = qrPng;
            a.download = `driver-qr-${qrFor.driverId}.png`;
            a.click();
          }}
        >
          Download / Share
        </Button>
      </div>
    ) : (
      <div>Generating…</div>
    )}
  </DialogContent>

  <DialogActions>
    <Button onClick={() => setQrOpen(false)}>Close</Button>
  </DialogActions>
</Dialog>
  <Dialog
  open={qrHistoryOpen}
  onClose={() => setQrHistoryOpen(false)}
  maxWidth="md"
  fullWidth
>
  <DialogTitle>QR History — Driver #{qrHistoryFor}</DialogTitle>
  <DialogContent>
    <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
      <Button size="small" onClick={() => { setQrHistoryFilter('all');     fetchQrHistory(qrHistoryFor, 'all'); }}>All</Button>
      <Button size="small" onClick={() => { setQrHistoryFilter('active');  fetchQrHistory(qrHistoryFor, 'active'); }}>Active</Button>
      <Button size="small" onClick={() => { setQrHistoryFilter('used');    fetchQrHistory(qrHistoryFor, 'used'); }}>Used</Button>
      <Button size="small" onClick={() => { setQrHistoryFilter('revoked'); fetchQrHistory(qrHistoryFor, 'revoked'); }}>Revoked</Button>
      <Button size="small" onClick={() => { setQrHistoryFilter('expired'); fetchQrHistory(qrHistoryFor, 'expired'); }}>Expired</Button>
    </div>

    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
      <thead>
        <tr>
          <th style={{ textAlign: 'left', padding: 8, borderBottom: '1px solid #eee' }}>QR ID</th>
          <th style={{ textAlign: 'left', padding: 8, borderBottom: '1px solid #eee' }}>Expires</th>
          <th style={{ textAlign: 'left', padding: 8, borderBottom: '1px solid #eee' }}>Status</th>
          <th style={{ textAlign: 'left', padding: 8, borderBottom: '1px solid #eee' }}>Used / Max</th>
          <th style={{ textAlign: 'left', padding: 8, borderBottom: '1px solid #eee' }}>Created By</th>
          <th style={{ textAlign: 'left', padding: 8, borderBottom: '1px solid #eee' }}>Actions</th>
        </tr>
      </thead>
      <tbody>
        {qrHistory.map((r) => (
          <tr key={r.id}>
            <td style={{ padding: 8 }}>{r.id}</td>
            <td style={{ padding: 8 }}>{r.expiresAt ? new Date(r.expiresAt).toLocaleString() : '-'}</td>
            <td style={{ padding: 8 }}>{r.status}</td>
            <td style={{ padding: 8 }}>{(r.usedCount ?? 0)} / {(r.maxUses ?? 1)}</td>
            <td style={{ padding: 8 }}>{r.createdByName ?? r.createdBy ?? '-'}</td>
            <td style={{ padding: 8 }}>
              {r.status === 'active' && (
                <Button
                  size="small"
                  color="error"
                  variant="outlined"
                  onClick={() => revokeFromHistory(r)}
                >
                  Revoke
                </Button>
              )}
            </td>
          </tr>
        ))}
        {qrHistory.length === 0 && (
          <tr>
            <td colSpan={6} style={{ padding: 16, opacity: 0.7 }}>
              No QR history found for this filter.
            </td>
          </tr>
        )}
      </tbody>
    </table>
  </DialogContent>
  <DialogActions>
    <Button onClick={() => setQrHistoryOpen(false)}>Close</Button>
  </DialogActions>
</Dialog>


        <DataGrid
        height="100%"
        ref={gridRef}
          dataSource={paginatedDrivers}
          keyExpr="id"
          showBorders={true}
          rowAlternationEnabled={true}
          allowColumnResizing={true}
          onRowUpdating={(e) => handleUpdateDriver(e.oldData.id, e.newData)}
          onRowRemoving={(e) => handleDeleteDriver(e.data.id)}
          scrolling={{ mode: 'virtual', useNative: true }}
        >
          <Editing
            mode="cell"
            allowUpdating={true}
            allowDeleting={true}
            useIcons={true}
          />
{/* <Column
  caption="QR"
  minWidth={240}
  cellRender={({ data }) => (
    <div className="flex items-center gap-8">
      <TextField
        size="small"
        type="number"
        label="Hours"
        value={qrHours[data.id] || 6}
onChange={(e) =>
          setQrHours(prev => ({ ...prev, [data.id]: e.target.value }))
        }
        style={{ width: 90 }}
      />
      <Button
        size="small"
        variant="outlined"
        disabled={busy}
        onClick={() => handleGenerateQR(data.id, Number(qrHours[data.id] || 6))}
      >
        Generate QR
      </Button>
    </div>
  )}
/>
 */}
          <Column
  caption="QR"
  minWidth={320}
  cellRender={({ data }) => (
    <div className="flex items-center gap-3">
      <TextField
        size="small"
        type="number"
        label="Hours"
        value={qrHours[data.id] ?? 6}
        onChange={(e) =>
          setQrHours((prev) => ({
            ...prev,
            [data.id]: e.target.value === "" ? "" : Number(e.target.value),
          }))
        }
        inputProps={{ min: 1 }}
        style={{ width: 90 }}
      />

      <Button
        size="small"
        variant="outlined"
        disabled={busy}
        onClick={() =>
          handleGenerateQR(data.id, Number(qrHours[data.id] ?? 6))
        }
      >
        Generate QR
      </Button>

      <Button
        size="small"
        variant="text"
        onClick={async () => {
          setQrHistoryFor(data.id);
          setQrHistoryFilter("all");
          await fetchQrHistory(data.id, "all");
          setQrHistoryOpen(true);
        }}
      >
        QR History
      </Button>
    </div>
  )}
/>



          <SearchPanel visible={true} highlightCaseSensitive={true} />
          <Paging defaultPageSize={10} />
          <Pager showPageSizeSelector={false} showInfo={true} />

          {/* Columns */}
          <Column dataField="name" caption="Driver Name" minWidth={150}/>
          <Column
            dataField="instituteName"
            caption="Institute Name"
            allowEditing={false}
          minWidth={150}/>
          <Column
            dataField="assignedRoutes"
            caption="Assigned Route"
            allowEditing={false}
            minWidth={150}
            cellRender={({ value }) => {
              if (Array.isArray(value) && value.length > 0) {
                const routeNames = value.map((route) => route.routeName).join(', ');
                return <span className="cursor-not-allowed">{routeNames}</span>;
              }
              return <span className="cursor-not-allowed">No routes assigned</span>;
            }}
          />
          <Column dataField="licenseNumber" caption="License Number" minWidth={150}/>
          <Column dataField="aadhaarNumber" caption="Aadhaar Number" minWidth={150}/>
          <Column
            dataField="licenseExpiry"
            caption="License Expiry"
            dataType="date"
          minWidth={150}/>
          <Column dataField="startDate" caption="Start Date" dataType="date" minWidth={150}/>
          <Column dataField="endDate" caption="End Date" dataType="date" minWidth={150}/>
          <Column
            dataField="dateOfBirth"
            caption="Date of Birth"
            dataType="date"
          minWidth={150}/>
          <Column dataField="email" caption="Email" minWidth={150}/>
          <Column dataField="phone" caption="Phone" minWidth={150}/>
          <Column
            dataField="experienceYears"
            caption="Experience (Years)"
            dataType="number"
          minWidth={150}/>
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
          <Column
            dataField="shiftType"
            caption="Shift Type"
            lookup={{
              dataSource: ["morning", "evening", "both"],
              valueExpr: "this",
              displayExpr: "this",
            }}
          minWidth={150}/>
          <Column dataField="rating" caption="Rating" dataType="number" minWidth={150}/>
          <Column dataField="password" caption="Password" minWidth={150}/>
          <Column
            dataField="isVerified"
            caption="Verified"
            lookup={{
              dataSource: ["yes", "no"],
              valueExpr: "this",
              displayExpr: "this",
            }}
          minWidth={150}/>
          <Column
            dataField="availabilityStatus"
            caption="Availability"
            lookup={{
              dataSource: ["Available", "Unavailable"],
              valueExpr: "this",
              displayExpr: "this",
            }}
          minWidth={150}/>

        {/* <Column
  caption="QR / Sub-Driver"
  minWidth={220}
  cellRender={({ data }) => {
    const isOpen = expandedRowId === data.id;
    return (
      <div className="flex items-center gap-2">
        <Button size="small" variant="outlined" onClick={() => toggleExpand(data.id)}>
          {isOpen ? "Hide" : "Manage"}
        </Button>
      </div>
    );
  }}
/> */}

          <Column
            type="buttons"
            buttons={[
              "edit",
              "delete",
              {
                hint: "Save Changes",
                icon: "save",
                onClick: (e) => handleUpdateDriver(e.row.data.id, e.row.data),
              },
            ]}
          />
        </DataGrid>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            margin: "10px 0",
          }}
        >
        <Button
          variant="contained"
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 0))}
          disabled={safePage === 0}
        >
          Previous
        </Button>
        <span>
          Page {safePage + 1} of {maxPage + 1}
        </span>
        <Button
          variant="contained"
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, maxPage))
          }
          disabled={safePage >= maxPage}
        >
          Next
        </Button>
        </div>
      </div>
    </div>
  );
};

export default ManageDriver;
