import React, { useState, useEffect ,useRef} from "react";
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
  Typography
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import SaveIcon from "@mui/icons-material/Save";
import { AddCircleOutline, RemoveCircleOutline } from "@mui/icons-material";
import axiosInstance from "../../../api/axios";
import { getUser } from "../../../config/authService";
const ManageRoute = () => {
  const [institutes, setInstitutes] = useState([]);
  const [instituteId, setInstituteId] = useState("");
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [openRouteModal, setOpenRouteModal] = useState(false);
  const [allRoutes, setAllRoutes] = useState([]);
const gridRef = useRef(null);
  const [newRoute, setNewRoute] = useState({
    routeName: "",
    description: "",
    totalDistance: "",
    estimatedTravelTime: "",
    startLocation: "",
    endLocation: "",
    instituteId,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    routeType: "",
    stopSequence: "",
    isActive: true,
    scheduledDays: "",
    startTime: "",
    endTime: "",
    capacity: "",
    routeStatus: "",
    pickupInstructions: "",
    dropOffInstructions: "",
    routeShiftTimings: {
  morning: { rounds: {} },
  afternoon: { rounds: {} },
  evening: { rounds: {} }
},
  });
  const handleSnackbarClose = () => setSnackbar({ ...snackbar, open: false });
  const token = sessionStorage.getItem("authToken");
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [confirmUpdateOpen, setConfirmUpdateOpen] = useState(false);
const [pendingUpdate, setPendingUpdate] = useState(null);
  const [showAll, setShowAll] = useState(false);
    // Safe paging math
const maxPage = Math.max(0, Math.ceil(allRoutes.length / pageSize) - 1);
const safePage = Math.min(Math.max(currentPage, 0), maxPage);

// Slice using safePage to avoid out-of-range
const paginatedRoutes = allRoutes.slice(
  safePage * pageSize,
  safePage * pageSize + pageSize
);

// IMPORTANT: define this AFTER paginatedRoutes
const dataForGrid = showAll ? allRoutes : paginatedRoutes;
  


  const user = getUser();
  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      const [institutesResponse, routesResponse] =
        await Promise.all([
          axiosInstance.get("institutes"),
          axiosInstance.get("routes"),
        ]);
      setInstitutes(institutesResponse.data);
      setAllRoutes(routesResponse.data);
    } catch (err) {
      setSnackbar({
        open: true,
        message: "Failed to load data.",
        severity: "error",
      });
    }
  };


  const handleRouteInputChange = (event) => {
    const { name, value, type, checked } = event.target;

    if (type === "checkbox") {
      // Handle checkbox input
      setNewRoute((prev) => ({
        ...prev,
        [name]: checked ? 1 : 0,
      }));
    } else if (name === "startTime" || name === "endTime") {
      // Ensure the time input is in HH:mm format
      const [hours, minutes] = value.split(":");
      const formattedTime = `${String(hours).padStart(2, "0")}:${String(
        minutes
      ).padStart(2, "0")}`;

      setNewRoute((prev) => ({
        ...prev,
        [name]: formattedTime,
      }));
    } else {
      setNewRoute((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleAddRoute = async () => {

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
        "routes",
        {
          routeName: newRoute.routeName,
          description: newRoute.description,
          totalDistance: newRoute.totalDistance,
          estimatedTravelTime: newRoute.estimatedTravelTime,
          startLocation: newRoute.startLocation,
          endLocation: newRoute.endLocation,
          instituteId: newRoute.instituteId,
          routeType: newRoute.routeType,
          stopSequence: newRoute.stopSequence,
          isActive: newRoute.isActive,
          scheduledDays: newRoute.scheduledDays,
          startTime: newRoute.startTime,
          endTime: newRoute.endTime,
          capacity: newRoute.capacity,
          routeStatus: newRoute.routeStatus,
          pickupInstructions: newRoute.pickupInstructions,
          dropOffInstructions: newRoute.dropOffInstructions,
        }
      );

      if (response.data.success) {
        setNewRoute({
          routeName: "",
          description: "",
          totalDistance: "",
          estimatedTravelTime: "",
          startLocation: "",
          endLocation: "",
          instituteId,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          routeType: "",
          stopSequence: "",
          isActive: true,
          scheduledDays: "",
          startTime: "",
          endTime: "",
          capacity: "",
          routeStatus: "",
          pickupInstructions: "",
          dropOffInstructions: "",
        });
        fetchInitialData();
        setSnackbar({
          open: true,
          message: "Route added successfully!",
          severity: "success",
        });
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Failed to add route. Please try again.",
        severity: "error",
      });
    }
  };
const handleConfirmClose = () => {
  setConfirmUpdateOpen(false);
  setPendingUpdate(null);
  if (gridRef.current) {
    gridRef.current.instance.cancelEditData();  // cancel edit cleanly
  }
};

  const handleUpdateRoute = async (routeId, updatedRoute = {}) => {

    const role = user?.role || "";
    if (role === "viewer") {
      setSnackbar({
        open: true,
        message: "You do not have the necessary permissions to perform this action",
        severity: "error",
      });
      return;
    }

    // Fetch the route data from `routes` as a fallback for missing fields
    const selectedRoute = allRoutes.find((route) => route.id === routeId);
    if (!selectedRoute) {
      setSnackbar({
        open: true,
        message: "Route not found.",
        severity: "error",
      });
      return;
    }

    // Validate required fields using fallback values
    if (
      (!updatedRoute.routeName && !selectedRoute.routeName) ||
      (!updatedRoute.startLocation && !selectedRoute.startLocation) ||
      (!updatedRoute.endLocation && !selectedRoute.endLocation)
    ) {
      setSnackbar({
        open: true,
        message: "Please fill in all required fields.",
        severity: "error",
      });
      return;
    }

    // Prepare payload with fallback values
    const payload = {
      routeName: updatedRoute.routeName || selectedRoute.routeName || "",
      description: updatedRoute.description || selectedRoute.description || "",
      startLocation:
        updatedRoute.startLocation || selectedRoute.startLocation || "",
      endLocation: updatedRoute.endLocation || selectedRoute.endLocation || "",
      totalDistance:
        updatedRoute.totalDistance || selectedRoute.totalDistance || "0.00",
      estimatedTravelTime:
        updatedRoute.estimatedTravelTime ||
        selectedRoute.estimatedTravelTime ||
        "",
      routeType: updatedRoute.routeType || selectedRoute.routeType || "regular",
      stopSequence:
        updatedRoute.stopSequence || selectedRoute.stopSequence || "",
      isActive:
        updatedRoute.isActive !== undefined
          ? updatedRoute.isActive
          : selectedRoute.isActive,
      scheduledDays:
        updatedRoute.scheduledDays || selectedRoute.scheduledDays || "",
      startTime: updatedRoute.startTime || selectedRoute.startTime || "",
      endTime: updatedRoute.endTime || selectedRoute.endTime || "",
      capacity: updatedRoute.capacity || selectedRoute.capacity || 0,
      routeStatus:
        updatedRoute.routeStatus || selectedRoute.routeStatus || "operational",
      pickupInstructions:
        updatedRoute.pickupInstructions ||
        selectedRoute.pickupInstructions ||
        "",
      dropOffInstructions:
        updatedRoute.dropOffInstructions ||
        selectedRoute.dropOffInstructions ||
        "",
    };

    try {
      // Make API call to update the route
      const response = await axiosInstance.put(
        `routes/${routeId}`,
        payload
      );

      // Check if the response indicates success
      if (response.data.success) {
        const updatedRouteData = response.data.route;

        // Update the route in the state
        setAllRoutes(
          allRoutes.map((route) =>
            route.id === updatedRouteData.id ? updatedRouteData : route
          )
        );
        setSnackbar({
          open: true,
          message: "Route updated successfully!",
          severity: "success",
        });
      } else {
        setSnackbar({
          open: true,
          message: "Failed to update route.",
          severity: "error",
        });
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Failed to update route.",
        severity: "error",
      });
    }
  };
