import { useSelector } from "react-redux";
import React from "react";
import DataTable from "./components/table";
import { MdLink, MdMap } from "react-icons/md";

const UniversityDetails = () => {
  const institute = useSelector((state) => state.institute.institute);

  if (!institute) {
    return (
      <div className="container mx-auto p-6 text-center">
        <h1 className="text-2xl font-bold text-red-600">Institute Not Found</h1>
        <p>Please go back and select an institute.</p>
      </div>
    );
  }

  return (
    <div className="mx-auto mt-4 max-w-full rounded-lg p-6 bg-gradient-to-r from-gray-100 to-gray-200 shadow-xl">
      <h1 className="my-4 text-3xl font-bold text-gray-800">
        {institute.name}
      </h1>
      <p className="text-lg">
        <strong>Website:</strong>{" "}
        <a
          href={institute.website}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-500"
        >
          {institute.website}
          <MdLink className="mx-1 inline-block text-xl" />
        </a>
      </p>
      <p className="text-lg">
        <strong>Location:</strong> {institute.city}, {institute.country || "India"}
      </p>

      {/* Drivers Table */}
      <div className="mt-5 grid h-full grid-cols-1 gap-5 md:grid-cols-2">
        <DataTable
          tableHeader="Drivers"
          columnsData={[
            { Header: "NAME", accessor: "name" },
            { Header: "PHONE", accessor: "phone" },
            { Header: "LICENSE", accessor: "licenseNumber" },
          ]}
          tableData={institute.drivers}
        />

        {/* Buses Table */}
        <DataTable
          tableHeader="Buses"
          columnsData={[
            { Header: "BUS NUMBER", accessor: "number" },
          ]}
          tableData={institute.buses}
        />
      </div>

      {/* Users & Routes Table */}
      <div className="mt-5 grid h-full grid-cols-1 gap-5 md:grid-cols-2">
        <DataTable
          tableHeader="Users"
          columnsData={[
            { Header: "USERNAME", accessor: "username" },
            { Header: "EMAIL", accessor: "email" },
          ]}
          tableData={institute.users}
        />

        <DataTable
          tableHeader="Routes"
          columnsData={[
            { Header: "ROUTE NAME", accessor: "name" },
            { Header: "START", accessor: "start" },
            { Header: "END", accessor: "end" },
          ]}
          tableData={institute.routes}
        />
      </div>

      {/* Stops Table */}
      <div className="mt-5">
        <h2 className="text-xl font-bold text-gray-700 mb-3">Route Stops</h2>
        <DataTable
          tableHeader="Stops"
          columnsData={[
            { Header: "STOP NAME", accessor: "name" },
            { Header: "LATITUDE", accessor: "latitude" },
            { Header: "LONGITUDE", accessor: "longitude" },
          ]}
          tableData={institute.routes.flatMap((route) => route.stops)}
        />
      </div>
    </div>
  );
};

export default UniversityDetails;
