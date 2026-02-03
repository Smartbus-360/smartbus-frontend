import React from 'react';
import Navbar from "../../components/navbar/home-nav";
import { Outlet } from "react-router-dom";


export default function AuthLayout() {

  return (
    <div>
            <Navbar />
      <Outlet />
    </div>
  );
}



// export default HomeLayout;
