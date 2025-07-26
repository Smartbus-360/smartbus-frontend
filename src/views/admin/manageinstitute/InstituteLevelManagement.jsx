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
import { getUser } from "../../../config/authService";
  
const convertUrlToFile = async (url, fileName = "logo.png") => {
  const response = await fetch(url);
  const blob = await response.blob();
  const file = new File([blob], fileName, { type: blob.type });
  return file;
};


const InstituteLevelManagement = () => {
  const [institutes, setInstitutes] = useState([]);
  const [instituteData, setInstituteData] = useState({
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
  const [openModal, setOpenModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const handleSnackbarClose = () => setSnackbar({ ...snackbar, open: false });
  const [editedInstitutes, setEditedInstitutes] = useState({});
  const [logoPreview, setLogoPreview] = useState(null);
  const user = getUser();
  // Fetching institutes from the API
  useEffect(() => {
    const fetchInstitutes = async () => {
      try {
        const response = await axiosInstance.get("institutes");
        setInstitutes(response.data);
      } catch (error) {
        console.error("Error fetching institutes:", error);
        setSnackbar({
          open: true,
          message: "Failed to load data.",
          severity: "error",
        });
      }
    };

    fetchInstitutes();
  }, []);

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
    setInstituteData((prev) => ({ ...prev, logo: file }));
    setLogoPreview(URL.createObjectURL(file));
  };

  const handleUpdateInstitute = async (instituteId, updatedData = {}) => {
    const selectedInstitute = institutes.find(
      (institute) => institute.id === instituteId
    );

    if (!selectedInstitute) {
      setError("Institute not found.");
      // setSnackbarOpen(true);
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
          {/* Preview existing or newly uploaded logo */}
          {editedInstitutes[params.id]?.logo || params.value ? (
            <img
              src={editedInstitutes[params.id]?.logo || params.value}
              alt="Logo Preview"
              style={{ width: "50px", height: "50px", marginBottom: "5px" }}
            />
          ) : (
            <span>No Logo</span>
          )}
          {/* Upload new logo */}
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files[0];
              if (file) {
                const reader = new FileReader();
                reader.onloadend = () => {
                  setEditedInstitutes((prev) => ({
                    ...prev,
                    [params.id]: {
                      ...prev[params.id],
                      logo: reader.result,
                    },
                  }));
                };
                reader.readAsDataURL(file); // Converts file to base64 string for preview
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

      <div
        style={{
          minHeight: "600px",
          height: "auto",
          width: "100%",
          marginTop: "16px",
        }}
      >
        <DataGrid
          dataSource={institutes}
          keyExpr="id"
          showBorders={true}
          rowAlternationEnabled={true}
          allowColumnResizing={true}
          onRowUpdating={(e) => handleUpdateInstitute(e.oldData.id, e.newData)}
          scrolling={{ mode: "virtual", useNative: true }}
        >
          <Editing
            mode="cell"
            allowUpdating={true}
            allowDeleting={true}
            useIcons={true}
          />
          <SearchPanel visible={true} highlightCaseSensitive={true} />
          <Paging defaultPageSize={5} />
          <Pager showPageSizeSelector={false} showInfo={true} />

          {/* Columns */}
          {/* <Column dataField="id" caption="ID" allowEditing={false} width={70} /> */}
          <Column dataField="name" caption="Institute Name" minWidth={150} />
          <Column
            dataField="contactNumber"
            caption="Contact Number"
            minWidth={150}
          />
          <Column dataField="email" caption="Email" minWidth={150} />
          <Column dataField="website" caption="Website" minWidth={150} />
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
            minWidth={150}
          />
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
            minWidth={150}
          />
          <Column
            dataField="establishedYear"
            caption="Established Year"
            minWidth={150}
          />
          <Column
            dataField="affiliation"
            caption="Affiliation"
            minWidth={150}
          />
          <Column
            dataField="principalName"
            caption="Principal Name"
            minWidth={150}
          />
          <Column
            dataField="totalStudents"
            caption="Total Students"
            minWidth={150}
          />
          <Column dataField="totalStaff" caption="Total Staff" minWidth={150} />
          <Column dataField="latitude" caption="Latitude" minWidth={150} />
          <Column dataField="faxNumber" caption="Fax Number" minWidth={150} />
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
            minWidth={150}
          />
          <Column
            dataField="numberOfBranches"
            caption="Number of Branches"
            minWidth={150}
          />
          <Column
            dataField="socialMediaLinks"
            caption="Social Media Links"
            minWidth={150}
          />
          <Column
            dataField="ownershipType"
            caption="Ownership Type"
            minWidth={150}
          />
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
            minWidth={150}
          />
          <Column
            type="buttons"
            buttons={[
              "edit",
              {
                hint: "Save Changes",
                icon: "save",
                onClick: (e) =>
                  handleUpdateInstitute(e.row.data.id, e.row.data),
              },
            ]}
          />
        </DataGrid>
      </div>
    </div>
  );
};

export default InstituteLevelManagement;