const updateShiftTiming = (shift, round, field, value) => {
  setNewRoute(prev => ({
    ...prev,
    routeShiftTimings: {
      ...prev.routeShiftTimings,
      [shift]: {
        rounds: {
          ...prev.routeShiftTimings[shift].rounds,
          [round]: {
            ...prev.routeShiftTimings[shift].rounds[round],
            [field]: value
          }
        }
      }
    }
  }));
};

  const handleDeleteRoute = async (routeId) => {

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
        `routes/${routeId}`
      );

      if (response.data.message === "Route deleted successfully.") {
        // Remove the deleted route from the state
        setAllRoutes(allRoutes.filter((route) => route.id !== routeId));
        setSnackbar({
          open: true,
          message: "Route deleted successfully!",
          severity: "success",
        });
      } else {
        setSnackbar({
          open: true,
          message: "Failed to delete route!",
          severity: "error",
        });
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Failed to delete route!",
        severity: "error",
      });
    }
  };

  return (
    <div className="mx-auto mt-4 max-w-full rounded-lg bg-gradient-to-r from-gray-100 to-gray-200 p-6 shadow-2xl">
      <h2 className="mb-6 text-3xl font-semibold text-gray-800">
        Manage Routes
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
<div style={{ display: "flex", gap: 12, marginTop: 12, flexWrap: "wrap" }}>

        <Button
          variant="contained"
          color="primary"
          onClick={() => setOpenRouteModal(true)}
        >
          Add Route
        </Button>
<Button
    variant="outlined"
    onClick={() => {
      setShowAll(prev => !prev);
      setCurrentPage(0);
    }}
  >
    {showAll ? "Show by pages" : "Show all routes"}
  </Button>
      </div>
        {/* New Route Form */}
        <Dialog
          open={openRouteModal}
          onClose={() => setOpenRouteModal(false)}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>Add New Route</DialogTitle>
          <DialogContent>
            <div className="grid grid-cols-2 gap-4 p-2">
              {/* Route Input Fields */}
              <TextField
                label="Route Name"
                name="routeName"
                value={newRoute.routeName}
                onChange={handleRouteInputChange}
                required
              />
              <TextField
                label="Description"
                name="description"
                value={newRoute.description}
                onChange={handleRouteInputChange}
                multiline
                rows={2}
              />
              <TextField
                label="Total Distance (km)"
                type="number"
                name="totalDistance"
                value={newRoute.totalDistance}
                onChange={handleRouteInputChange}
                inputProps={{ step: "0.01" }}
              />
              <TextField
                label="Estimated Travel Time"
                name="estimatedTravelTime"
                value={newRoute.estimatedTravelTime}
                onChange={handleRouteInputChange}
              />
              <TextField
                label="Start Location"
                name="startLocation"
                value={newRoute.startLocation}
                onChange={handleRouteInputChange}
                required
              />
              <TextField
                label="End Location"
                name="endLocation"
                value={newRoute.endLocation}
                onChange={handleRouteInputChange}
                required
              />
              <FormControl required className="col-span-2">
                <InputLabel>Select Institute</InputLabel>
                <Select
                  name="instituteId"
                  value={newRoute.instituteId}
                  onChange={handleRouteInputChange}
                >
                  <MenuItem value="">Select Institute</MenuItem>
                  {institutes.map((institute) => (
                    <MenuItem key={institute.id} value={institute.id}>
                      {institute.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl fullWidth>
                <InputLabel>Route Type</InputLabel>
                <Select
                  name="routeType"
                  value={newRoute.routeType}
                  onChange={handleRouteInputChange}
                >
                  <MenuItem value="regular">Regular</MenuItem>
                  <MenuItem value="express">Express</MenuItem>
                  <MenuItem value="special">Special</MenuItem>
                </Select>
              </FormControl>
              <TextField
                label="Stop Sequence"
                name="stopSequence"
                value={newRoute.stopSequence}
                onChange={handleRouteInputChange}
                multiline
              />
              <FormControl fullWidth>
                <InputLabel>Route Status</InputLabel>
                <Select
                  name="routeStatus"
                  value={newRoute.routeStatus}
                  onChange={handleRouteInputChange}
                >
                  <MenuItem value="operational">Operational</MenuItem>
                  <MenuItem value="under maintenance">
                    Under Maintenance
                  </MenuItem>
                  <MenuItem value="suspended">Suspended</MenuItem>
                </Select>
              </FormControl>
              <TextField
                label="Scheduled Days"
                name="scheduledDays"
                value={newRoute.scheduledDays}
                onChange={handleRouteInputChange}
              />
              <TextField
                label="Start Time"
                type="time"
                name="startTime"
                value={newRoute.startTime}
                onChange={handleRouteInputChange}
              />
              <TextField
                label="End Time"
                type="time"
                name="endTime"
                value={newRoute.endTime}
                onChange={handleRouteInputChange}
              />
              <TextField
                label="Capacity"
                type="number"
                name="capacity"
                value={newRoute.capacity}
                onChange={handleRouteInputChange}
              />
              <TextField
                label="Pickup Instructions"
                name="pickupInstructions"
                value={newRoute.pickupInstructions}
                onChange={handleRouteInputChange}
                multiline
                rows={2}
              />
              <TextField
                label="Drop-Off Instructions"
                name="dropOffInstructions"
                value={newRoute.dropOffInstructions}
                onChange={handleRouteInputChange}
                multiline
                rows={2}
              />
              <FormControlLabel
                control={
                  <Checkbox
                    name="isActive"
                    checked={newRoute.isActive}
                    onChange={handleRouteInputChange}
                  />
                }
                label="Is Active"
              />
            </div>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenRouteModal(false)} color="secondary">
              Cancel
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={handleAddRoute}
            >
              Add Route
            </Button>
          </DialogActions>
        </Dialog>

      <div style={{ minHeight: "600px", height: "auto", width: "100%", marginTop: "16px" }}>
        <DataGrid
            ref={gridRef}
          dataSource={dataForGrid}
          keyExpr="id"
          showBorders={true}
          rowAlternationEnabled={true}
          allowColumnResizing={true}
          onRowUpdating={(e) => {
            e.cancel = true; // stop direct update
    setPendingUpdate({ id: e.oldData.id, newData: e.newData });
    setConfirmUpdateOpen(true); // open popup
  }}

          onRowRemoving={(e) => handleDeleteRoute(e.data.id)}
          scrolling={{ mode: 'virtual', useNative: true }}
        >
          <Editing
            mode="cell"
            allowUpdating={true}
            allowDeleting={true}
            useIcons={true}
          />
          <SearchPanel visible={true} highlightCaseSensitive={true} />
          <Paging enabled={!showAll}  defaultPageSize={10} />
          <Pager showPageSizeSelector={false} showInfo={true} />

          {/* Columns */}
          <Column dataField="routeName" caption="Route Name" minWidth={150}/>
          {/* <Column
            dataField="instituteName"
            caption="Institute Name"
            allowEditing={false}
          /> */}
          <Column dataField="description" caption="Description" minWidth={150}/>
          <Column dataField="totalDistance" caption="Total Distance (km)" minWidth={150}/>
          <Column
            dataField="estimatedTravelTime"
            caption="Estimated Time"
            // dataType="date"
          minWidth={150}/>
          <Column dataField="startLocation" caption="Start Location" minWidth={150}/>
          <Column dataField="endLocation" caption="End Location" minWidth={150}/>
          <Column
            dataField="routeType"
            caption="Route Type"
            lookup={{
              dataSource: ["regular", "special"],
              valueExpr: "this",
              displayExpr: "this",
            }}
          minWidth={150}/>
          <Column dataField="scheduledDays" caption="Scheduled Days" minWidth={150}/>
          <Column dataField="startTime" caption="Start Time"     
          dataType="date"
          editorType="dxDateBox"
          editorOptions={{
            type: 'time',
            displayFormat: 'HH:mm',
          }}
          format="HH:mm" minWidth={150}/>
          <Column dataField="endTime" caption="End Time"           
          dataType="date"
          editorType="dxDateBox"
          editorOptions={{
            type: 'time',
            displayFormat: 'HH:mm',
          }}
          format="HH:mm" minWidth={150}/>

          <Column
            dataField="routeStatus"
            caption="Status"
            lookup={{
              dataSource: ["operational", "suspended"],
              valueExpr: "this",
              displayExpr: "this",
            }}
          minWidth={150}/>
          <Column dataField="capacity" caption="Capacity" minWidth={150}/>
          <Column dataField="pickupInstructions" caption="Pickup Instructions" minWidth={150}/>
          <Column dataField="dropOffInstructions" caption="Drop-Off Instructions" minWidth={150}/>
          <Column
            type="buttons"
            buttons={[
              "edit",
              "delete",
              {
                hint: "Save Changes",
                icon: "save",
                onClick: (e) => {
    setPendingUpdate({ id: e.row.data.id, newData: e.row.data });
    setConfirmUpdateOpen(true);
                },
              },
            ]}
          />
        </DataGrid>
        {!showAll && (
        <div style={{ display: "flex", justifyContent: "space-between", margin: "10px 0" }}>
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
onClick={() => setCurrentPage(prev => Math.min(prev + 1, maxPage))}
      disabled={safePage >= maxPage}
    >
            Next
          </Button>
        </div>
  )}
      </div>
      <Dialog
  open={confirmUpdateOpen}
  onClose={handleConfirmClose}
  fullWidth
  maxWidth="sm"
>
  <DialogTitle>Confirm Update / पुष्टि करें</DialogTitle>
  <DialogContent>
    <Typography>
      Do you want to apply changes to route{" "}
      <strong>{pendingUpdate?.newData?.routeName}</strong>? <br />
      क्या आप मार्ग{" "}
      <strong>{pendingUpdate?.newData?.routeName}</strong>{" "}
      में बदलाव करना चाहते हैं?
    </Typography>
  </DialogContent>
  <DialogActions>
    <Button onClick={handleConfirmClose} color="secondary">
      No / नहीं
    </Button>
    <Button
      onClick={() => {
        handleUpdateRoute(pendingUpdate.id, pendingUpdate.newData);
        handleConfirmClose();
      }}
      color="primary"
      variant="contained"
    >
      Yes, Update / हाँ, अपडेट करें
    </Button>
  </DialogActions>
</Dialog>

    </div>
  );
};

export default ManageRoute;
