import React, { useState, useEffect } from "react";
import axios from "axios";
import { DataGrid, Column, Paging, Pager, Toolbar, Item, SearchPanel, Export } from "devextreme-react/data-grid";
import "devextreme/dist/css/dx.material.blue.light.css";
import { Snackbar, Alert, Button } from "@mui/material";
import axiosInstance from "../../api/axios";

const Enquires = () => {
  const [enquiries, setEnquiries] = useState([]);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const token = sessionStorage.getItem("authToken");

  const handleSnackbarClose = () => setSnackbar({ ...snackbar, open: false });

  useEffect(() => {
    (async () => {
      try {
        const response = await axiosInstance.get("enquiries");
        setEnquiries(response.data);
      } catch {
        setSnackbar({
          open: true,
          message: "Failed to load enquiries.",
          severity: "error",
        });
      }
    })();
  }, []);

  const paginatedEnquiries = enquiries.slice(
    currentPage * pageSize,
    currentPage * pageSize + pageSize
  );

  return (
    <div className="p-6 mt-4 bg-gradient-to-r from-gray-100 to-gray-200 rounded-lg shadow-lg max-w-full mx-auto">
      <h1 className="text-2xl font-bold mb-4">Client Enquiries</h1>

      {/* DataGrid for Enquiries */}
      <DataGrid
        dataSource={paginatedEnquiries}
        showBorders={true}
        columnAutoWidth={true}
        allowColumnResizing={true}
        rowAlternationEnabled={true}
        className="mb-6"
        height="500px"
      >
        <SearchPanel visible={true} highlightCaseSensitive={true} placeholder="Search enquiries..." />
        <Paging defaultPageSize={10} />
        <Pager showPageSizeSelector={false} showInfo={true} />
        <Toolbar>
          <Item name="searchPanel" />
          <Item name="exportButton" />
        </Toolbar>
        <Export enabled={true} allowExportSelectedData={true} />

        {/* Columns */}
        <Column dataField="id" caption="ID" width={90} />
        <Column dataField="full_name" caption="Name" />
        <Column dataField="email" caption="Email" />
        <Column dataField="mobile_number" caption="Mobile Number" />
        <Column dataField="institute_name" caption="Institute Name" />
        <Column dataField="number_of_buses" caption="Number of Buses" />
        <Column dataField="address" caption="Address" />
        <Column dataField="pincode" caption="Pincode" />
        <Column dataField="description" caption="Message" />
        <Column dataField="createdAt" caption="Date" dataType="date" format="MM/dd/yyyy" />

        <Paging defaultPageSize={10} />
        <Pager
          showPageSizeSelector={true}
          allowedPageSizes={[5, 10, 20]}
          showInfo={true}
          displayMode="full"
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
            Page {currentPage + 1} of {Math.ceil(enquiries.length / pageSize)}
          </span>
          <Button
            variant="contained"
            onClick={() =>
              setCurrentPage((prev) =>
                Math.min(prev + 1, Math.ceil(enquiries.length / pageSize) - 1)
              )
            }
            disabled={(currentPage + 1) * pageSize >= enquiries.length}
          >
            Next
          </Button>
        </div>
      {/* Snackbar for Notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbar.severity} sx={{ width: "100%" }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default Enquires;
