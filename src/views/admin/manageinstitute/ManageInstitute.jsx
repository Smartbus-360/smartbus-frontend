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
  Switch,
  Alert,
  IconButton,
  InputAdornment,
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
import SchoolIcon from "@mui/icons-material/School";
import axiosInstance from "../../../api/axios";

const convertUrlToFile = async (url, fileName = "logo.png") => {
  const response = await fetch(url);
  const blob = await response.blob();
  const file = new File([blob], fileName, { type: blob.type });
  return file;
};

const ManageInstitute = () => {
  const [institutes, setInstitutes] = useState([]);
  const [instituteData, setInstituteData] = useState({
    id: null,
    name: "",
    instituteCode:"",
    logo: "",
    contactNumber: "",
    email: "",
    website: "",
    establishedYear: "",
    affiliation: "",
    principalName: "",
    totalStudents: "",
    totalStaff: "",
    latitude: "",
    faxNumber: "",
    institutionBody: "",
    numberOfBranches: "",
    socialMediaLinks: "",
    location: "",
    city: "",
    postalCode: "",
    institutionType: "",
    description: "",
    ownershipType: "",
    status: "active",
  });
  const [openModal, setOpenModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  // const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const handleSnackbarClose = () => setSnackbar({ ...snackbar, open: false });
  // const handleCloseSnackbar = () => {
  //   setSnackbarOpen(false);
  //   setError("");
  //   setSuccessMessage("");
  // };
  const [editedInstitutes, setEditedInstitutes] = useState({});
  const [logoPreview, setLogoPreview] = useState(null);
  const asBool = (v) => v === true || v === 1 || v === "1";
  const token = sessionStorage.getItem("authToken");
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [confirmUpdateOpen, setConfirmUpdateOpen] = useState(false);
const [pendingUpdate, setPendingUpdate] = useState(null);
  useEffect(() => {
    const fetchInstitutes = async () => {
      try {
        const response = await axiosInstance.get(
          "institutes"
        );
setInstitutes(Array.isArray(response.data) ? response.data : (response.data?.institutes ?? []));
      } catch (error) {
        console.error("Error fetching institutes:", error);
        setSnackbar({
          open: true,
          message: "Failed to load data.",
          severity: "error",
        });
        // setSnackbarOpen(true);
      }
    };

    fetchInstitutes();
  }, []);

  const paginatedInstitutes = institutes.slice(
    currentPage * pageSize,
    currentPage * pageSize + pageSize
  );

  const handleInstituteInputChange = (e) => {
    const { name, value } = e.target;
    setInstituteData({
      ...instituteData,
      [name]: value,
    });
  };

  // console.log(token)

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setInstituteData((prev) => ({ ...prev, logo: file }));
      setLogoPreview(URL.createObjectURL(file));
    }
  };
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccessMessage("");
  
    const formData = new FormData();
    Object.entries(instituteData).forEach(([key, value]) => {
      formData.append(key, value);
    });
  
    try {
      await axiosInstance.post(
        "institutes",
        formData
      );
  
      setSuccessMessage("Institute added successfully!");
      setInstituteData({
        id: null,
        name: "",
        logo: "",
        contactNumber: "",
        email: "",
        website: "",
        establishedYear: "",
        affiliation: "",
        principalName: "",
        totalStudents: "",
        totalStaff: "",
        latitude: "",
        faxNumber: "",
        institutionBody: "",
        numberOfBranches: "",
        socialMediaLinks: "",
        location: "",
        city: "",
        postalCode: "",
        institutionType: "",
        description: "",
        ownershipType: "",
        status: "active",
      });
      const updatedResponse = await axiosInstance.get(
        "institutes"
      );
      setInstitutes(updatedResponse.data);
      setSnackbar({
        open: true,
        message: "Institute added successfully!",
        severity: "success",
      });
      setOpenModal(false);
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Failed to add institute.",
        severity: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };
  

  const handleUpdateInstitute = async (instituteId, updatedData = {}) => {
    const selectedInstitute = institutes.find(
      (institute) => institute.id === instituteId
    );
  
    if (!selectedInstitute) {
      setError("Institute not found.");
      return;
    }
    const formData = new FormData();

    // Append text fields
    formData.append("name", updatedData.name || selectedInstitute.name || instituteData.name);
    formData.append(
      "contactNumber",
      updatedData.contactNumber || selectedInstitute.contactNumber || instituteData.contactNumber
    );
    formData.append("email", updatedData.email || selectedInstitute.email || instituteData.email);
    formData.append("website", updatedData.website || selectedInstitute.website || instituteData.website);
    formData.append(
      "establishedYear",
      updatedData.establishedYear || selectedInstitute.establishedYear || instituteData.establishedYear
    );
    formData.append(
      "affiliation",
      updatedData.affiliation || selectedInstitute.affiliation || instituteData.affiliation
    );
    formData.append(
      "principalName",
      updatedData.principalName || selectedInstitute.principalName || instituteData.principalName
    );
    formData.append(
      "totalStudents",
      updatedData.totalStudents || selectedInstitute.totalStudents || instituteData.totalStudents
    );
    formData.append("totalStaff", updatedData.totalStaff || selectedInstitute.totalStaff || instituteData.totalStaff);
    formData.append("latitude", updatedData.latitude || selectedInstitute.latitude || instituteData.latitude);
    formData.append("faxNumber", updatedData.faxNumber || selectedInstitute.faxNumber || instituteData.faxNumber);
    formData.append(
      "institutionBody",
      updatedData.institutionBody || selectedInstitute.institutionBody || instituteData.institutionBody
    );
    formData.append(
      "numberOfBranches",
      updatedData.numberOfBranches || selectedInstitute.numberOfBranches || instituteData.numberOfBranches
    );
    formData.append(
      "location",
      updatedData.location || selectedInstitute.location || instituteData.location
    );
    formData.append("city", updatedData.city || selectedInstitute.city || instituteData.city);
    formData.append(
      "postalCode",
      updatedData.postalCode || selectedInstitute.postalCode || instituteData.postalCode
    );
    formData.append(
      "institutionType",
      updatedData.institutionType || selectedInstitute.institutionType || instituteData.institutionType
    );
    formData.append(
      "description",
      updatedData.description || selectedInstitute.description || instituteData.description
    );
    formData.append(
      "ownershipType",
      updatedData.ownershipType || selectedInstitute.ownershipType || instituteData.ownershipType
    );
    formData.append("status", updatedData.status || selectedInstitute.status || instituteData.status);
    
    // Handle logo (File)
    let file = null;
    if (updatedData.logo instanceof File) {
      file = updatedData.logo;
    } else if (typeof updatedData.logo === "string") {
      file = await convertUrlToFile(updatedData.logo);
    }
    
    if (file) {
      formData.append("logo", file);
    }
    
    // Handle social media links (if it's an object, convert to JSON)
    const socialMediaLinks =
      updatedData.socialMediaLinks || selectedInstitute.socialMediaLinks || instituteData.socialMediaLinks;
    if (socialMediaLinks) {
      formData.append("socialMediaLinks", JSON.stringify(socialMediaLinks));
    }

    try {
      const response = await axiosInstance.put(
        `institutes/${instituteId}`,
        formData
      );
  
      if (response.status === 200) {
        setInstitutes((prevInstitutes) =>
          prevInstitutes.map((institute) =>
            institute.id === instituteId
              ? { ...institute, ...formData }
              : institute
          )
        );
        setSnackbar({
          open: true,
          message: "Institute updated successfully!",
          severity: "success",
        });
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Failed to update institute.",
        severity: "error",
      });
    }
  };
