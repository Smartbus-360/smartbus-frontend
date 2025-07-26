import React, { useState, useEffect } from "react";
import axios from "axios";
import { 
  Button,
  TextField,
  Snackbar,
  Alert,
  IconButton,
  FormControl, InputLabel
} from "@mui/material";
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
import { Save as SaveIcon, Delete as DeleteIcon } from "@mui/icons-material";
import axiosInstance from "../../../api/axios";
import { getUser } from "../../../config/authService";

const Advertisements = () => {
  const [ads, setAds] = useState([]);
  const [newAd, setNewAd] = useState({
    title: "",
    description: "",
    image: null,
    link: "",
    startDate: "",
    endDate: "",
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const user = getUser();
  useEffect(() => {
    fetchAdvertisements();
  }, []);

  const fetchAdvertisements = async () => {
    try {
      const response = await axiosInstance.get("ads");
      const formattedAds = response.data.map((ad) => ({
        ...ad,
        id: Number(ad.id),
      }));
      setAds(formattedAds);
    } catch (error) {
      console.error("Error fetching advertisements:", error);
      showSnackbar("Error fetching advertisements");
    }
  };
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewAd({ ...newAd, [name]: value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setNewAd({ ...newAd, image: file });
    setImagePreview(URL.createObjectURL(file)); // Show preview
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    const role = user?.role || "";
    if (role === "viewer") {
      setSnackbar({
        open: true,
        message: "You do not have the necessary permissions to perform this action",
        severity: "error",
      });
      return;
    }

    const formData = new FormData();
    Object.keys(newAd).forEach((key) => {
      formData.append(key, newAd[key]);
    });

    try {
      await axiosInstance.post("ads", formData);
      fetchAdvertisements();
      setNewAd({ title: "", description: "", image: null, link: "", startDate: "", endDate: "" });
      setImagePreview(null);
      showSnackbar("Advertisement added successfully");
    } catch (error) {
      console.error("Error adding advertisement:", error);
      showSnackbar("Error adding advertisement");
    }
  };

  const handleUpdateAdvertisement = async (adId, updatedAd) => {
    const role = user?.role || "";
    if (role === "viewer") {
      setSnackbar({
        open: true,
        message: "You do not have the necessary permissions to perform this action",
        severity: "error",
      });
      return;
    }
    const formData = new FormData();
    Object.keys(updatedAd).forEach((key) => {
      formData.append(key, updatedAd[key]);
    });

    try {
      await axiosInstance.put(`ads/${adId}`, formData);
      fetchAdvertisements();
      showSnackbar("Advertisement updated successfully");
    } catch (error) {
      console.error("Error updating advertisement:", error);
      showSnackbar("Error updating advertisement");
    }
  };

  const handleDeleteAdvertisement = async (ad) => {
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
      const response = await axiosInstance.delete(`ads/${ad}`);
      const deletedId = Number(response.data.id);
      fetchAdvertisements();
      showSnackbar("Advertisement deleted successfully");
    } catch (error) {
      console.error("Error deleting advertisement:", error);
      showSnackbar("Error deleting advertisement");
    }
  };
  

  const showSnackbar = (message) => {
    setSnackbarMessage(message);
    setSnackbarOpen(true);
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  return (
    <div className="p-6 mt-4 bg-gradient-to-r from-gray-100 to-gray-200 rounded-lg shadow-lg max-w-full mx-auto">
      <h2 className="mb-6 text-3xl font-semibold text-gray-800">Manage Advertisements</h2>

      <Snackbar open={snackbarOpen} autoHideDuration={4000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity="info">
          {snackbarMessage}
        </Alert>
      </Snackbar>

      <div className="mb-6">
        <h3 className="text-xl mb-4">Add New Advertisement</h3>
        <form onSubmit={handleFormSubmit}>
          <div className="grid grid-cols-2 gap-4 p-2">
            <TextField
              label="Title"
              name="title"
              value={newAd.title}
              onChange={handleInputChange}
              required
              fullWidth
            />
            <TextField
              label="URL"
              name="link"
              value={newAd.link}
              onChange={handleInputChange}
              fullWidth
            />
            <TextField
              label="Start Date"
              type="date"
              name="startDate"
              value={newAd.startDate}
              onChange={handleInputChange}
              InputLabelProps={{ shrink: true }}
              fullWidth
            />
            <TextField
              label="End Date"
              type="date"
              name="endDate"
              value={newAd.endDate}
              onChange={handleInputChange}
              InputLabelProps={{ shrink: true }}
              fullWidth
            />
            <TextField
              placeholder="Description"
              name="description"
              value={newAd.description}
              onChange={handleInputChange}
              required
              multiline
              rows={4}
            />
            <FormControl fullWidth className="col-span-2">
            <InputLabel shrink>Upload Background</InputLabel>
            <input
              accept="image/*"
              type="file"
              onChange={handleImageChange}
              style={{ display: "block", marginTop: "8px" }}
            />
            {imagePreview && (
              <img
                src={imagePreview}
                alt="Logo"
                style={{
                  width: "100px",
                  height: "100px",
                  marginTop: "8px",
                  borderRadius: "4px",
                }}
              />
            )}
            </FormControl>
            {/* <input
              type="file"
              name="image"
              onChange={handleImageChange}
              accept="image/*"
              required
            />
            {imagePreview && (
              <img
                src={imagePreview}
                alt="preview"
                style={{ width: 100, height: 100, marginTop: 10 }}
              />
            )} */}
            <Button type="submit" variant="contained" color="primary" fullWidth>
              Add Advertisement
            </Button>
          </div>
        </form>
      </div>
      <h3 className="text-xl mb-4">Manage Advertisements</h3>
      <div style={{ minHeight: "600px", height: "auto", width: "100%", marginTop: "16px" }}>
        <DataGrid
          dataSource={ads}
          keyExpr="id"
          showBorders={true}
          onRowUpdating={(e) => handleUpdateAdvertisement(e.oldData.id, e.newData)}
          onRowRemoving={(e) => handleDeleteAdvertisement(e.data.id)}
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
          <Paging defaultPageSize={5} />
          <Pager showPageSizeSelector={false} showInfo={true} />

          <Column dataField="title" caption="Title" minWidth={150}/>
          <Column dataField="description" caption="Description" minWidth={250} />
          <Column
            dataField="imageUrl"
            caption="Image"
            cellRender={(cellData) =>
              cellData.value ? (
                <img
                  src={cellData.value}
                  alt="Image"
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
          <Column dataField="link" caption="Link" minWidth={150}/>
          <Column dataField="startDate" caption="Start date" dataType="date" minWidth={150}/>
          <Column dataField="endDate" caption="End Date" dataType="date" minWidth={150}/>

          {/* Command Column for Save/Delete */}
          <Column
            type="buttons"
            buttons={[
              "edit",
              "delete",
              {
                hint: "Save Changes",
                icon: "save",
                onClick: (e) => handleUpdateAdvertisement(e.row.data.id, e.row.data),
              },
            ]}
            minWidth={150}/>
        </DataGrid>
      </div>
    </div>
  );
};

export default Advertisements;
