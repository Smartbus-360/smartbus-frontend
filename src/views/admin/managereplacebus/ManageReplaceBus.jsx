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

const ManageReplaceBusForDriver = () => {
  const [replacedBus, setReplacedBus] = useState([]);
  const [busList, setBusList] = useState([]);
  const [drivers, setDrivers] = useState([]);
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
  const [routes, setRoutes] = useState([]);
  const token = sessionStorage.getItem("authToken");
  const adminInstituteId = sessionStorage.getItem("instituteId");
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const user = getUser();
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [busResponse, replacedBusResponse, routeResponse, driversResponse] = await Promise.all([
          axiosInstance.get("buses"),
          axiosInstance.get("replaced_buses"),
          axiosInstance.get(`routes/institute/${adminInstituteId}`),
          axiosInstance.get("drivers"),
        ]);
        const buses = busResponse.data.map((bus) => ({ ...bus, id: bus.busId }));
        setBusList(buses);
        setReplacedBus(
          replacedBusResponse.data.map((item) => ({
            ...item,
            id: item.replacedBusId,
          }))
        );
        setRoutes(routeResponse.data);
        setDrivers(driversResponse.data);
      } catch (err) {
        setSnackbar({
          open: true,
          message: "Failed to load data.",
          severity: "error",
        });
      }
    };
    fetchData();
  }, []);
  
  const paginatedReplacedBus = replacedBus.slice(
    currentPage * pageSize,
    currentPage * pageSize + pageSize
  );

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
        { ...replacementDetails }
      );
      setSnackbar({
        open: true,
        message: "Bus replacement recorded successfully!",
        severity: "success",
      });
      setReplacementModalOpen(false);
      handleReplaceBusClose();
      // Refresh replaced buses list
      const replacedBusResponse = await axiosInstance.get("replaced_buses", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setReplacedBus(
        replacedBusResponse.data.map((item) => ({
          ...item,
          id: item.replacedBusId,
        }))
      );
      
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Failed to record bus replacement.",
        severity: "error",
      });
    }
  };  

  const handleRowUpdate = async (updatedData) => {
    // Validate required fields
    const { replacedBusId, busReplacedWithId, reason, duration, dbId } = updatedData;
    if (!replacedBusId || !busReplacedWithId || !duration) {
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
  
    try {
      // Update the bus replacement record
      await axiosInstance.put(
        `replaced_buses/${dbId}`,
        { oldBusId: replacedBusId, newBusId: busReplacedWithId, reason, duration }
      );
  
      // Refresh replaced buses list
      const replacedBusResponse = await axiosInstance.get("replaced_buses");
      setReplacedBus(
        replacedBusResponse.data.map((item) => ({
          ...item,
          id: item.replacedBusId,
        }))
      );
  
      setSnackbar({
        open: true,
        message: "Bus replacement updated successfully!",
        severity: "success",
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Failed to update bus replacement.",
        severity: "error",
      });
    }
  };
  
  
  const handleRowRemove = async ({ data }) => {

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
      // Call the API to delete the replaced bus record
      await axiosInstance.delete(
        `replaced_buses/${data.dbId}`
      );
      // Update the UI with success message
      setSnackbar({
        open: true,
        message: "Bus replacement deleted successfully!",
        severity: "success",
      });
      
      // Refresh the replaced buses list after deletion
      const replacedBusResponse = await axiosInstance.get("replaced_buses");
      setReplacedBus(
        replacedBusResponse.data.map((item) => ({
          ...item,
          id: item.replacedBusId,
        }))
      );
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Failed to delete bus replacement.",
        severity: "error",
      });
    }
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

  return (
    <div className="mx-auto mt-4 max-w-full rounded-lg bg-gradient-to-r from-gray-100 to-gray-200 p-6 shadow-2xl">
      <h2 className="mb-6 text-3xl font-semibold text-gray-800">
        Manage Replace Buses
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
        onClick={() => setReplacementModalOpen(true)}
      >
        Replace Bus
      </Button>
      <Dialog
          open={replacementModalOpen}
          onClose={() => setReplacementModalOpen(false)}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>Replace Bus</DialogTitle>
          <DialogContent>
            <div className="mt-2 grid grid-cols-2 gap-4">
            <FormControl fullWidth required>
            <InputLabel>Choose Bus to Replace</InputLabel>
              <Select
                label="Choose Bus to Replace"
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
                label="Choose Bus to Replace With"
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
          {/* <FormControl fullWidth required>
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
          </FormControl> */}
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
            </div>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setReplacementModalOpen(false)} color="secondary">
              Cancel
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={handleReplaceBusSubmit}
            >
              Replace Bus
            </Button>
          </DialogActions>
        </Dialog>
      </div>
      <div style={{ minHeight: "600px", height: "auto", width: "100%", marginTop: "16px" }}>
      <DataGrid
        dataSource={paginatedReplacedBus}
        keyExpr="replacedBusId"
        showBorders={true}
        rowAlternationEnabled={true}
        allowColumnResizing={true}
        onRowUpdating={(e) => handleRowUpdate(e.newData)}
        onRowRemoving={handleRowRemove}
        scrolling={{ mode: 'virtual', useNative: true }}
      >
        <Editing mode="cell" allowUpdating={true} allowDeleting={true} useIcons={true} />
        <SearchPanel visible={true} highlightCaseSensitive={true} />
        <Paging defaultPageSize={10} />
        <Pager showPageSizeSelector={false} showInfo={true} />
        {/* Define Columns */}
        <Column
          dataField="replacedBusId"
          caption="Replaced Bus Number"
          editorType="dxSelectBox"
          lookup={{
            dataSource: busList,
            valueExpr: "id",
            displayExpr: "busNumber",
          }}
          minWidth={150}
        />

        <Column
          dataField="busReplacedWithId"
          caption="Bus Replaced With Number"
          editorType="dxSelectBox"
          lookup={{
            dataSource: busList,
            valueExpr: "id", 
            displayExpr: "busNumber",
          }}
          minWidth={150}
        />

        <Column dataField="replacedBusDriverName" caption="Replaced Bus Driver" allowEditing={false} minWidth={250}/>
        <Column dataField="busReplacedWithDriverName" caption="Bus Replaced With Driver" allowEditing={false} minWidth={250}/>
        <Column dataField="replacedBusRouteName" caption="Replaced Bus Route" allowEditing={false} minWidth={250}/>
        <Column dataField="busReplacedWithRouteName" caption="Bus Replaced With Route" allowEditing={false} minWidth={250}/>
        <Column dataField="duration" caption="Duration (hrs)" minWidth={150}/>
        <Column dataField="reason" caption="Reason" minWidth={150}/>
        <Column dataField="till" caption="Till (Calculated)" dataType="datetime" allowEditing={false} minWidth={150}/>

        <Column
          type="buttons"
          buttons={[
            "edit",
            "delete",
            {
              hint: "Save Changes",
              icon: "save",
              onClick: (e) => handleRowUpdate(e.row.data),
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
            Page {currentPage + 1} of {Math.ceil(replacedBus.length / pageSize)}
          </span>
          <Button
            variant="contained"
            onClick={() =>
              setCurrentPage((prev) =>
                Math.min(prev + 1, Math.ceil(replacedBus.length / pageSize) - 1)
              )
            }
            disabled={(currentPage + 1) * pageSize >= replacedBus.length}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ManageReplaceBusForDriver;