const handleToggleMapAccess = async (instituteId, currentValue) => {
  try {
    // 1) Update on server
    await axiosInstance.put(
      `institutes/${instituteId}/map-access`,
      { mapAccess: !currentValue }
    );

    // (Optional) optimistic flip for instant feedback
    setInstitutes(prev =>
      prev.map(i => (i.id === instituteId ? { ...i, mapAccess: !currentValue } : i))
    );

    // 2) Pull DB truth so we don't get stuck with null/old values
    const { data } = await axiosInstance.get("institutes");
    setInstitutes(Array.isArray(data) ? data : (data?.institutes ?? []));

    setSnackbar({ open: true, message: "Map access updated", severity: "success" });
  } catch (e) {
    setSnackbar({
      open: true,
      message: e?.response?.data?.message || "Failed to update map access",
      severity: "error",
    });
  }
};


  const handleDeleteInstitute = async (id) => {
    try {
      await axiosInstance.delete(
        `institutes/${id}`
      );
      setInstitutes(institutes.filter((institute) => institute.id !== id));
      setSnackbar({
        open: true,
        message: "Institute deleted successfully!",
        severity: "success",
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Failed to delete institute.",
        severity: "error",
      });
    }
  };

  const columns = [
    { field: "id", headerName: "ID", width: 70 },
    {
      field: "name",
      headerName: "Institute Name",
      width: 200,
      editable: true,
      renderEditCell: (params) => (
        <TextField
          value={editedInstitutes[params.id]?.name || params.value || ""}
          onChange={(e) =>
            setEditedInstitutes((prev) => ({
              ...prev,
              [params.id]: { ...prev[params.id], name: e.target.value },
            }))
          }
        />
      ),
    },
    {
  field: "instituteCode",
  headerName: "Institute Code",
  width: 150,
  editable: true,
  renderEditCell: (params) => (
    <TextField
      value={editedInstitutes[params.id]?.instituteCode || params.value || ""}
      onChange={(e) =>
        setEditedInstitutes((prev) => ({
          ...prev,
          [params.id]: {
            ...prev[params.id],
            instituteCode: e.target.value,
          },
        }))
      }
    />
  ),
},

    {
      field: "contactNumber",
      headerName: "Contact Number",
      width: 150,
      editable: true,
      renderEditCell: (params) => (
        <TextField
          value={
            editedInstitutes[params.id]?.contactNumber || params.value || ""
          }
          onChange={(e) =>
            setEditedInstitutes((prev) => ({
              ...prev,
              [params.id]: {
                ...prev[params.id],
                contactNumber: e.target.value,
              },
            }))
          }
        />
      ),
    },
    {
      field: "email",
      headerName: "Email",
      width: 200,
      editable: true,
      renderEditCell: (params) => (
        <TextField
          value={editedInstitutes[params.id]?.email || params.value || ""}
          onChange={(e) =>
            setEditedInstitutes((prev) => ({
              ...prev,
              [params.id]: { ...prev[params.id], email: e.target.value },
            }))
          }
        />
      ),
    },
    {
      field: "website",
      headerName: "Website",
      width: 200,
      editable: true,
      renderEditCell: (params) => (
        <TextField
          value={editedInstitutes[params.id]?.website || params.value || ""}
          onChange={(e) =>
            setEditedInstitutes((prev) => ({
              ...prev,
              [params.id]: { ...prev[params.id], website: e.target.value },
            }))
          }
        />
      ),
    },
    {
      field: "logo",
      headerName: "Logo",
      width: 250,
      editable: true,
      renderEditCell: (params) => (
        <div>
          <img
            src={
              editedInstitutes[params.id]?.logo instanceof File
                ? URL.createObjectURL(editedInstitutes[params.id]?.logo)
                : params.value // Use the existing value if it's a URL or Base64 string
            }
            alt="Logo Preview"
            style={{ width: "50px", height: "50px", marginBottom: "5px" }}
          />
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files[0];
              if (file) {
                setEditedInstitutes((prev) => ({
                  ...prev,
                  [params.id]: {
                    ...prev[params.id],
                    logo: file, // Store the file object here
                  },
                }));
              }
            }}
          />
        </div>
      ),
    },
    {
      field: "establishedYear",
      headerName: "Established Year",
      width: 150,
      editable: true,
      renderEditCell: (params) => (
        <TextField
          value={
            editedInstitutes[params.id]?.establishedYear || params.value || ""
          }
          onChange={(e) =>
            setEditedInstitutes((prev) => ({
              ...prev,
              [params.id]: {
                ...prev[params.id],
                establishedYear: e.target.value,
              },
            }))
          }
        />
      ),
    },
    {
      field: "affiliation",
      headerName: "Affiliation",
      width: 150,
      editable: true,
      renderEditCell: (params) => (
        <TextField
          value={editedInstitutes[params.id]?.affiliation || params.value || ""}
          onChange={(e) =>
            setEditedInstitutes((prev) => ({
              ...prev,
              [params.id]: { ...prev[params.id], affiliation: e.target.value },
            }))
          }
        />
      ),
    },
    {
      field: "principalName",
      headerName: "Principal Name",
      width: 150,
      editable: true,
      renderEditCell: (params) => (
        <TextField
          value={
            editedInstitutes[params.id]?.principalName || params.value || ""
          }
          onChange={(e) =>
            setEditedInstitutes((prev) => ({
              ...prev,
              [params.id]: {
                ...prev[params.id],
                principalName: e.target.value,
              },
            }))
          }
        />
      ),
    },
    {
      field: "totalStudents",
      headerName: "Total Students",
      width: 150,
      editable: true,
      renderEditCell: (params) => (
        <TextField
          value={
            editedInstitutes[params.id]?.totalStudents || params.value || ""
          }
          onChange={(e) =>
            setEditedInstitutes((prev) => ({
              ...prev,
              [params.id]: {
                ...prev[params.id],
                totalStudents: e.target.value,
              },
            }))
          }
        />
      ),
    },
    {
      field: "totalStaff",
      headerName: "Total Staff",
      width: 150,
      editable: true,
      renderEditCell: (params) => (
        <TextField
          value={editedInstitutes[params.id]?.totalStaff || params.value || ""}
          onChange={(e) =>
            setEditedInstitutes((prev) => ({
              ...prev,
              [params.id]: { ...prev[params.id], totalStaff: e.target.value },
            }))
          }
        />
      ),
    },
    {
      field: "latitude",
      headerName: "Latitude",
      width: 120,
      editable: true,
      renderEditCell: (params) => (
        <TextField
          value={editedInstitutes[params.id]?.latitude || params.value || ""}
          onChange={(e) =>
            setEditedInstitutes((prev) => ({
              ...prev,
              [params.id]: { ...prev[params.id], latitude: e.target.value },
            }))
          }
        />
      ),
    },
    {
      field: "faxNumber",
      headerName: "Fax Number",
      width: 150,
      editable: true,
      renderEditCell: (params) => (
        <TextField
          value={editedInstitutes[params.id]?.faxNumber || params.value || ""}
          onChange={(e) =>
            setEditedInstitutes((prev) => ({
              ...prev,
              [params.id]: { ...prev[params.id], faxNumber: e.target.value },
            }))
          }
        />
      ),
    },
    {
      field: "institutionBody",
      headerName: "Institution Body",
      width: 200,
      editable: true,
      renderEditCell: (params) => (
        <Select
          value={
            editedInstitutes[params.id]?.institutionBody || params.value || ""
          }
          onChange={(e) =>
            setEditedInstitutes((prev) => ({
              ...prev,
              [params.id]: {
                ...prev[params.id],
                institutionBody: e.target.value,
              },
            }))
          }
        >
          <MenuItem value="">Select Institution Body</MenuItem>
          {["public", "private", "government", "aided"].map((body) => (
            <MenuItem key={body} value={body}>
              {body}
            </MenuItem>
          ))}
        </Select>
      ),
    },
    {
      field: "numberOfBranches",
      headerName: "Number of Branches",
      width: 150,
      editable: true,
      renderEditCell: (params) => (
        <TextField
          value={
            editedInstitutes[params.id]?.numberOfBranches || params.value || ""
          }
          onChange={(e) =>
            setEditedInstitutes((prev) => ({
              ...prev,
              [params.id]: {
                ...prev[params.id],
                numberOfBranches: e.target.value,
              },
            }))
          }
        />
      ),
    },
    {
      field: "socialMediaLinks",
      headerName: "Social Media Links",
      width: 200,
      editable: true,
      renderEditCell: (params) => (
        <TextField
          value={
            editedInstitutes[params.id]?.socialMediaLinks || params.value || ""
          }
          onChange={(e) =>
            setEditedInstitutes((prev) => ({
              ...prev,
              [params.id]: {
                ...prev[params.id],
                socialMediaLinks: e.target.value,
              },
            }))
          }
        />
      ),
    },
    {
      field: "status",
      headerName: "Status",
      width: 100,
      editable: true,
      renderEditCell: (params) => (
        <Select
          value={editedInstitutes[params.id]?.status || params.value || ""}
          onChange={(e) =>
            setEditedInstitutes((prev) => ({
              ...prev,
              [params.id]: { ...prev[params.id], status: e.target.value },
            }))
          }
        >
          <MenuItem value="">Select Status</MenuItem>
          {["active", "inactive"].map((type) => (
            <MenuItem key={type} value={type}>
              {type}
            </MenuItem>
          ))}
        </Select>
      ),
    },
    {
      field: "ownershipType",
      headerName: "Ownership Type",
      width: 150,
      editable: true,
      renderEditCell: (params) => (
        <TextField
          value={
            editedInstitutes[params.id]?.ownershipType || params.value || ""
          }
          onChange={(e) =>
            setEditedInstitutes((prev) => ({
              ...prev,
              [params.id]: {
                ...prev[params.id],
                ownershipType: e.target.value,
              },
            }))
          }
        />
      ),
    },
    {
      field: "institutionType",
      headerName: "Institution Type",
      width: 200,
      editable: true,
      renderEditCell: (params) => (
        <Select
          value={
            editedInstitutes[params.id]?.institutionType || params.value || ""
          }
          onChange={(e) =>
            setEditedInstitutes((prev) => ({
              ...prev,
              [params.id]: {
                ...prev[params.id],
                institutionType: e.target.value,
              },
            }))
          }
        >
          <MenuItem value="">Select Institution Type</MenuItem>
          {["university", "school", "college", "company"].map((type) => (
            <MenuItem key={type} value={type}>
              {type}
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
                handleUpdateInstitute(
                  params.id,
                  editedInstitutes[params.id] || {}
                )
              }
            >
              <SaveIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete">
            <IconButton
              color="error"
              onClick={() => handleDeleteInstitute(params.id)}
            >
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        </>
      ),
    },
  ];

  return (
    <div className="mx-auto mt-4 max-w-full rounded-lg bg-gradient-to-r from-gray-100 to-gray-200 p-6 shadow-2xl">
      <h2 className="mb-6 text-3xl font-semibold text-gray-800">
        Manage Institutes
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
        Add New Institute
      </Button>

      <Dialog
        open={openModal}
        onClose={() => setOpenModal(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Add New Institute</DialogTitle>
        <DialogContent>
          <div className="grid grid-cols-2 gap-4 p-2">
            <TextField
              label="Institute Name"
              name="name"
              value={instituteData.name}
              onChange={handleInstituteInputChange}
              required
              fullWidth
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SchoolIcon />
                  </InputAdornment>
                ),
              }}
            />
            <TextField
  label="Institute Code"
  name="instituteCode"
  value={instituteData.instituteCode}
  onChange={handleInstituteInputChange}
  required
  fullWidth
/>
            {/* Logo Upload with Preview */}
            <FormControl fullWidth className="col-span-2">
              <InputLabel shrink>Upload Logo</InputLabel>
              <input
                accept="image/*"
                type="file"
                onChange={handleImageChange}
                style={{ display: "block", marginTop: "8px" }}
              />
              {logoPreview && (
                <img
                  src={logoPreview}
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
            <TextField
              label="Contact Number"
              name="contactNumber"
              value={instituteData.contactNumber}
              onChange={handleInstituteInputChange}
            />
            <TextField
              label="Email"
              name="email"
              value={instituteData.email}
              onChange={handleInstituteInputChange}
              fullWidth
            />
            <TextField
              label="Website"
              name="website"
              value={instituteData.website}
              onChange={handleInstituteInputChange}
              fullWidth
            />
            <TextField
              label="Established Year"
              type="number"
              name="establishedYear"
              value={instituteData.establishedYear}
              onChange={handleInstituteInputChange}
              fullWidth
            />
            <TextField
              label="Affiliation"
              name="affiliation"
              value={instituteData.affiliation}
              onChange={handleInstituteInputChange}
              fullWidth
            />
            <TextField
              label="Principal Name"
              name="principalName"
              value={instituteData.principalName}
              onChange={handleInstituteInputChange}
              fullWidth
            />
            <TextField
              label="Total Students"
              type="number"
              name="totalStudents"
              value={instituteData.totalStudents}
              onChange={handleInstituteInputChange}
              fullWidth
            />
            <TextField
              label="Total Staff"
              type="number"
              name="totalStaff"
              value={instituteData.totalStaff}
              onChange={handleInstituteInputChange}
              fullWidth
            />
            <TextField
              label="Latitude"
              type="number"
              name="latitude"
              value={instituteData.latitude}
              onChange={handleInstituteInputChange}
              fullWidth
            />
            <TextField
              label="Fax Number"
              name="faxNumber"
              value={instituteData.faxNumber}
              onChange={handleInstituteInputChange}
              fullWidth
            />
            <FormControl fullWidth>
              <InputLabel>Institution Body</InputLabel>
              <Select
                name="institutionBody"
                value={instituteData.institutionBody}
                onChange={handleInstituteInputChange}
              >
                <MenuItem value="">
                  <em>Select Institution Body</em>
                </MenuItem>
                <MenuItem value="public">Public</MenuItem>
                <MenuItem value="private">Private</MenuItem>
                <MenuItem value="government">Government</MenuItem>
                <MenuItem value="aided">Aided</MenuItem>
              </Select>
            </FormControl>

            <TextField
              label="Number of Branches"
              type="number"
              name="numberOfBranches"
              value={instituteData.numberOfBranches}
              onChange={handleInstituteInputChange}
              fullWidth
            />
            <TextField
              label="Social Media Links"
              name="socialMediaLinks"
              value={instituteData.socialMediaLinks}
              onChange={handleInstituteInputChange}
              multiline
              rows={1}
              fullWidth
            />
            <TextField
              label="Location"
              name="location"
              value={instituteData.location}
              onChange={handleInstituteInputChange}
              required
              fullWidth
            />
            <TextField
              label="City"
              name="city"
              value={instituteData.city}
              onChange={handleInstituteInputChange}
              required
              fullWidth
            />
            <TextField
              label="Postal Code"
              name="postalCode"
              value={instituteData.postalCode}
              onChange={handleInstituteInputChange}
              required
              fullWidth
            />

            <FormControl fullWidth required>
              <InputLabel>Institution Type</InputLabel>
              <Select
                name="institutionType"
                value={instituteData.institutionType}
                onChange={handleInstituteInputChange}
              >
                <MenuItem value="">
                  <em>Select Institution Type</em>
                </MenuItem>
                <MenuItem value="university">University</MenuItem>
                <MenuItem value="school">School</MenuItem>
                <MenuItem value="college">College</MenuItem>
                <MenuItem value="company">Company</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel>Ownership Type</InputLabel>
              <Select
                name="ownershipType"
                value={instituteData.ownershipType}
                onChange={handleInstituteInputChange}
              >
                <MenuItem value="">
                  <em>Select Ownership Type</em>
                </MenuItem>
                <MenuItem value="owned">Owned</MenuItem>
                <MenuItem value="leased">Leased</MenuItem>
              </Select>
            </FormControl>

            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                name="status"
                value={instituteData.status}
                onChange={handleInstituteInputChange}
              >
                <MenuItem value="active">Active</MenuItem>
                <MenuItem value="inactive">Inactive</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel>Description</InputLabel>
              <TextField
                name="description"
                value={instituteData.description}
                onChange={handleInstituteInputChange}
                multiline
                rows={4}
              />
            </FormControl>
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenModal(false)} color="secondary">
            Cancel
          </Button>
          <Button variant="contained" color="primary" onClick={handleSubmit}>
            Add Institute
          </Button>
        </DialogActions>
      </Dialog>
      <div style={{ minHeight: "600px", height: "auto", width: "100%", marginTop: "16px" }}>
        {/* <DataGrid
          rows={institutes}
          columns={columns}
          pageSize={5}
          checkboxSelection
          onRowEditCommit={(params) => handleUpdateInstitute(params.id, params)}
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
          dataSource={paginatedInstitutes}
          keyExpr="id"
          showBorders={true}
          rowAlternationEnabled={true}
          allowColumnResizing={true}
          onRowUpdating={(e) => {
            e.cancel = true; // stop direct update
  setPendingUpdate({ id: e.row.data.id, newData: e.row.data });
  setConfirmUpdateOpen(true); // open popup
}}

          onRowRemoving={(e) => handleDeleteInstitute(e.data.id)}
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
          {/* <Column dataField="id" caption="ID" allowEditing={false} width={70} /> */}
          <Column dataField="name" caption="Institute Name" minWidth={150}/>
          <Column dataField="instituteCode" caption="Institute Code" minWidth={150} />
          <Column dataField="contactNumber" caption="Contact Number" minWidth={150}/>
          <Column dataField="email" caption="Email" minWidth={150}/>
          <Column dataField="website" caption="Website" minWidth={150}/>
          <Column
  dataField="mapAccess"
  caption="Map Access"
  width={140}
  allowEditing={false}
  cellRender={(cell) => {
    const row = cell.data;
    return (
      <Switch
        checked={asBool(row.mapAccess)}
  onChange={() => handleToggleMapAccess(row.id, asBool(row.mapAccess))}
        inputProps={{ "aria-label": "toggle-map-access" }}
      />
    );
  }}
/>
          <Column
            dataField="logo"
            caption="Logo"
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
            dataField="status"
            caption="Status"
            lookup={{
              dataSource: [
                { value: "active", display: "Active" },
                { value: "inactive", display: "Inactive" },
              ],
              valueExpr: "value",
              displayExpr: "display",
            }}
          minWidth={150}/>
          <Column dataField="establishedYear" caption="Established Year" minWidth={150}/>
          <Column dataField="affiliation" caption="Affiliation" minWidth={150}/>
          <Column dataField="principalName" caption="Principal Name" minWidth={150}/>
          <Column dataField="totalStudents" caption="Total Students" minWidth={150}/>
          <Column dataField="totalStaff" caption="Total Staff" minWidth={150}/>
          <Column dataField="latitude" caption="Latitude" minWidth={150}/>
          <Column dataField="faxNumber" caption="Fax Number" minWidth={150}/>
          <Column
            dataField="institutionBody"
            caption="Institution Body"
            lookup={{
              dataSource: [
                { value: "public", display: "Public" },
                { value: "private", display: "Private" },
                { value: "government", display: "Government" },
                { value: "aided", display: "Aided" },
              ],
              valueExpr: "value",
              displayExpr: "display",
            }}
          minWidth={150}/>
          <Column dataField="numberOfBranches" caption="Number of Branches" minWidth={150}/>
          <Column dataField="socialMediaLinks" caption="Social Media Links" minWidth={150}/>
          <Column dataField="ownershipType" caption="Ownership Type" minWidth={150}/>
          <Column
            dataField="institutionType"
            caption="Institution Type"
            lookup={{
              dataSource: [
                { value: "university", display: "University" },
                { value: "school", display: "School" },
                { value: "college", display: "College" },
                { value: "company", display: "Company" },
              ],
              valueExpr: "value",
              displayExpr: "display",
            }}
          minWidth={150}/>
          {/* Command Buttons */}
          {/* <Column type="buttons">
        <GridButton name="edit" />
        <GridButton name="delete" />
        <GridButton
          icon="save"
          hint="Save"
          onClick={(e) => handleUpdateInstitute(e.row.data.id, e.row.data)}
        />
      </Column> */}
          <Column
            type="buttons"
            buttons={[
              "edit",
              "delete",
              {
                hint: "Save Changes",
                icon: "save",
                onClick: (e) =>{
setPendingUpdate({ id: e.row.data.id, newData: e.row.data });
  setConfirmUpdateOpen(true);              },
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
            Page {currentPage + 1} of {Math.ceil(institutes.length / pageSize)}
          </span>
          <Button
            variant="contained"
            onClick={() =>
              setCurrentPage((prev) =>
                Math.min(prev + 1, Math.ceil(institutes.length / pageSize) - 1)
              )
            }
            disabled={(currentPage + 1) * pageSize >= institutes.length}
          >
            Next
          </Button>
        </div>
      </div>
      <Dialog
  open={confirmUpdateOpen}
  onClose={() => setConfirmUpdateOpen(false)}
  fullWidth
  maxWidth="sm"
>
  <DialogTitle>Confirm Update / पुष्टि करें</DialogTitle>
  <DialogContent>
    <Typography>
      Do you want to apply changes to institute{" "}
      <strong>{pendingUpdate?.newData?.name}</strong>? <br />
      क्या आप संस्थान{" "}
      <strong>{pendingUpdate?.newData?.name}</strong>{" "}
      में बदलाव करना चाहते हैं?
    </Typography>
  </DialogContent>
  <DialogActions>
    <Button onClick={() => setConfirmUpdateOpen(false)} color="secondary">
      No / नहीं
    </Button>
    <Button
      onClick={() => {
        handleUpdateInstitute(pendingUpdate.id, pendingUpdate.newData);
        setConfirmUpdateOpen(false);
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

export default ManageInstitute;
