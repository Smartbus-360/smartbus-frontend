import React from "react";
import { MdHome, MdPerson, MdGroupAdd, MdSchool, MdLocalTaxi, MdBusAlert, MdMap, MdAddToQueue, MdNotifications } from "react-icons/md";
import MainDashboard from "./views/admin/default/index";
import Profile from "./views/admin/profile/index";
import ManageAdmin from "./views/admin/manageadmin/ManageAdmin.jsx";
import SecondaryDashboard from "./views/admin/default/SecondaryDashboard.jsx";
import InstituteLevelManagement from "./views/admin/manageinstitute/InstituteLevelManagement.jsx"; 
import ManageInstitute from "./views/admin/manageinstitute/ManageInstitute.jsx"; 
import ManageRoute from "./views/admin/manageroute/ManageRoute.jsx";
import ManageDriver from "./views/admin/managedriver/ManageDriver.jsx";
import ManageUser from "./views/admin/manageuser/ManageUser.jsx";
import ManageBus from "./views/admin/managebus/ManageBus.jsx";
import ManageReplaceBus from "./views/admin/managereplacebus/ManageReplaceBus.jsx";
import ManageStoppage from "./views/admin/managestoppage/ManageStoppage.jsx";
import ManageNotifications from "./views/admin/notifications/ManageNotifications.jsx";
import SignIn from "./views/auth/SignIn.jsx";
import Advertisements from "./views/admin/advertisements/Advertisements.jsx";
import Enquires from "./views/admin/Enquires.jsx";
import { getUser } from "./config/authService.js";
import BusNotifications from "./views/admin/managebusnotifications/ManageBusNotifications.jsx";
import AttendanceManagement from "./pages/AttendanceManagement.jsx";
import { MdOutlineQrCode2 } from "react-icons/md";
import ManageAttendanceTakers from "./pages/ManageAttendanceTakers.jsx";
import { MdPeopleAlt } from "react-icons/md";
import MapSubscriptionAdmin from "./pages/MapSubscriptionAdmin.jsx";
import ManageHomepageContent from "./views/admin/managehomepage/ManageHomepageContent.jsx";
import { MdWeb } from "react-icons/md";


