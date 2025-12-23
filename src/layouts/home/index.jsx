// import React from 'react';
// import { Outlet } from "react-router-dom";


// export default function AuthLayout() {

//   return (
//     <div>
//       <Outlet />
//     </div>
//   );
// }

import { Outlet } from "react-router-dom";
import Navbar from "../../components/navbar/home";
import Footer from "../../components/footer/Footer";

function HomeLayout() {
  return (
    <>
      <Navbar />

      {/* ✅ THIS WAS MISSING */}
      <Outlet />

      <Footer />
    </>
  );
}

export default HomeLayout;
