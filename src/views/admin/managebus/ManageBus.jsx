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
  Modal,
  Box,
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
import FindReplaceIcon from "@mui/icons-material/FindReplace";
import axiosInstance from "../../../api/axios";
import { getUser } from "../../../config/authService";

const ManageBusForDriver = () => {
  const [busData, setBusData] = useState({
    busNumber: "",
    capacity: 0,
    model: "",
    driverId: "",
    licensePlate: "",
    color: "",
    status: "active", // Set a default status
    fuelType: "diesel", // Set a default fuel type
    manufactureYear: "",
    mileage: 0,
    lastServicedDate: "",
    insuranceExpiryDate: "",
    assignedRouteId: "",
  });

  const [drivers, setDrivers] = useState([]);
  const [busList, setBusList] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedBusId, setSelectedBusId] = useState(null);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [replacementModalOpen, setReplacementModalOpen] = useState(false);
  const [replacementBusId, setReplacementBusId] = useState(null);
  const [replacementDetails, setReplacementDetails] = useState({
    newBusId: "",
    oldBusId: "",
    reason: "",
    duration: "",
    routeId: "",
    driverId: "",
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [openModal, setOpenModal] = useState(false);
  const handleSnackbarClose = () => setSnackbar({ ...snackbar, open: false });
  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };
  const [editedBuses, setEditedBuses] = useState({});
  const [routes, setRoutes] = useState([]);
  const token = sessionStorage.getItem("authToken");
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const adminInstituteId = sessionStorage.getItem("instituteId");
  const user = getUser();
  useEffect(() => {
    // Fetch initial data (buses and drivers)
    const fetchData = async () => {
      try {
        const [busResponse, driverResponse, routeResponse] = await Promise.all([
          axiosInstance.get("buses"),
          axiosInstance.get("drivers"),
          axiosInstance.get(`routes/institute/${adminInstituteId}`),
        ]);
        setBusList(busResponse.data.map((bus) => ({ ...bus, id: bus.busId })));
        setDrivers(driverResponse.data);
        setRoutes(routeResponse.data);
      } catch (err) {
        setSnackbar({
          open: true,
          message: "Failed to load data.",
          severity: "error",
        });
        // setSnackbarMessage("Failed to load data.");
        // setSnackbarOpen(true);
      }
    };
    fetchData();
  }, []);

  const paginatedBuses = busList.slice(
    currentPage * pageSize,
    currentPage * pageSize + pageSize
  );

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBusData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddBus = async () => {

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
      const response = await axiosInstance.post(
        "buses",
        busData
      );
      setBusList((prev) => [
        ...prev,
        { ...response.data.bus, id: response.data.bus.id },
      ]);
      // setBusList((prev) => [...prev, response.data]);
      setSnackbar({
        open: true,
        message: "Bus added successfully!",
        severity: "success",
      });
      setOpenModal(false);
      // setSnackbarMessage("Bus added successfully!");
      clearForm();
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Failed to add bus.",
        severity: "error",
      });
      // setSnackbarMessage("Failed to add bus.");
    } finally {
      // setSnackbarOpen(true);
    }
  };

  const handleUpdateBus = async (busId, updatedData = {}) => {

    const role = user?.role || "";
    if (role === "viewer") {
      setSnackbar({
        open: true,
        message: "You do not have the necessary permissions to perform this action",
        severity: "error",
      });
      return;
    }

    // Find the selected bus in the current bus list
    const selectedBus = busList.find((bus) => bus.id === busId);

    if (!selectedBus) {
      setSnackbar({ open: true, message: "Bus not found.", severity: "error" });
      return;
    }

    // Prepare updated bus data with fallback logic
    const updatedBusData = {
      busNumber:
        updatedData.busNumber || selectedBus.busNumber || busData.busNumber,
      capacity:
        updatedData.capacity || selectedBus.capacity || busData.capacity,
      model: updatedData.model || selectedBus.model || busData.model,
      driverId:
        updatedData.driverId || selectedBus.driverId || busData.driverId,
      licensePlate:
        updatedData.licensePlate ||
        selectedBus.licensePlate ||
        busData.licensePlate,
      color: updatedData.color || selectedBus.color || busData.color,
      status: updatedData.status || selectedBus.status || busData.status,
      fuelType:
        updatedData.fuelType || selectedBus.fuelType || busData.fuelType,
      manufactureYear:
        updatedData.manufactureYear ||
        selectedBus.manufactureYear ||
        busData.manufactureYear,
      mileage: updatedData.mileage || selectedBus.mileage || busData.mileage,
      lastServicedDate:
        updatedData.lastServicedDate ||
        selectedBus.lastServicedDate ||
        busData.lastServicedDate,
      insuranceExpiryDate:
        updatedData.insuranceExpiryDate ||
        selectedBus.insuranceExpiryDate ||
        busData.insuranceExpiryDate,
      assignedRouteId:
        updatedData.assignedRouteId ||
        selectedBus.assignedRouteId ||
        busData.assignedRouteId,
    };

    // Check for required fields
    if (
      !updatedBusData.busNumber
    ) {
      setSnackbar({
        open: true,
        message: "Please fill in all required fields.",
        severity: "error",
      });
      return;
    }

    try {
      // Send the updated bus data to the server
      const response = await axiosInstance.put(
        `buses/${busId}`,
        updatedBusData
      );

      if (response.status === 200) {
        // Update the bus list in the state
        setBusList((prev) =>
          prev.map((bus) =>
            bus.id === busId ? { ...bus, ...updatedBusData } : bus
          )
        );
        setSnackbar({
          open: true,
          message: "Bus updated successfully!",
          severity: "success",
        });
        clearForm(); // Clear the form after successful update
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Failed to update bus.",
        severity: "error",
      });
    }
  };

  const handleDeleteBus = async (busId) => {

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
      await axiosInstance.delete(
        `buses/${busId}`
      );
      setBusList((prev) => prev.filter((bus) => bus.id !== busId));
      setSnackbar({
        open: true,
        message: "Bus deleted successfully!",
        severity: "success",
      });
      // setSnackbarMessage("Bus deleted successfully!");
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Failed to delete bus.",
        severity: "error",
      });
      // setSnackbarMessage("Failed to delete bus.");
    } finally {
      // setSnackbarOpen(true);
    }
  };

  const handleReplaceBusOpen = (busId) => {
    setReplacementBusId(busId);
    setReplacementModalOpen(true);
  };

  const handleReplaceBusClose = () => {
    setReplacementModalOpen(false);
    setReplacementDetails({
      newBusId: "",
      oldBusId: "",
      reason: "",
      duration: "",
      routeId: "",
      driverId: "",
    });
  };

  const handleReplacementInputChange = (e) => {
    const { name, value } = e.target;
    setReplacementDetails((prev) => ({ ...prev, [name]: value }));
  };

  const handleReplaceBusSubmit = async () => {

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
      await axiosInstance.post(
        "replaced_buses",
        {
          ...replacementDetails,
        }
      );
      setSnackbar({
        open: true,
        message: "Bus replacement recorded successfully!",
        severity: "success",
      });
      // setSnackbarMessage("Bus replacement recorded successfully!");
      handleReplaceBusClose();
      // Optionally refresh the bus list or notify users
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Failed to record bus replacement.",
        severity: "error",
      });
      // setSnackbarMessage("Failed to record bus replacement.");
    } finally {
      // setSnackbarOpen(true);
    }
  };

  const clearForm = () => {
    setBusData({
      busNumber: "",
      capacity: 0,
      model: "",
      driverId: "",
    });
    setIsEditing(false);
    setSelectedBusId(null);
  };

  return (
    <div className="mx-auto mt-4 max-w-full rounded-lg bg-gradient-to-r from-gray-100 to-gray-200 p-6 shadow-2xl">
      <h2 className="mb-6 text-3xl font-semibold text-gray-800">
        Manage Buses
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
      <div className="flex gap-2">
      <Button
        variant="contained"
        color="primary"
        onClick={() => setOpenModal(true)}
      >
        Add New Bus
      </Button>
      {/* <div
        variant="contained"
        color="secondary"
        onClick={() => setReplacementModalOpen(true)}
      >
        Replace Bus
      </div> */}
      <Dialog
        open={openModal}
        onClose={() => setOpenModal(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Add New Bus</DialogTitle>
        <DialogContent>
          <div className="grid grid-cols-2 gap-4 p-2">
            <TextField
              label="Bus Number"
              name="busNumber"
              value={busData.busNumber}
              onChange={handleInputChange}
              required
              fullWidth
            />
            <TextField
              label="Capacity"
              name="capacity"
              type="number"
              value={busData.capacity}
              onChange={handleInputChange}
              required
              fullWidth
            />
            <TextField
              label="Model"
              name="model"
              value={busData.model}
              onChange={handleInputChange}
              fullWidth
            />

            {/* Driver Selection Dropdown */}
            <FormControl fullWidth required>
              <InputLabel>Driver</InputLabel>
              <Select
                label="Driver"
                name="driverId"
                value={busData.driverId}
                onChange={handleInputChange}
                required
              >
                <MenuItem value="">Select Driver</MenuItem>
                {drivers.map((driver) => (
                  <MenuItem key={driver.id} value={driver.id}>
                    {driver.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              label="License Plate"
              name="licensePlate"
              value={busData.licensePlate}
              onChange={handleInputChange}
              fullWidth
              required
            />
            <TextField
              label="Color"
              name="color"
              value={busData.color}
              onChange={handleInputChange}
              fullWidth
            />

            {/* Bus Status Dropdown */}
            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                label="Status"
                name="status"
                value={busData.status}
                onChange={handleInputChange}
              >
                <MenuItem value="active">Active</MenuItem>
                <MenuItem value="under maintenance">Under Maintenance</MenuItem>
                <MenuItem value="retired">Retired</MenuItem>
              </Select>
            </FormControl>

            {/* Fuel Type Dropdown */}
            <FormControl fullWidth>
              <InputLabel>Fuel Type</InputLabel>
              <Select
                label="Fuel Type"
                name="fuelType"
                value={busData.fuelType}
                onChange={handleInputChange}
              >
                <MenuItem value="diesel">Diesel</MenuItem>
                <MenuItem value="petrol">Petrol</MenuItem>
                <MenuItem value="electric">Electric</MenuItem>
              </Select>
            </FormControl>

            <TextField
              label="Manufacture Year"
              name="manufactureYear"
              type="number"
              value={busData.manufactureYear}
              onChange={handleInputChange}
              fullWidth
            />
            <TextField
              label="Mileage"
              name="mileage"
              type="number"
              value={busData.mileage}
              onChange={handleInputChange}
              fullWidth
            />
            <TextField
              label="Last Serviced Date"
              name="lastServicedDate"
              type="date"
              value={busData.lastServicedDate}
              onChange={handleInputChange}
              InputLabelProps={{ shrink: true }}
              fullWidth
            />
            <TextField
              label="Insurance Expiry Date"
              name="insuranceExpiryDate"
              type="date"
              value={busData.insuranceExpiryDate}
              onChange={handleInputChange}
              InputLabelProps={{ shrink: true }}
              fullWidth
            />
            <FormControl fullWidth required>
              <InputLabel>Assigned Route</InputLabel>
              <Select
                label="Assigned Route"
                name="assignedRouteId"
                value={busData.assignedRouteId}
                onChange={handleInputChange}
                required
              >
                <MenuItem value="">Select Route</MenuItem>
                {routes.map((route) => (
                  <MenuItem key={route.id} value={route.id}>
                    {route.routeName}
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
          <Button variant="contained" color="primary" onClick={handleAddBus}>
            Add Bus
          </Button>
        </DialogActions>
      </Dialog>
      </div>
      <div style={{ minHeight: "600px", height: "auto", width: "100%", marginTop: "16px" }}>
        {/* <DataGrid
          rows={busList}
          columns={columns}
          pageSize={5}
          checkboxSelection
          onRowEditCommit={(params) => handleUpdateBus(params.id, params)}
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
          dataSource={paginatedBuses}
          keyExpr="id"
          showBorders={true}
          rowAlternationEnabled={true}
          allowColumnResizing={true}
          onRowUpdating={(e) => handleUpdateBus(e.oldData.id, e.newData)}
          onRowRemoving={(e) => handleDeleteBus(e.data.id)}
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

          {/* Columns */}
          <Column dataField="busNumber" caption="Bus Number" minWidth={150}/>
          <Column
            dataField="instituteName"
            caption="Institute Name"
            allowEditing={false}
          minWidth={150}/>
          <Column dataField="capacity" caption="Capacity" minWidth={150}/>
          <Column dataField="model" caption="Model" minWidth={150}/>

          <Column
            dataField="driverId"
            caption="Driver Name"
            editorType="dxSelectBox"
            lookup={{
              dataSource: drivers,
              valueExpr: "id",
              displayExpr: "name",
            }}
          minWidth={150}/>

          <Column dataField="licensePlate" caption="License Plate" minWidth={150}/>
          <Column dataField="color" caption="Color" minWidth={150}/>

          <Column
            dataField="status"
            caption="Status"
            lookup={{
              dataSource: ["active", "under maintenance", "retired"],
              valueExpr: "this",
              displayExpr: "this",
            }}
          minWidth={150}/>

          <Column
            dataField="fuelType"
            caption="Fuel Type"
            lookup={{
              dataSource: ["diesel", "petrol", "electric"],
              valueExpr: "this",
              displayExpr: "this",
            }}
          minWidth={150}/>

          <Column dataField="manufactureYear" caption="Manufacture Year" minWidth={150}/>
          <Column dataField="mileage" caption="Mileage" minWidth={150}/>

          <Column
            dataField="lastServicedDate"
            caption="Last Serviced Date"
            dataType="date"
            editorType="dxDateBox"
            editorOptions={{
              type: "date",
            }}
            format="yyyy-MM-dd"
          minWidth={150}/>

          <Column
            dataField="insuranceExpiryDate"
            caption="Insurance Expiry Date"
            dataType="date"
            editorType="dxDateBox"
            editorOptions={{
              type: "date",
            }}
            format="yyyy-MM-dd"
          minWidth={150}/>

          <Column
            dataField="assignedRouteId"
            caption="Assigned Route ID"
            editorType="dxSelectBox"
            lookup={{
              dataSource: routes,
              valueExpr: "id",
              displayExpr: "routeName",
            }}
          minWidth={150}/>

          {/* <Column
            dataField="startTime"
            caption="Start Time"
            dataType="date"
            editorType="dxDateBox"
            editorOptions={{
              type: "time",
              displayFormat: "HH:mm",
            }}
            format="HH:mm"
          />

          <Column
            dataField="endTime"
            caption="End Time"
            dataType="date"
            editorType="dxDateBox"
            editorOptions={{
              type: "time",
              displayFormat: "HH:mm",
            }}
            format="HH:mm"
          /> */}

          <Column
            type="buttons"
            buttons={[
              "edit",
              "delete",
              {
                hint: "Save Changes",
                icon: "save",
                onClick: (e) => handleUpdateBus(e.row.data.id, e.row.data),
              },
            ]}
          />
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
            Page {currentPage + 1} of {Math.ceil(busList.length / pageSize)}
          </span>
          <Button
            variant="contained"
            onClick={() =>
              setCurrentPage((prev) =>
                Math.min(prev + 1, Math.ceil(busList.length / pageSize) - 1)
              )
            }
            disabled={(currentPage + 1) * pageSize >= busList.length}
          >
            Next
          </Button>
        </div>
      </div>
      <Modal
        open={replacementModalOpen}
        onClose={handleReplaceBusClose}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <Box sx={{ ...modalStyle }}>
          <h2 id="modal-title"></h2>
          <FormControl fullWidth required>
            <InputLabel>Choose Bus to Replace</InputLabel>
            <Select
              name="oldBusId"
              value={replacementDetails.oldBusId}
              onChange={handleReplacementInputChange}
              className="col-span-2"
            >
              <MenuItem value="">Select Bus</MenuItem>
              {busList.map((bus) => (
                <MenuItem key={bus.id} value={bus.id}>
                  {bus.busNumber}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth required>
            <InputLabel>Choose Bus to Replace With</InputLabel>
            <Select
              name="newBusId"
              value={replacementDetails.newBusId}
              onChange={handleReplacementInputChange}
              className="col-span-2"
            >
              <MenuItem value="">Select Bus</MenuItem>
              {busList.map((bus) => (
                <MenuItem key={bus.id} value={bus.id}>
                  {bus.busNumber}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            label="Reason"
            name="reason"
            value={replacementDetails.reason}
            onChange={handleReplacementInputChange}
            fullWidth
          />
          <TextField
            label="Duration in hours"
            name="duration"
            value={replacementDetails.duration}
            onChange={handleReplacementInputChange}
            fullWidth
            required
          />
          <FormControl fullWidth required>
            <InputLabel>Select Route</InputLabel>
            <Select
              label="Select Route"
              name="routeId"
              value={replacementDetails.routeId}
              onChange={handleReplacementInputChange}
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
          <FormControl fullWidth required>
            <InputLabel>Select Driver</InputLabel>
            <Select
              name="driverId"
              value={replacementDetails.driverId}
              onChange={handleReplacementInputChange}
              className="col-span-2"
            >
              <MenuItem value="">Select Driver</MenuItem>
              {drivers.map((driver) => (
                <MenuItem key={driver.id} value={driver.id}>
                  {driver.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Button
            onClick={handleReplaceBusSubmit}
            startIcon={<SaveIcon />}
            color="primary"
          >
            Save
          </Button>
        </Box>
      </Modal>
    </div>
  );
};

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
};

export default ManageBusForDriver;