export default function routes() {
  const user = getUser();
  console.log("user", user);

  let isAdmin = null;

  if (user && user.isAdmin) {
    isAdmin = parseInt(user.isAdmin, 10);
    console.log("isAdmin", isAdmin);
  }

  const sidebarRoutes =
    isAdmin === 1
      ? [
          // Super Admin (can access everything)
          {
            name: "Admin Dashboard",
            layout: "/admin",
            path: "dashboard",
            icon: <MdHome className="h-6 w-6" />,
            component: <MainDashboard />,
          },
          {
            name: "Manage Institutes",
            layout: "/admin",
            path: "manage/institutes",
            icon: <MdSchool className="h-6 w-6" />,
            component: <ManageInstitute />,
          },
          {
            name: "Manage Admins",
            layout: "/admin",
            path: "manage/admins",
            icon: <MdPerson className="h-6 w-6" />,
            component: <ManageAdmin />,
          },
          {
            name: "Manage Routes",
            layout: "/admin",
            path: "manage/routes",
            icon: <MdMap className="h-6 w-6" />,
            component: <ManageRoute />,
          },
          {
            name: "Manage Stoppages",
            layout: "/admin",
            path: "manage/stoppages",
            icon: <MdMap className="h-6 w-6" />,
            component: <ManageStoppage />,
          },
          {
            name: "Manage Drivers",
            layout: "/admin",
            path: "manage/drivers",
            icon: <MdLocalTaxi className="h-6 w-6" />,
            component: <ManageDriver />,
          },
          {
            name: "Manage Buses",
            layout: "/admin",
            path: "manage/buses",
            icon: <MdBusAlert className="h-6 w-6" />,
            component: <ManageBus />,
          },
          {
            name: "Manage Users",
            layout: "/admin",
            path: "manage/users",
            icon: <MdGroupAdd className="h-6 w-6" />,
            component: <ManageUser />,
          },
        {
  name: "Manage Attendance-Takers",
  layout: "/admin",
  path: "manage/attendance-takers",
  icon: <MdPeopleAlt className="h-6 w-6" />,
  component: <ManageAttendanceTakers />,
},

          {
            name: "Replace Bus",
            layout: "/admin",
            path: "manage/replace/bus",
            icon: <MdBusAlert className="h-6 w-6" />,
            component: <ManageReplaceBus />,
          },
          {
            name: "Advertisements",
            layout: "/admin",
            path: "manage/advertisements",
            icon: <MdHome className="h-6 w-6" />,
            component: <Advertisements />,
          },
                    {
    name: "Attendance Management",
    layout: "/admin",
    path: "attendance",
    icon: <MdOutlineQrCode2 className="h-6 w-6" />,
    component: <AttendanceManagement/>,
  },
          {
            name: "Enquires",
            layout: "/admin",
            path: "enquiry",
            icon: <MdAddToQueue className="h-6 w-6" />,
            component: <Enquires />,
          },
          {
            name: "Notifications",
            layout: "/admin",
            path: "notifications",
            icon: <MdNotifications className="h-6 w-6" />,
            component: <ManageNotifications />,
          },
        {
  name: "Manage Homepage Content",
  layout: "/admin",
  path: "manage/homepage",
  icon: <MdWeb className="h-6 w-6" />,
  component: <ManageHomepageContent />,
},
                  {
  name: "Manage Map Access",
  layout: "/admin",
  path: "map-subscription",
  icon: <MdMap className="h-6 w-6" />,
  component: <MapSubscriptionAdmin />,
},
          {
            name: "My Profile",
            layout: "/admin",
            path: "profile",
            icon: <MdPerson className="h-6 w-6" />,
            component: <Profile />,
          },
        ]
      : isAdmin === 2
      ? [
          // Admin (limited access, no 'Manage Admin')
          {
            name: "Admin Dashboard",
            layout: "/admin",
            path: "dashboard",
            icon: <MdHome className="h-6 w-6" />,
            component: <SecondaryDashboard />,
          },
          {
            name: "Manage Institutes",
            layout: "/admin",
            path: "manage/institutes",
            icon: <MdSchool className="h-6 w-6" />,
            component: <InstituteLevelManagement />,
          },
          {
            name: "Manage Routes",
            layout: "/admin",
            path: "manage/routes",
            icon: <MdMap className="h-6 w-6" />,
            component: <ManageRoute />,
          },
          {
            name: "Manage Stoppages",
            layout: "/admin",
            path: "manage/stoppages",
            icon: <MdMap className="h-6 w-6" />,
            component: <ManageStoppage />,
          },
          {
            name: "Manage Drivers",
            layout: "/admin",
            path: "manage/drivers",
            icon: <MdLocalTaxi className="h-6 w-6" />,
            component: <ManageDriver />,
          },
          {
            name: "Manage Buses",
            layout: "/admin",
            path: "manage/buses",
            icon: <MdBusAlert className="h-6 w-6" />,
            component: <ManageBus />,
          },
          {
            name: "Manage Users",
            layout: "/admin",
            path: "manage/users",
            icon: <MdGroupAdd className="h-6 w-6" />,
            component: <ManageUser />,
          },
          {
            name: "Replace Bus",
            layout: "/admin",
            path: "manage/replace/bus",
            icon: <MdBusAlert className="h-6 w-6" />,
            component: <ManageReplaceBus />,
          },
          {
            name: "Bus Notifications",
            layout: "/admin",
            path: "manage/bus-notifications",
            icon: <MdNotifications className="h-6 w-6" />,
            component: < BusNotifications />,
          },
                    {
    name: "Attendance Management",
    layout: "/admin",
    path: "attendance",
    icon: <MdOutlineQrCode2 className="h-6 w-6" />,
    component: <AttendanceManagement/>,
  },
        {
  name: "Manage Attendance-Takers",
  layout: "/admin",
  path: "manage/attendance-takers",
  icon: <MdPeopleAlt className="h-6 w-6" />,
  component: <ManageAttendanceTakers />,
},

          {
            name: "My Profile",
            layout: "/admin",
            path: "profile",
            icon: <MdPerson className="h-6 w-6" />,
            component: <Profile />,
          },
        ]
      : [
          {
            name: "Login",
            layout: "/auth",
            path: "sign-in",
            icon: <MdPerson className="h-6 w-6" />,
            component: <SignIn />,
          },
        ];

  return sidebarRoutes;
}

