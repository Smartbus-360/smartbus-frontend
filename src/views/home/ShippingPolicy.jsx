import React from "react";
import Navbar from "../../components/navbar/home";


const ShippingPolicy = () => {
  return (
    <div className="container mx-auto px-4 py-10 max-w-4xl">
      <h1 className="text-2xl font-semibold mb-4">Shipping Policy</h1>

      <p>
        SMARTBUS360 is a digital service. No physical products are shipped.
      </p>

      <p className="mt-3">
        Access to services is provided electronically via mobile application
        and web platform immediately after successful payment.
      </p>
    </div>
  );
};

export default ShippingPolicy;
