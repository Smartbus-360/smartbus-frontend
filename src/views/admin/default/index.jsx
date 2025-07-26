import React, { useState, useEffect } from "react";
import WeeklyUpdates from "./components/WeeklyUpdates";
import TotalDrivers from "./components/TotalDrivers";
import { IoBus, IoMap } from "react-icons/io5";
import { MdSchool, MdPeople } from "react-icons/md";
import Widget from "../../../components/widget/Widget";
import CheckTable from "./components/CheckTable";
import ComplexTable from "./components/ComplexTable";
import { useLocation } from "react-router-dom";

const Dashboard = () => {
  const location = useLocation();
  const [counts, setCounts] = useState({
    drivers: 0,
    schools: 0,
    colleges: 0,
    universities: 0,
    stops: 0,
    users: 0,
    routes: 0,
    buses: 0
  });
  const [loading, setLoading] = useState(true);
  const [driverTableData, setDriverTableData] = useState([]);
  const [driverChartData, setDriverChartData] = useState([]);
  const [instituteTableData, setInstituteTableData] = useState([]);

  useEffect(() => {
    // Attempt to fetch details from local storage
    const storedDetails = localStorage.getItem('allDetails');
    let fetchedDetails;
  
    if (storedDetails) {
      // Parse the stored JSON string
      fetchedDetails = JSON.parse(storedDetails);
      console.log('Fetched details from local storage:', fetchedDetails); // Log the fetched details
    } else {
      console.error("No data found in local storage!"); // Log an error if no data is found
      fetchedDetails = {
        drivers: [],
        stops: [],
        routes: [],
        buses: [],
        users: [],
        institutes: [],
      };
    }
  
    // Process counts and prepare tables
    const drivers = fetchedDetails.drivers || [];
    const stops = fetchedDetails.stops?.length || 0;
    const routes = fetchedDetails.routes?.length || 0;
    const buses = fetchedDetails.buses?.length || 0;
    const users = fetchedDetails.users?.filter((user) => user.isAdmin === 0).length || 0;
  
    const institutes = fetchedDetails.institutes || [];
    const schools = institutes.filter((inst) => inst.institutionType === "school").length;
    const colleges = institutes.filter((inst) => inst.institutionType === "college").length;
    const universities = institutes.filter((inst) => inst.institutionType === "university").length;
  
    // Prepare data for driver table
    const driverTable = fetchedDetails.drivers?.map((driver) => ({
      name: driver.name,
      email: driver.email,
      license: driver.licenseNumber,
      phone: driver.phone,
      availability: driver.availabilityStatus,
    })) || [];
  
    // Prepare data for institute table
    const instituteTable = institutes.map((inst) => ({
      name: inst.name,
      type: inst.institutionType,
      location: inst.location,
      city: inst.city,
      postalCode: inst.postalCode,
    })) || [];
    const currentYear = new Date().getFullYear();
    const monthlyDriverCounts = Array(12).fill(0);
  
    drivers.forEach((driver) => {
      if (driver.createdAt) {
        const createdAtDate = new Date(driver.createdAt);
        if (createdAtDate.getFullYear() === currentYear) {
          const month = createdAtDate.getMonth();
          monthlyDriverCounts[month]++;
        }
      }
    });
  
    setDriverChartData({
      options: {
        chart: {
          type: "line",
          toolbar: { show: false },
        },
        stroke: { curve: "smooth" },
        xaxis: {
          categories: [
            "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", 
            "Aug", "Sep", "Oct", "Nov", "Dec"
          ],
        },
        yaxis: {
          show: false,
          labels: { show: false },
          axisBorder: { show: false },
          axisTicks: { show: false },
        },
      },
      series: [
        {
          name: "Drivers",
          data: monthlyDriverCounts,
        },
      ],
    });  
  
    // Update state with the fetched data
    setCounts({
      drivers: drivers.length,
      schools,
      colleges,
      universities,
      stops,
      users,
      routes,
      buses,
    });
  
    setDriverTableData(driverTable);
    setInstituteTableData(instituteTable);
    setLoading(false); // Set loading to false after processing
  
  }, [location.state]);
  
  

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="w-16 h-16 border-4 border-blue-400 border-dashed rounded-full animate-spin"></div>
      </div>
    );
  }
  const { drivers, schools, colleges, universities, stops, users, routes, buses } = counts;

  return (
    <div>
      <div className="mt-3 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-3 3xl:grid-cols-6">
      <Widget
          icon={<MdPeople className="h-7 w-7" />}
          title={"Number of Drivers"}
          subtitle={drivers}
        />
        <Widget
          icon={<IoMap className="h-7 w-7" />}
          title={"Total Routes"}
          subtitle={routes}
        />
        <Widget
          icon={<IoBus className="h-7 w-7" />}
          title={"Total Stops"}
          subtitle={stops}
        />
        <Widget
          icon={<MdSchool className="h-7 w-7" />}
          title={"Total Schools"}
          subtitle={schools}
        />
        <Widget
          icon={<MdSchool className="h-7 w-7" />}
          title={"Total Colleges"}
          subtitle={colleges}
        />
        <Widget
          icon={<MdSchool className="h-7 w-7" />}
          title={"Total Universities"}
          subtitle={universities}
        />
        <Widget
          icon={<MdPeople className="h-7 w-7" />}
          title={"Total Users"}
          subtitle={users}
        />
      </div>

      {/* Charts */}

      <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2">
      <TotalDrivers drivers={drivers} driverChartData={driverChartData} />
      <WeeklyUpdates  drivers={drivers} institutes={schools + colleges + universities} stops={stops} students={users} routes={routes} buses={buses}  />
      </div>

      {/* Tables & Charts */}
      <div className="mt-5 grid grid-cols-1 gap-5 xl:grid-cols-2">
        {/* Driver Table */}
        <div>
          <CheckTable
            columnsData={[
              { Header: "Name", accessor: "name" },
              { Header: "Email", accessor: "email" },
              { Header: "License", accessor: "license" },
              { Header: "Phone", accessor: "phone" },
              { Header: "Availability", accessor: "availability" },
            ]}
            tableData={driverTableData}
          />
        </div>

        {/* Institute Table */}
        <ComplexTable
          columnsData={[
            { Header: "Name", accessor: "name" },
            { Header: "Type", accessor: "type" },
            { Header: "Location", accessor: "location" },
            { Header: "City", accessor: "city" },
            { Header: "Postal Code", accessor: "postalCode" },
          ]}
          tableData={instituteTableData}
        />
      </div>
    </div>
  );
};

export default Dashboard;
