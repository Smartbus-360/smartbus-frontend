import React, { useState, useEffect } from "react";
import axios from "axios";
import DataGrid, {
  Column,
  Editing,
  SearchPanel,
  Paging,
  Pager,
} from "devextreme-react/data-grid";
import "devextreme/dist/css/dx.material.blue.light.css";
import {
  Button,
  TextField,
  Select,
  MenuItem,
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Modal,
  Box,
  Typography,
} from "@mui/material";
import {
  MapContainer,
  TileLayer,
  Marker,
  useMapEvents,
  useMap,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { GeoSearchControl, OpenStreetMapProvider } from "leaflet-geosearch";
import "leaflet-geosearch/dist/geosearch.css";
import axiosInstance from "../../../api/axios";
import { getUser } from "../../../config/authService";

const ManageStoppage = () => {
  const [stoppages, setStoppages] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [newStoppage, setNewStoppage] = useState({
    stopName: "",
    latitude: "",
    longitude: "",
    stopOrder: 0,
    stopType: "",
    estimatedStopDuration: "",
    rounds: {
      morning: [],
      afternoon: [],
      evening: [],
    },
    arrivalTime: "",
    departureTime: "",
    afternoonarrivalTime: "",
    afternoondepartureTime: "",
    eveningarrivalTime: "",
    eveningdepartureTime: "",
    passengerCount: 0,
    comments: "",
    isAccessible: "no",
    landmark: "",
    routeId: "",
  });
  const handleSnackbarClose = () => setSnackbar({ ...snackbar, open: false });
  const [error, setError] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [openModal, setOpenModal] = useState(false);
  const [editedStoppages, setEditedStoppage] = useState({});
  const [roundInput, setRoundInput] = useState("");
  const [roundsModalOpen, setRoundsModalOpen] = useState(false);
  const [selectedStop, setSelectedStop] = useState(null);
  const [selectedRound, setSelectedRound] = useState(null);
  const [roundDeleteModalOpen, setRoundDeleteModalOpen] = useState(false);
  const [newRound, setNewRound] = useState({
    shift: "",
    round: "",
    arrivalTime: "",
    departureTime: "",
  });
  console.log("selected", selectedStop);
  console.log("selected round", selectedRound);
  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
    setError("");
  };
  const token = sessionStorage.getItem("authToken");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [showAll, setShowAll] = useState(false);

  const user = getUser();
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const stoppagesResponse = await axiosInstance.get("stoppages");
        const routesResponse = await axiosInstance.get("routes");
        setStoppages(stoppagesResponse.data.stoppages);
        setRoutes(routesResponse.data);
      } catch (err) {
        setSnackbar({
          open: true,
          message: "Failed to load data.",
          severity: "error",
        });
        // setError("Failed to load data.");
        // setSnackbarOpen(true);
      }
    };
    fetchInitialData();
  }, []);

  useEffect(() => {
    if (newRound.shift) {
      handleAddRound();
    }
  }, [newRound]);
  

  const totalPages = Math.ceil(stoppages.length / pageSize);

  // Paginated data
  const paginatedStoppages = stoppages.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );
  const dataForGrid = showAll ? stoppages : paginatedStoppages;


  // const paginatedStoppages = stoppages.slice(
  //   currentPage * pageSize,
  //   currentPage * pageSize + pageSize
  // );
  

  // Function to get the visible page numbers based on the current page
  const getPageNumbers = () => {
    const pageNumbers = [];
    const rangeLimit = 2; // Number of pages to show before and after the current page

    // If the total pages are less than or equal to 6, show all pages
    if (totalPages <= 6) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      // Always show the first page
      pageNumbers.push(1);

      // Show "..." if there is a gap between the first page and the current page
      if (currentPage > rangeLimit + 2) {
        pageNumbers.push("...");
      }

      // Show pages around the current page
      let start = Math.max(currentPage - rangeLimit, 2); // Avoid showing the first page multiple times
      let end = Math.min(currentPage + rangeLimit, totalPages - 1); // Avoid showing the last page multiple times

      for (let i = start; i <= end; i++) {
        pageNumbers.push(i);
      }

      // Show "..." if there is a gap between the last page and the current page
      if (currentPage < totalPages - rangeLimit - 1) {
        pageNumbers.push("...");
      }

      // Always show the last page
      if (totalPages > 1) {
        pageNumbers.push(totalPages);
      }
    }

    // Remove duplicate numbers
    return pageNumbers;
  };

  // const handlePageChange = (page) => {
  //   setCurrentPage(page);
  // };

  // const handleInputChange = (event) => {
  //   const { name, value } = event.target;
  //   setNewStoppage((prev) => ({ ...prev, [name]: value }));
  // };
  // const handleInputChange = (event) => {
  //   const { name, value } = event.target;

  //   // Check if the field being updated is a time field
  //   if (name === "arrivalTime" || name === "departureTime" || name === "afternoonarrivalTime" || name === "afternoondepartureTime" || name === "eveningarrivalTime" || name === "eveningdepartureTime") {
  //     // Ensure the time input is in HH:mm format
  //     const [hours, minutes] = value.split(":");
  //     const formattedTime = `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;

  //     setNewStoppage((prev) => ({
  //       ...prev,
  //       [name]: formattedTime,
  //     }));
  //   } else {
  //     setNewStoppage((prev) => ({
  //       ...prev,
  //       [name]: value,
  //     }));
  //   }
  // };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setNewStoppage((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle round count change
  // const handleRoundChange = (shift, count) => {
  //   setNewStoppage((prev) => ({
  //     ...prev,
  //     rounds: {
  //       ...prev.rounds,
  //       [shift]: Array.from({ length: Number(count) }, (_, i) => ({
  //         round: i + 1,
  //         arrivalTime: "",
  //         // departureTime: "",
  //       })),
  //     },
  //   }));
  // };

  const handleRoundChange = (shift, inputValue) => {
    setRoundInput(inputValue); // Store raw input separately

    // Allow only numbers and commas
    const sanitizedInput = inputValue.replace(/[^0-9,]/g, "");

    // Convert to array
    const roundsArray = sanitizedInput
      .split(",")
      .map((num) => Number(num.trim()))
      .filter((num) => !isNaN(num) && num > 0); // Remove invalid entries

    setNewStoppage((prev) => ({
      ...prev,
      rounds: {
        ...prev.rounds,
        [shift]: roundsArray.map((round) => ({
          round,
          arrivalTime: "",
        })),
      },
    }));
  };

  // Handle arrival and departure time change for rounds
  const handleTimeChange = (shift, index, type, value) => {
    setNewStoppage((prev) => ({
      ...prev,
      rounds: {
        ...prev.rounds,
        [shift]: prev.rounds[shift].map((round, i) =>
          i === index ? { ...round, [type]: value } : round
        ),
      },
    }));
  };

  const handleAddStoppage = async () => {
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

    if (
      !newStoppage.stopName ||
      !newStoppage.latitude ||
      !newStoppage.longitude ||
      !newStoppage.routeId ||
      !newStoppage.stopType
    ) {
      setSnackbar({
        open: true,
        message: "Please fill in all required fields.",
        severity: "error",
      });
      // setError("Please fill in all required fields.");
      // setSnackbarOpen(true);
      return;
    }

    try {
      const payload = {
        ...newStoppage,
        rounds: JSON.stringify(newStoppage.rounds),
      };
      const response = await axiosInstance.post("stoppages", payload);
      if (response.data.success) {
        setStoppages([
          ...stoppages,
          { id: response.data.stoppage.id, ...response.data.stoppage },
        ]);
        setNewStoppage({
          stopName: "",
          latitude: "",
          longitude: "",
          stopOrder: 0,
          stopType: "",
          estimatedStopDuration: "",
          rounds: {
            morning: [],
            afternoon: [],
            evening: [],
          },
          arrivalTime: "",
          departureTime: "",
          afternoonarrivalTime: "",
          afternoondepartureTime: "",
          eveningarrivalTime: "",
          eveningdepartureTime: "",
          passengerCount: 0,
          comments: "",
          isAccessible: "no",
          landmark: "",
          routeId: "",
        });
        setSnackbar({
          open: true,
          message: "Stoppage added successfully!",
          severity: "success",
        });
        setOpenModal(false);
      } else {
        setSnackbar({
          open: true,
          message: "Failed to add stoppage!",
          severity: "error",
        });
        // setError("Failed to add stoppage.");
        // setSnackbarOpen(true);
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Failed to add stoppage!",
        severity: "error",
      });
      // console.error("Error adding stoppage:", error);
      // setError("Failed to add stoppage.");
      // setSnackbarOpen(true);
    }
  };

  const handleUpdateStoppage = async (stopId, updatedData = {}) => {
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
    // Find the selected stoppage in the current stoppage list
    const selectedStoppage = stoppages.find(
      (stoppage) => stoppage.id === stopId
    );

    if (!selectedStoppage) {
      setSnackbar({
        open: true,
        message: "Stoppage not found.",
        severity: "error",
      });
      return;
    }

    // Validate input
    if (
      (!updatedData.stopName && !selectedStoppage.stopName) ||
      (!updatedData.latitude && !selectedStoppage.latitude) ||
      (!updatedData.longitude && !selectedStoppage.longitude) ||
      (!updatedData.routeId && !selectedStoppage.routeId)
    ) {
      setSnackbar({
        open: true,
        message: "Please fill in all required fields.",
        severity: "error",
      });
      return;
    }

    // Prepare payload with fallback logic
    const payload = {
      stopName: updatedData.stopName || selectedStoppage.stopName,
      latitude: updatedData.latitude || selectedStoppage.latitude,
      longitude: updatedData.longitude || selectedStoppage.longitude,
      stopOrder: updatedData.stopOrder || selectedStoppage.stopOrder,
      stopType: updatedData.stopType || selectedStoppage.stopType,
      estimatedStopDuration:
        updatedData.estimatedStopDuration ||
        selectedStoppage.estimatedStopDuration,
      arrivalTime: updatedData.arrivalTime || selectedStoppage.arrivalTime,
      departureTime:
        updatedData.departureTime || selectedStoppage.departureTime,
      afternoonarrivalTime:
        updatedData.afternoonarrivalTime ||
        selectedStoppage.afternoonarrivalTime,
      afternoondepartureTime:
        updatedData.afternoondepartureTime ||
        selectedStoppage.afternoondepartureTime,
      eveningarrivalTime:
        updatedData.eveningarrivalTime || selectedStoppage.eveningarrivalTime,
      eveningdepartureTime:
        updatedData.eveningdepartureTime ||
        selectedStoppage.eveningdepartureTime,
      passengerCount:
        updatedData.passengerCount || selectedStoppage.passengerCount,
      comments: updatedData.comments || selectedStoppage.comments,
      isAccessible: updatedData.isAccessible || selectedStoppage.isAccessible,
      landmark: updatedData.landmark || selectedStoppage.landmark,
      routeId: updatedData.routeId || selectedStoppage.routeId,
      rounds: JSON.stringify(updatedData.rounds || selectedStoppage.rounds),
    };

    try {
      // Make API call to update the stoppage
      const response = await axiosInstance.put(`stoppages/${stopId}`, payload);

      // Check if the response indicates success
      if (response.data.success) {
        const updatedStopData = response.data.stoppage; // Assume stoppage data is returned

        // Update the stoppage in the state
        setStoppages(
          stoppages.map((stoppage) =>
            stoppage.id === updatedStopData.id ? updatedStopData : stoppage
          )
        );

        // Show success message
        setSnackbar({
          open: true,
          message: "Stoppage updated successfully!",
          severity: "success",
        });
      } else {
        setSnackbar({
          open: true,
          message: "Failed to update stoppage.",
          severity: "error",
        });
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Failed to update stoppage.",
        severity: "error",
      });
    }
  };

  const handleDeleteStoppage = async (stoppageId) => {
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
      const response = await axiosInstance.delete(`stoppages/${stoppageId}`);
      if (response.data.message === "Stoppage deleted successfully.") {
        setStoppages(
          stoppages.filter((stoppage) => stoppage.id !== stoppageId)
        );
        setSnackbar({
          open: true,
          message: "Stoppage deleted successfully!",
          severity: "success",
        });
        // setSnackbarOpen(true);
        // setError("Stoppage deleted successfully.");
      } else {
        setSnackbar({
          open: true,
          message: "Failed to delete stoppage.",
          severity: "error",
        });
        // setError("Failed to delete stoppage.");
        // setSnackbarOpen(true);
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Failed to delete stoppage.",
        severity: "error",
      });
      // console.error("Error deleting stoppage:", error);
      // setError("Failed to delete stoppage.");
      // setSnackbarOpen(true);
    }
  };

  const MapEvents = ({ setNewStoppage }) => {
    const map = useMap(); // Get the map instance

    // Handle map click events to set coordinates
    useMapEvents({
      click(e) {
        const { lat, lng } = e.latlng;
        setNewStoppage((prev) => ({
          ...prev,
          latitude: lat,
          longitude: lng,
        }));
      },
    });

    useEffect(() => {
      const provider = new OpenStreetMapProvider();
      const searchControl = new GeoSearchControl({
        provider,
        style: "bar",
        autoComplete: true,
        autoCompleteDelay: 250,
        keepResult: true,
        position: "topright", // Set position of the control
      });

      // Add the search control to the map
      map.addControl(searchControl);

      // Function to handle location selection from search
      const handleLocationSelect = (event) => {
        const { y: lat, x: lng } = event.location; // Get latitude and longitude from result
        setNewStoppage((prev) => ({
          ...prev,
          latitude: lat,
          longitude: lng,
        }));
        map.setView([lat, lng], 13); // Center the map on the selected location
      };

      // Listen for 'geosearch:select' event
      map.on("geosearch:select", handleLocationSelect);

      // Cleanup control on unmount
      return () => {
        map.removeControl(searchControl);
        map.off("geosearch:select", handleLocationSelect); // Remove event listener on unmount
      };
    }, [map, setNewStoppage]);

    return null;
  };

  const handleAddRound = () => {
    if (!newRound.shift || !newRound.round) return;

    const updatedRounds = { ...selectedStop.rounds };
    if (!updatedRounds[newRound.shift]) updatedRounds[newRound.shift] = [];

    // Ensure the round number is unique
    if (updatedRounds[newRound.shift].some((r) => r.round === newRound.round)) {
      alert("Round number already exists!");
      return;
    }

    updatedRounds[newRound.shift].push({ ...newRound });

    // Update local state
    const updatedStop = { ...selectedStop, rounds: updatedRounds };
    setSelectedStop(updatedStop);
  
    // Immediately update backend
    handleUpdateStoppage(selectedStop.id, { rounds: updatedRounds });
  
    // Close the modal
    setRoundsModalOpen(false);
  };

  const handleDeleteRound = () => {
    if (selectedRound === null || selectedRound === undefined || !selectedStop) return;
    const roundsObject = {...selectedStop.rounds}
    const shift = selectedStop.stopType
    const roundArray = roundsObject[shift] || [];
    const updatedRounds = roundArray.filter((_, idx) => idx !== selectedRound);
    handleUpdateStoppage(selectedStop.id, {...selectedStop, rounds: {...roundsObject, [shift]: [...updatedRounds]}});
    setRoundsModalOpen(false);
  };

  return (
    <div className="mx-auto mt-4 max-w-full rounded-lg bg-gradient-to-r from-gray-100 to-gray-200 p-6 shadow-2xl">
      <h2 className="mb-6 text-3xl font-semibold text-gray-800">
        Manage Stoppages
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
        className="mt-2 mb-4 w-full max-w-xs"
        onClick={() => setOpenModal(true)}
      >
        Add New Stoppage
      </Button>
<div style={{ marginTop: 12, display: "flex", gap: 8 }}>
  <Button
    variant="outlined"
    onClick={() => {
      setShowAll(prev => !prev);
      setCurrentPage(1); // reset to page 1 when toggling
    }}
  >
    {showAll ? "Show by pages" : "Show all stoppages"}
  </Button>
</div>

      <Dialog
        open={openModal}
        onClose={() => setOpenModal(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Add New Stoppage</DialogTitle>
        <DialogContent>
          <div className="grid grid-cols-2 gap-4 p-2">
            <TextField
              label="Stop Name"
              name="stopName"
              value={newStoppage.stopName}
              onChange={handleInputChange}
              required
              fullWidth
            />
            <TextField
              label="Stop Order"
              type="number"
              name="stopOrder"
              value={newStoppage.stopOrder}
              onChange={handleInputChange}
              required
              fullWidth
            />
            {/* Stop Type Dropdown */}
            <FormControl fullWidth required>
              <InputLabel>Stop Type</InputLabel>
              <Select
                label="Stop Type"
                name="stopType"
                value={newStoppage.stopType}
                onChange={handleInputChange}
              >
                <MenuItem value="">Stop Type</MenuItem>
                <MenuItem value="morning">Morning</MenuItem>
                <MenuItem value="afternoon">Afternoon</MenuItem>
                <MenuItem value="evening">Evening</MenuItem>
              </Select>
            </FormControl>

            {/* Number of Rounds (only shown if stopType is selected) */}
            {/* {newStoppage.stopType && (
              <TextField
                label={`Number of ${newStoppage.stopType.charAt(0).toUpperCase() + newStoppage.stopType.slice(1)} Rounds`}
                type="number"
                value={newStoppage.rounds[newStoppage.stopType]?.length || ""}
                onChange={(e) => handleRoundChange(newStoppage.stopType, e.target.value)}
                fullWidth
              />
            )} */}

            {/* Allow user to enter specific round numbers */}
            {newStoppage.stopType && (
              <TextField
                label={`Specify Rounds for ${newStoppage.stopType} (e.g., 2,3)`}
                type="text"
                value={roundInput}
                onChange={(e) =>
                  handleRoundChange(newStoppage.stopType, e.target.value)
                }
                fullWidth
              />
            )}

            {/* Time Inputs for Each Round */}
            {/* {newStoppage.stopType &&
              newStoppage.rounds[newStoppage.stopType].map((round, index) => (
                <div key={`${newStoppage.stopType}-${index}`} className="flex gap-2">
                  <TextField
                    label={`${newStoppage.stopType.charAt(0).toUpperCase() + newStoppage.stopType.slice(1)} Round ${round.round} Arrival Time`}
                    type="time"
                    value={round.arrivalTime}
                    onChange={(e) =>
                      handleTimeChange(newStoppage.stopType, index, "arrivalTime", e.target.value)
                    }
                    fullWidth
                  />

                </div>
              ))} */}

            {/* <TextField
                    label={`${newStoppage.stopType.charAt(0).toUpperCase() + newStoppage.stopType.slice(1)} Round ${round.round} Departure Time`}
                    type="time"
                    value={round.departureTime}
                    onChange={(e) =>
                      handleTimeChange(newStoppage.stopType, index, "departureTime", e.target.value)
                    }
                    fullWidth
                  /> */}

            {newStoppage.stopType &&
              newStoppage.rounds[newStoppage.stopType].map((round, index) => (
                <div
                  key={`${newStoppage.stopType}-${round.round}`}
                  className="flex gap-2"
                >
                  <TextField
                    label={`${
                      newStoppage.stopType.charAt(0).toUpperCase() +
                      newStoppage.stopType.slice(1)
                    } Round ${round.round} Arrival Time`}
                    type="time"
                    value={round.arrivalTime}
                    onChange={(e) =>
                      handleTimeChange(
                        newStoppage.stopType,
                        index,
                        "arrivalTime",
                        e.target.value
                      )
                    }
                    fullWidth
                  />
                </div>
              ))}

            <TextField
              label="Estimated Duration"
              name="estimatedStopDuration"
              type="number"
              value={newStoppage.estimatedStopDuration}
              onChange={handleInputChange}
              fullWidth
            />

            {/* Route Selection Dropdown */}
            <FormControl fullWidth className="col-span-2" required>
              <InputLabel>Select Route</InputLabel>
              <Select
                label="Select Route"
                name="routeId"
                value={newStoppage.routeId}
                onChange={handleInputChange}
              >
                <MenuItem value="">Select Route</MenuItem>
                {routes.map((route) => (
                  <MenuItem key={route.id} value={route.id}>
                    {route.routeName}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            {/* {newStoppage.stopType === "morning" && (
              <>
                <TextField
                label="Arrival Time"
                type="time"
                name="arrivalTime"
                value={newStoppage.arrivalTime}
                onChange={handleInputChange}
                fullWidth
              />
              <TextField
                label="Departure Time"
                type="time"
                name="departureTime"
                value={newStoppage.departureTime}
                onChange={handleInputChange}
                fullWidth
              />
              </>
            )}
            {newStoppage.stopType === "afternoon" && (
              <>
                <TextField
                  label="Afternoon Arrival Time"
                  type="time"
                  name="afternoonarrivalTime"
                  value={newStoppage.afternoonarrivalTime}
                  onChange={handleInputChange}
                  fullWidth
                />
                <TextField
                  label="Afternoon Departure Time"
                  type="time"
                  name="afternoondepartureTime"
                  value={newStoppage.afternoondepartureTime}
                  onChange={handleInputChange}
                  fullWidth
                />
              </>
            )}
            {newStoppage.stopType === "evening" && (
              <>
              <TextField
                label="Evening Arrival Time"
                type="time"
                name="eveningarrivalTime"
                value={newStoppage.eveningarrivalTime}
                onChange={handleInputChange}
                fullWidth
              />
              <TextField
                label="Evening Departure Time"
                type="time"
                name="eveningdepartureTime"
                value={newStoppage.eveningdepartureTime}
                onChange={handleInputChange}
                fullWidth
              />
              </>
            )} */}
            <TextField
              label="Passenger Count"
              type="number"
              name="passengerCount"
              value={newStoppage.passengerCount}
              onChange={handleInputChange}
              fullWidth
            />
            {/* <TextField
              label="Comments"
              name="comments"
              value={newStoppage.comments}
              onChange={handleInputChange}
              multiline
              rows={2}
              fullWidth
            /> */}

            {/* Accessibility Dropdown */}
            <FormControl fullWidth>
              <InputLabel>Is Accessible</InputLabel>
              <Select
                name="isAccessible"
                value={newStoppage.isAccessible}
                onChange={handleInputChange}
              >
                <MenuItem value="yes">Yes</MenuItem>
                <MenuItem value="no">No</MenuItem>
              </Select>
            </FormControl>

            {/* <TextField
              label="Landmark"
              name="landmark"
              value={newStoppage.landmark}
              onChange={handleInputChange}
              fullWidth
            /> */}

            {/* Map for Geolocation */}
            <MapContainer
              center={[20.5937, 78.9629]} // Center of India as default
              zoom={5}
              style={{ height: "400px", width: "100%" }}
              scrollWheelZoom={false}
              className="col-span-2"
              attributionControl={false}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              />
              <MapEvents setNewStoppage={setNewStoppage} />
              {newStoppage.latitude && newStoppage.longitude && (
                <Marker
                  position={[newStoppage.latitude, newStoppage.longitude]}
                  icon={L.icon({
                    iconUrl:
                      "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
                    iconSize: [25, 41],
                  })}
                />
              )}
            </MapContainer>
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenModal(false)} color="secondary">
            Cancel
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handleAddStoppage}
          >
            Add Stoppage
          </Button>
        </DialogActions>
      </Dialog>
      <div
        style={{
          minHeight: "600px",
          height: "auto",
          width: "100%",
          marginTop: "16px",
        }}
      >
        {/* <DataGrid
          rows={stoppages}
          columns={columns}
          pageSize={5}
          checkboxSelection
          onRowEditCommit={(params) => handleUpdateStoppage(params.id, params)}
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
          dataSource={dataForGrid}
          keyExpr="id"
          showBorders={true}
          rowAlternationEnabled={true}
          allowColumnResizing={true}
          onRowUpdating={(e) => handleUpdateStoppage(e.oldData.id, e.newData)}
          onRowRemoving={(e) => handleDeleteStoppage(e.data.id)}
          scrolling={{ mode: "virtual", useNative: true }}
        >
          <Editing
            mode="cell"
            allowUpdating={true}
            allowDeleting={true}
            useIcons={true}
          />
          <SearchPanel visible={true} highlightCaseSensitive={true} />
          <Paging enabled={!showAll} defaultPageSize={10} />
          {!showAll && <Pager showPageSizeSelector={false} showInfo={true} />}

          {/* Columns */}
          <Column
            dataField="stopName"
            caption="Stop Name"
            minWidth={150}
            cellRender={(cellData) => {
              const stopName = cellData.value;
              return (
                <span
                  className={`px-2 py-1 text-gray-800 font-semibold rounded-lg bg-gray-500`}
                >
                  {stopName}
                </span>
              );
            }}
          />

          <Column
            dataField="instituteName"
            caption="Institute Name"
            allowEditing={false}
            minWidth={150}
          />

          <Column dataField="latitude" caption="Latitude" minWidth={150} />

          <Column dataField="longitude" caption="Longitude" minWidth={150} />

          <Column
            dataField="stopOrder"
            caption="Stop Order"
            dataType="number"
            minWidth={150}
          />

          {/* <Column
        dataField="stopType"
        caption="Stop Type"
        lookup={{
          dataSource: ["morning", "afternoon", "evening"],
          valueExpr: "this",
          displayExpr: "this",
        }}
      minWidth={150}/> */}

          <Column
            dataField="stopType"
            caption="Stop Type"
            allowEditing={false}
            minWidth={150}
            cellRender={(cellData) => {
              const stopType = cellData.value;
              return (
                <span
                  className={`px-2 py-1 text-white font-semibold rounded-lg ${
                    stopType === "morning"
                      ? "bg-blue-500"
                      : stopType === "afternoon"
                      ? "bg-yellow-500"
                      : "bg-purple-500"
                  }`}
                >
                  {stopType}
                </span>
              );
            }}
          />

          <Column
            dataField="estimatedStopDuration"
            caption="Duration"
            dataType="number"
            minWidth={100}
          />

          <Column
            dataField="routeId"
            caption="Route"
            editorType="dxSelectBox"
            lookup={{
              dataSource: routes,
              valueExpr: "id",
              displayExpr: "routeName",
            }}
            minWidth={250}
          />

          {/* <Column  
        dataField="rounds" 
        caption="Rounds" 
        allowEditing={true}
        minWidth={250}
        cellRender={(cellData) => {
          const { morning = [], afternoon = [], evening = [] } = cellData.value || {};
          return (
            <div className="grid grid-cols-1 gap-3 text-sm">
              {morning.map((round, index) => (
                <div 
                  key={`morning-${index}`} 
                  className="flex items-center justify-between p-2 bg-blue-50 border border-blue-200 rounded-lg shadow-sm hover:shadow-md transition duration-200"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-blue-500 font-semibold">
                      <i className="fas fa-sun"></i> Morning Round {round.round}:
                    </span>
                  </div>
                  <span className="text-gray-700">
                    {round.arrivalTime || "N/A"}
                  </span>
                </div>
              ))}
          
              {afternoon.map((round, index) => (
                <div 
                  key={`afternoon-${index}`} 
                  className="flex items-center justify-between p-2 bg-yellow-50 border border-yellow-200 rounded-lg shadow-sm hover:shadow-md transition duration-200"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-yellow-500 font-semibold">
                      <i className="fas fa-cloud-sun"></i> Afternoon Round {round.round}:
                    </span>
                  </div>
                  <span className="text-gray-700">
                    {round.arrivalTime || "N/A"}
                  </span>
                </div>
              ))}
          
              {evening.map((round, index) => (
                <div 
                  key={`evening-${index}`} 
                  className="flex items-center justify-between p-2 bg-purple-50 border border-purple-200 rounded-lg shadow-sm hover:shadow-md transition duration-200"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-purple-500 font-semibold">
                      <i className="fas fa-moon"></i> Evening Round {round.round}:
                    </span>
                  </div>
                  <span className="text-gray-700">
                    {round.arrivalTime || "N/A"}
                  </span>
                </div>
              ))}
            </div>
          );          
        }}
        editCellRender={({ data, setValue }) => {
          const handleRoundChange = (shift, index, field, value) => {
            const newRounds = { ...data.rounds };
            if (!newRounds[shift][index]) {
              newRounds[shift][index] = {};
            }
            newRounds[shift][index][field] = value;
            setValue(newRounds);
          };

          return (
            <div className="space-y-4">
              <div>
                <h3 className="text-blue-500 font-semibold mb-2">
                  <i className="fas fa-sun mr-2"></i>Morning Rounds
                </h3>
                <div className="space-y-2">
                  {data.rounds?.morning?.map((round, index) => (
                    <div 
                      key={`edit-morning-${index}`} 
                      className="flex items-center gap-3 bg-blue-50 border border-blue-200 rounded-lg p-2 shadow-sm hover:shadow-md transition"
                    >
                      <span className="text-sm font-medium text-blue-600">Round {round.round}:</span>
                      <input
                        type="time"
                        value={round.arrivalTime || ""}
                        onChange={(e) =>
                          handleRoundChange("morning", index, "arrivalTime", e.target.value)
                        }
                        className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white text-gray-700"
                      />
                    </div>
                  ))}
                </div>
              </div>
          
              <div>
                <h3 className="text-yellow-500 font-semibold mb-2">
                  <i className="fas fa-cloud-sun mr-2"></i>Afternoon Rounds
                </h3>
                <div className="space-y-2">
                  {data.rounds?.afternoon?.map((round, index) => (
                    <div 
                      key={`edit-afternoon-${index}`} 
                      className="flex items-center gap-3 bg-yellow-50 border border-yellow-200 rounded-lg p-2 shadow-sm hover:shadow-md transition"
                    >
                      <span className="text-sm font-medium text-yellow-600">Round {round.round}:</span>
                      <input
                        type="time"
                        value={round.arrivalTime || ""}
                        onChange={(e) =>
                          handleRoundChange("afternoon", index, "arrivalTime", e.target.value)
                        }
                        className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400 bg-white text-gray-700"
                      />
                    </div>
                  ))}
                </div>
              </div>
          
              <div>
                <h3 className="text-purple-500 font-semibold mb-2">
                  <i className="fas fa-moon mr-2"></i>Evening Rounds
                </h3>
                <div className="space-y-2">
                  {data.rounds?.evening?.map((round, index) => (
                    <div 
                      key={`edit-evening-${index}`} 
                      className="flex items-center gap-3 bg-purple-50 border border-purple-200 rounded-lg p-2 shadow-sm hover:shadow-md transition"
                    >
                      <span className="text-sm font-medium text-purple-600">Round {round.round}:</span>
                      <input
                        type="time"
                        value={round.arrivalTime || ""}
                        onChange={(e) =>
                          handleRoundChange("evening", index, "arrivalTime", e.target.value)
                        }
                        className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-400 bg-white text-gray-700"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );          
        }}
      /> */}

          {/* <Column
        dataField="arrivalTime"
        caption="Arrival Time (Round 1)"
        dataType="date"
        editorType="dxDateBox"
        editorOptions={{
          type: 'time',
          pickerType: "native",
          useMaskBehavior: true,
          displayFormat: 'HH:mm',
        }}
        format="HH:mm"
        minWidth={150}
      /> */}

          {/* <Column
        dataField="departureTime"
        caption="Departure Time"
        dataType="date"
        editorType="dxDateBox"
        editorOptions={{
          type: 'time',
          pickerType: "native",
          useMaskBehavior: true,
          displayFormat: 'HH:mm',
        }}
        format="HH:mm"
      minWidth={150}/> */}

          {/* <Column
        dataField="afternoonarrivalTime"
        caption="Afternoon Arrival Time (Round 1)"
        dataType="date"
        editorType="dxDateBox"
        editorOptions={{
          type: 'time',
          pickerType: "native",
          useMaskBehavior: true,
          displayFormat: 'HH:mm',
        }}
        format="HH:mm"
      minWidth={150}/> */}

          {/* <Column
        dataField="afternoondepartureTime"
        caption="Afternoon Departure Time"
        dataType="date"
        editorType="dxDateBox"
        editorOptions={{
          type: 'time',
          pickerType: "native",
          useMaskBehavior: true,
          displayFormat: 'HH:mm',
        }}
        format="HH:mm"
      minWidth={150}/> */}

          {/* <Column
        dataField="eveningarrivalTime"
        caption="Evening Arrival Time (Round 1)"
        dataType="date"
        editorType="dxDateBox"
        editorOptions={{
          type: 'time',
          pickerType: "native",
          useMaskBehavior: true,
          displayFormat: 'HH:mm',
        }}
        format="HH:mm"
      minWidth={150}/> */}

          {/* <Column
        dataField="eveningdepartureTime"
        caption="Evening Departure Time"
        dataType="date"
        editorType="dxDateBox"
        editorOptions={{
          type: 'time',
          pickerType: "native",
          useMaskBehavior: true,
          displayFormat: 'HH:mm',
        }}
        format="HH:mm"
      minWidth={150}/> */}

          <Column
            dataField="rounds"
            caption="Rounds"
            allowEditing={true}
            minWidth={250}
            cellRender={(cellData) => {
              const {
                morning = [],
                afternoon = [],
                evening = [],
              } = cellData.value || {};
              return (
                <div className="grid grid-cols-1 gap-3 text-sm">
                  {/* Morning Rounds */}
                  {morning.map((round, index) => (
                    <div
                      key={`morning-${index}`}
                      className="flex items-center justify-between p-2 bg-blue-50 border border-blue-200 rounded-lg shadow-sm hover:shadow-md transition duration-200"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-blue-500 font-semibold">
                          <i className="fas fa-sun"></i> Morning Round{" "}
                          {round.round}:
                        </span>
                      </div>
                      <span className="text-gray-700">
                        {round.arrivalTime || "N/A"}
                      </span>
                    </div>
                  ))}

                  {/* Afternoon Rounds */}
                  {afternoon.map((round, index) => (
                    <div
                      key={`afternoon-${index}`}
                      className="flex items-center justify-between p-2 bg-yellow-50 border border-yellow-200 rounded-lg shadow-sm hover:shadow-md transition duration-200"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-yellow-500 font-semibold">
                          <i className="fas fa-cloud-sun"></i> Afternoon Round{" "}
                          {round.round}:
                        </span>
                      </div>
                      <span className="text-gray-700">
                        {round.arrivalTime || "N/A"}
                      </span>
                    </div>
                  ))}

                  {/* Evening Rounds */}
                  {evening.map((round, index) => (
                    <div
                      key={`evening-${index}`}
                      className="flex items-center justify-between p-2 bg-purple-50 border border-purple-200 rounded-lg shadow-sm hover:shadow-md transition duration-200"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-purple-500 font-semibold">
                          <i className="fas fa-moon"></i> Evening Round{" "}
                          {round.round}:
                        </span>
                      </div>
                      <span className="text-gray-700">
                        {round.arrivalTime || "N/A"}
                      </span>
                    </div>
                  ))}
                </div>
              );
            }}
            editCellRender={({ data, setValue }) => {
              const handleRoundChange = (shift, index, field, value) => {
                const newRounds = { ...data.rounds };
                if (!newRounds[shift][index]) {
                  newRounds[shift][index] = {};
                }
                newRounds[shift][index][field] = value;
                setValue(newRounds);
              };

              // const handleAddRound = (shift) => {
              //   const newRounds = { ...data.rounds };
              //   const newRoundNumber = (newRounds[shift]?.length || 0) + 1;
              //   newRounds[shift] = [
              //     ...(newRounds[shift] || []),
              //     { round: newRoundNumber, arrivalTime: "", departureTime: "" }
              //   ];
              //   setValue(newRounds);
              // };

              // // ✅ Function to Delete a Specific Round
              // const handleDeleteRound = (shift, index) => {
              //   const newRounds = { ...data.rounds };
              //   newRounds[shift] = newRounds[shift].filter((_, i) => i !== index); // Remove selected round
              //   setValue(newRounds);
              // };

              // ✅ Function to Render Round Inputs with Delete Button
              const renderRoundInputs = (shift, color, icon) => (
                <div>
                  <h3 className={`text-${color}-500 font-semibold mb-2`}>
                    <i className={`fas ${icon} mr-2`}></i>
                    {shift.charAt(0).toUpperCase() + shift.slice(1)} Rounds
                  </h3>
                  <div className="space-y-2">
                    {data.rounds?.[shift]?.map((round, index) => (
                      <div
                        key={`edit-${shift}-${index}`}
                        className={`flex items-center gap-3 bg-${color}-50 border border-${color}-200 rounded-lg p-2 shadow-sm hover:shadow-md transition`}
                      >
                        <span
                          className={`text-sm font-medium text-${color}-600`}
                        >
                          Round {round.round}:
                        </span>
                        <input
                          type="time"
                          value={round.arrivalTime || ""}
                          onChange={(e) =>
                            handleRoundChange(
                              shift,
                              index,
                              "arrivalTime",
                              e.target.value
                            )
                          }
                          className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white text-gray-700"
                        />
                        {/* 🗑️ Delete Button */}
                        <button
                          onClick={() => {
                            setSelectedStop(data);
                            setRoundDeleteModalOpen(true);
                            setSelectedRound(index)
                            // handleDeleteRound(shift, index)
                          }}
                          className="px-2 py-1 text-xs text-white bg-red-500 rounded-md hover:bg-red-600 transition"
                        >
                          Delete
                        </button>
                      </div>
                    ))}
                    {/* ➕ Add Round Button */}
                    {/* <button
                  onClick={() => handleAddRound(shift)}
                  className={`mt-2 px-3 py-1 text-sm font-medium bg-${color}-500 text-white rounded-md hover:bg-${color}-600 transition`}
                >
                  + Add Round
                </button> */}
                  </div>
                </div>
              );

              return (
                <div className="space-y-4">
                  {/* Morning */}
                  {data.stopType === "morning" &&
                    renderRoundInputs("morning", "blue", "fa-sun")}

                  {/* Afternoon */}
                  {data.stopType === "afternoon" &&
                    renderRoundInputs("afternoon", "yellow", "fa-cloud-sun")}

                  {/* Evening */}
                  {data.stopType === "evening" &&
                    renderRoundInputs("evening", "purple", "fa-moon")}
                  <button
                    onClick={() => {
                      setSelectedStop(data);
                      setRoundsModalOpen(true);
                    }}
                    className="px-3 py-1 text-white bg-blue-500 rounded hover:bg-blue-600 transition"
                  >
                    + Add Rounds
                  </button>
                </div>
              );
            }}
          />

          <Column
            dataField="passengerCount"
            caption="Passenger"
            dataType="number"
            minWidth={100}
          />

          {/* <Column dataField="comments" caption="Comments" minWidth={150}/> */}

          <Column
            dataField="isAccessible"
            caption="Accessible"
            lookup={{
              dataSource: ["yes", "no"],
              valueExpr: "this",
              displayExpr: "this",
            }}
            minWidth={150}
          />

          {/* <Column dataField="landmark" caption="Landmark" minWidth={150}/> */}

          <Column
            type="buttons"
            buttons={[
              "edit",
              "delete",
              {
                hint: "Save Changes",
                icon: "save",
                onClick: (e) => handleUpdateStoppage(e.row.data.id, e.row.data),
              },
            ]}
          />
        </DataGrid>
        {!showAll && (
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            margin: "10px 0",
          }}
        >
          <Button
            variant="contained"
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
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
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
          >
            Next
          </Button>
        </div>
        )}
        {!showAll && (
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "center",
              margin: "0 10px",
            }}
          >
            {Array.from({ length: totalPages }, (_, index) => index + 1).map(
              (pageNumber) => (
                <Button
                  key={pageNumber}
                  onClick={() => setCurrentPage(pageNumber)}
                  variant={
                    currentPage === pageNumber ? "contained" : "outlined"
                  }
                  style={{ margin: "0 5px" }}
                >
                  {pageNumber}
                </Button>
              )
            )}
          </div>
        </div>
      </div>
        )}
      <Dialog
        open={roundsModalOpen}
        onClose={() => setRoundsModalOpen(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Manage Rounds</DialogTitle>
        <DialogContent>
          {selectedStop && (
            <FormControl fullWidth margin="dense">
              <InputLabel>Shift</InputLabel>
              <Select value={selectedStop.stopType} disabled>
                <MenuItem value="morning">Morning</MenuItem>
                <MenuItem value="afternoon">Afternoon</MenuItem>
                <MenuItem value="evening">Evening</MenuItem>
              </Select>
            </FormControl>
          )}

          <TextField
            label="Round Number"
            type="number"
            fullWidth
            margin="dense"
            value={newRound.round}
            onChange={(e) =>
              setNewRound({ ...newRound, round: parseInt(e.target.value, 10) })
            }
          />

          <TextField
            label="Arrival Time"
            type="time"
            fullWidth
            margin="dense"
            value={newRound.arrivalTime}
            onChange={(e) =>
              setNewRound({ ...newRound, arrivalTime: e.target.value })
            }
          />

          {/* <TextField
            label="Departure Time"
            type="time"
            fullWidth
            margin="dense"
            value={newRound.departureTime}
            onChange={(e) =>
              setNewRound({ ...newRound, departureTime: e.target.value })
            }
          /> */}
        </DialogContent>

        <DialogActions>
        <Button
          onClick={() => {
            setNewRound((prevRound) => {
              const updatedRound = { ...prevRound, shift: selectedStop.stopType };
              handleAddRound(updatedRound);
              return updatedRound;
            });
          }}
          color="primary"
        >
          Add Round
        </Button>


          {/* <Button onClick={handleUpdateRound} color="secondary">Update Round</Button>
    <Button onClick={handleDeleteRound} color="error">Delete Round</Button> */}
          <Button onClick={() => setRoundsModalOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
      <Modal
        open={roundDeleteModalOpen}
        onClose={() => setRoundDeleteModalOpen(false)}
        fullWidth
        maxWidth="sm"
      >
        <Box className="bg-white p-6 rounded-lg shadow-lg w-96 mx-auto mt-20 text-center">
          <Typography variant="h6" className="mb-4 font-semibold text-gray-800">
            Confirm Round Deletion
          </Typography>
          {selectedStop && 
          <Typography variant="body1" className="text-gray-600 mb-6">
            Are you sure you want to delete Round {selectedStop.round} from the{" "}
            {selectedStop.stopType} shift?
          </Typography> }

          <div className="flex justify-center gap-4">
            {/* Cancel Button */}
            <Button
              onClick={() => setRoundDeleteModalOpen(false)}
              variant="outlined"
              color="secondary"
            >
              Cancel
            </Button>

            {/*Confirm Delete Button */}
            <Button
              onClick={() => {
                handleDeleteRound();
                setRoundDeleteModalOpen(false);
              }}
              variant="contained"
              color="error"
            >
              Delete
            </Button>
          </div>
        </Box>
      </Modal>
    </div>
  );
};

export default ManageStoppage;
