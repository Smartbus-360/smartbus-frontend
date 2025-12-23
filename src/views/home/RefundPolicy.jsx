import React from "react";
import Navbar from "../../components/navbar/home";

const RefundPolicy = () => {
  return (
    <div className="container mx-auto px-4 py-10 max-w-4xl">
      <h1 className="text-2xl font-semibold mb-4">Cancellation & Refund Policy</h1>

      <p className="mb-3">
        SMARTBUS360 is a subscription-based digital service offering monthly plans
        ranging ₹20/user.
      </p>

      <p className="mb-3">
        Once a subscription is activated, cancellation is allowed, however refunds
        are provided only in cases of technical failure or duplicate payment.
      </p>

      <p className="mb-3">
        No refunds will be issued for partially used subscription periods.
      </p>

      <p className="mb-3">
        Approved refunds will be processed within <strong>7–10 working days</strong>
        to the original payment method.
      </p>
    </div>
  );
};

export default RefundPolicy;
