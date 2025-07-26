import React from "react";
import {
  MdOutlineCalendarToday,
  MdBarChart,
} from "react-icons/md";
import Card from "../../../../components/card/index";
import LineChart from "../../../../components/charts/LineChart";

const TotalDrivers = ({ drivers, driverChartData = {} }) => {
  const defaultOptions = {
    chart: {
      type: "line",
      toolbar: { show: false },
    },
    stroke: { curve: "smooth" },
    xaxis: {
      categories: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    },
    yaxis: {
      show: false,
      labels: { show: false },
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    grid: {
      yaxis: {
        lines: { show: false },
      },
    },
  };

  const defaultSeries = [
    {
      name: "Drivers",
      data: [0, 0, 0, 0, 0, 0, 0], // Default empty data
    },
  ];

  return (
    <Card extra="!p-[20px] text-center">
      <div className="flex justify-between">
        <button className="linear mt-1 flex items-center justify-center gap-2 rounded-lg bg-lightPrimary p-2 text-gray-600 transition duration-200 hover:cursor-pointer hover:bg-gray-100 active:bg-gray-200 dark:bg-navy-700 dark:hover:opacity-90 dark:active:opacity-80">
          <MdOutlineCalendarToday />
          <span className="text-sm font-medium text-gray-600">This year</span>
        </button>
        <button className="!linear z-[1] flex items-center justify-center rounded-lg bg-lightPrimary p-2 text-brand-500 !transition !duration-200 hover:bg-gray-100 active:bg-gray-200 dark:bg-navy-700 dark:text-white dark:hover:bg-white/20 dark:active:bg-white/10">
          <MdBarChart className="h-6 w-6" />
        </button>
      </div>

      <div className="flex h-full w-full flex-row justify-between sm:flex-wrap lg:flex-nowrap 2xl:overflow-hidden">
        {/* <div className="flex flex-col">
          <p className="mt-[20px] text-3xl font-bold text-navy-700 dark:text-white">
            {drivers}
          </p>
          <div className="flex flex-col items-start">
            <p className="text-sm text-gray-600">Total Drivers</p>
          </div>
        </div> */}
        <div className="h-full w-full">
          {/* Line chart using driverChartData */}
          <LineChart
            options={driverChartData.options || defaultOptions}
            series={driverChartData.series || defaultSeries}
          />
        </div>
      </div>
    </Card>
  );
};

export default TotalDrivers;
