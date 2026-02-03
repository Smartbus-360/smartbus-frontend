import React from 'react';
import Navbar from "../../views/home/home-nav";
import { Outlet } from "react-router-dom";


export default function AuthLayout() {

  return (
    <div>
      <Outlet />
    </div>
  );
}



// export default HomeLayout;
