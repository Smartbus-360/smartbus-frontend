import Card from "../../../../components/card/index";
import BarChart from "../../../../components/charts/BarChart";
import React, { useState } from "react";
import { MdBarChart } from "react-icons/md";

const WeeklyUpdates = ({drivers = 0, institutes = 0, stops = 0, students = 0, routes = 0, buses = 0}) => {
  const [weeklyUpdates, setWeeklyUpdates] = useState({
    routesAdded: routes,
    routesModified: 1,
    routesDeleted: 2,
    driversAdded: drivers,
    driversModified: 0,
    driversDeleted: 0,
    stopsAdded: stops,
    stopsModified: 0,
    stopsDeleted: 0,
    studentsAdded: students,
    studentsModified: 0,
    studentsDeleted: 0,
    institutesAdded: institutes,
    institutesModified: 0,
    institutesDeleted: 0,
  });

  // useEffect(() => {
  //   const getWeeklyUpdates = async () => {
  //     const data = await fetchWeeklyUpdates(); // API call to fetch weekly updates
  //     setWeeklyUpdates(data);
  //   };
  //   getWeeklyUpdates();
  // }, []);

  const barChartDataWeeklyUpdates = [
    {
      name: "Added",
      data: [
        weeklyUpdates.routesAdded,
        weeklyUpdates.driversAdded,
        weeklyUpdates.stopsAdded,
        weeklyUpdates.studentsAdded,
        weeklyUpdates.institutesAdded,
      ],
      color: "#6AD2Fa",
    },
    {
      name: "Modified",
      data: [
        weeklyUpdates.routesModified,
        weeklyUpdates.driversModified,
        weeklyUpdates.stopsModified,
        weeklyUpdates.studentsModified,
        weeklyUpdates.institutesModified,
      ],
      color: "#4318FF",
    },
    {
      name: "Deleted",
      data: [
        weeklyUpdates.routesDeleted,
        weeklyUpdates.driversDeleted,
        weeklyUpdates.stopsDeleted,
        weeklyUpdates.studentsDeleted,
        weeklyUpdates.institutesDeleted,
      ],
      color: "#EFF4FB",
    },
  ];

  const barChartOptionsWeeklyUpdates = {
    chart: {
      stacked: true,
      toolbar: {
        show: false,
      },
    },
    xaxis: {
      categories: ["Routes", "Drivers", "Stops", "Students", "Institutes"],
      labels: {
        style: {
          colors: "#A3AED0",
          fontSize: "14px",
          fontWeight: "500",
        },
      },
    },
    yaxis: {
      labels: {
        style: {
          colors: "#A3AED0",
          fontSize: "14px",
        },
      },
    },
    grid: {
      borderColor: "rgba(163, 174, 208, 0.3)",
    },
    fill: {
      type: "solid",
    },
    legend: {
      show: true,
    },
    colors: ["#5E37FF", "#6AD2FF", "#E1E9F8"],
    dataLabels: {
      enabled: false,
    },
  };

  return (
    <Card extra="flex flex-col bg-white w-full rounded-3xl py-6 px-2 text-center">
      <div className="mb-auto flex items-center justify-between px-6">
        <h2 className="text-lg font-bold text-navy-700 dark:text-white">
          Weekly Updates
        </h2>
        <button className="!linear z-[1] flex items-center justify-center rounded-lg bg-lightPrimary p-2 text-brand-500 !transition !duration-200 hover:bg-gray-100 active:bg-gray-200 dark:bg-navy-700 dark:text-white dark:hover:bg-white/20 dark:active:bg-white/10">
          <MdBarChart className="h-6 w-6" />
        </button>
      </div>

      <div className="md:mt-16 lg:mt-0">
        <div className="h-[250px] w-full xl:h-[350px]">
          <BarChart
            chartData={barChartDataWeeklyUpdates}
            chartOptions={barChartOptionsWeeklyUpdates}
          />
        </div>
      </div>
    </Card>
  );
};

export default WeeklyUpdates;
