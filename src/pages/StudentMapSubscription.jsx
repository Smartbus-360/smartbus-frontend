// import { useEffect, useState } from "react";
// import axios from "axios";

// export default function MapSubscription() {
//   const query = new URLSearchParams(window.location.search);
//   const studentId = query.get("studentId");

//   const [plans, setPlans] = useState([]);
//   const [planType, setPlanType] = useState("monthly");
//   const [months, setMonths] = useState(1);
//   const [txnId, setTxnId] = useState("");
//   const [price, setPrice] = useState(0);
//   const [loading, setLoading] = useState(false);
// const [submitted, setSubmitted] = useState(false);

//   useEffect(() => {
//     axios.get("http://localhost:3000/map/subscription/plans", {
//       headers: {
//         Authorization: `Bearer ${localStorage.getItem("token")}`
//       }
//     }).then(res => {
//       setPlans(res.data.plans);
//     });
//   }, []);

//   useEffect(() => {
//     const selected = plans.find(p => p.plan_type === planType);
//     if (selected) {
//       setPrice(selected.price_per_month * months);
//     }
//   }, [planType, months, plans]);

  
//   const submitPayment = async () => {
//     if (!txnId) {
//       alert("Please enter transaction ID");
//       return;
//     }

//     setLoading(true);
//     try {
//       await axios.post(
//         "http://localhost:3000/map/subscription/activate",
//         {
//           planType,
//           months,
//           txnId
//         },
//         {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem("token")}`
//           }
//         }
//       );

//     //   alert("Subscription activated! You can return to the app.");
//     alert(
//   "Payment received successfully.\n" +
//   "Map access is now active.\n\n" +
//   "Please return to the app."
// );
// setSubmitted(true);

//     } catch (err) {
//       alert("Failed to activate subscription");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div style={{ maxWidth: 400, margin: "40px auto" }}>
//       <h2>Map Access Subscription</h2>

//       <label>Plan</label>
//       <select value={planType} onChange={e => setPlanType(e.target.value)}>
//         <option value="monthly">Monthly</option>
//         <option value="yearly">Yearly</option>
//       </select>

//       <br /><br />

//       <label>Number of Months</label>
//       <input
//         type="number"
//         min="1"
//         value={months}
//         onChange={e => setMonths(Number(e.target.value))}
//       />

//       <h3>Total: ₹{price}</h3>

//       <hr />

//       <p><strong>Pay using UPI</strong></p>
//       <p>UPI ID: <b>smartbus360@upi</b></p>

//       <img
//         src="/qr.png"
//         alt="QR Code"
//         style={{ width: 200 }}
//       />

//       <br /><br />

//       <input
//         placeholder="Enter Transaction ID"
//         value={txnId}
//         onChange={e => setTxnId(e.target.value)}
//       />

//       <br /><br />

//       {/* <button onClick={submitPayment} disabled={loading}>
//         {loading ? "Processing..." : "I Have Paid"}
//       </button> */}
//       <button onClick={submitPayment} disabled={loading || submitted}>
//   {submitted ? "Activated" : "I Have Paid"}
// </button>

//     </div>
//   );
// }

import { useEffect, useState } from "react";
import axios from "../api/studentAxios";
import jsPDF from "jspdf";
import { useNavigate } from "react-router-dom";

export default function StudentMapSubscription() {
    const navigate = useNavigate();   // 👈 ADD THIS
  const token = localStorage.getItem("studentToken");

  const [access, setAccess] = useState(null);
  const [plans, setPlans] = useState([]);
  const [subscriptions, setSubscriptions] = useState([]);

  const [planType, setPlanType] = useState("monthly");
  const [months, setMonths] = useState(1);
  // const [txnId, setTxnId] = useState("");
  const [loading, setLoading] = useState(false);
const [showSuccess, setShowSuccess] = useState(false);
const [showError, setShowError] = useState(false);
const [errorMsg, setErrorMsg] = useState("");
const [autoPay, setAutoPay] = useState(false);

  const authHeader = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const loadRazorpay = () => {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
    } else {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    }
  });
};

  // 1️⃣ Access check
  const checkAccess = async () => {
    try {
      const res = await axios.get(
        "https://api.smartbus360.com/api/map/access-check",
        authHeader
      );
      setAccess(res.data);
    } catch (err) {
      setAccess({ allowed: false });
    }
  };

  // 2️⃣ Plans
  const fetchPlans = async () => {
    const res = await axios.get(
      "https://api.smartbus360.com/api/map/subscription/plans",
      authHeader
    );
    setPlans(res.data.plans || []);
  };

  // 3️⃣ History
  const fetchHistory = async () => {
    const res = await axios.get(
      "https://api.smartbus360.com/api/map/subscription/history",
      authHeader
    );
    setSubscriptions(res.data.subscriptions || []);
  };

  const downloadReceipt = async (subscriptionId) => {
  try {
    const res = await axios.get(
      `https://api.smartbus360.com/api/payment/receipt/${subscriptionId}`,
      authHeader
    );

    const r = res.data.receipt;
    const doc = new jsPDF();

    doc.setFontSize(16);
    doc.text("SmartBus360 – Payment Receipt", 20, 20);

    doc.setFontSize(12);
    doc.text(`Receipt No: ${r.receiptNo}`, 20, 35);
    doc.text(`Payment ID: ${r.paymentId}`, 20, 45);
    doc.text(`Amount Paid: ₹${r.amount}`, 20, 55);

    doc.text(`Plan: ${r.planType}`, 20, 70);
    doc.text(`Months: ${r.months}`, 20, 80);
    doc.text(`Valid From: ${r.startDate}`, 20, 90);
    doc.text(`Valid Till: ${r.endDate}`, 20, 100);

    doc.text(`Paid On: ${new Date(r.paidOn).toLocaleString()}`, 20, 115);

    doc.text(
      "This is a system-generated receipt. No signature required.",
      20,
      135
    );

    doc.save(`SmartBus360_Receipt_${r.receiptNo}.pdf`);

  } catch (err) {
    setErrorMsg("Unable to download receipt");
    setShowError(true);
  }
};

  // 4️⃣ Activate
  // const activate = async () => {
  //   if (!txnId) {
  //     alert("Enter transaction ID");
  //     return;
  //   }

  //   setLoading(true);
  //   try {
  //     await axios.post(
  //       "http://localhost:3000/api/map/subscription/activate",
  //       { planType, months, txnId },
  //       authHeader
  //     );

  //     alert("Map access activated successfully");
  //     await checkAccess();
  //     await fetchHistory();
  //   } catch (err) {
  //     alert("Activation failed");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

//   const activate = async () => {
//   setLoading(true);

//   try {
//     // 1️⃣ Load Razorpay
//     const loaded = await loadRazorpay();
//     if (!loaded) {
//       alert("Razorpay SDK failed to load");
//       return;
//     }
// if (planType === "yearly" && autoPay) {
//       await startAutoPay();
//       return;
//     }


    
//     // 2️⃣ Create order
//     const orderRes = await axios.post(
//       "http://localhost:3000/api/payment/create-order",
//       { planType, months },
//       authHeader
//     );
    

//     const { orderId, amount, key } = orderRes.data;

//     // 3️⃣ Open Razorpay Checkout
//     const options = {
//       key,
//       amount,
//       currency: "INR",
//       name: "SmartBus360",
//       description: "Map Subscription",
//       order_id: orderId,

//       handler: async function (response) {
//         try {
//           // 4️⃣ Verify payment & activate subscription
//           await axios.post(
//             "http://localhost:3000/api/payment/verify-map-subscription",
//             {
//               razorpay_order_id: response.razorpay_order_id,
//               razorpay_payment_id: response.razorpay_payment_id,
//               razorpay_signature: response.razorpay_signature,
//               planType,
//               months
//             },
//             authHeader
//           );

//           // alert("Payment successful. Map access activated.");
//           // await checkAccess();
//           // await fetchHistory();
//           setShowSuccess(true);
// await checkAccess();
// await fetchHistory();


//         } catch (err) {
// setErrorMsg("Payment verification failed. If money was deducted, please contact support.");
// setShowError(true);
//         }
//       },

//       theme: { color: "#2563eb" }
//     };

//     const rzp = new window.Razorpay(options);
//     rzp.open();

//   } catch (err) {
// setErrorMsg("Unable to start payment. Please try again.");
// setShowError(true);
//   } finally {
//     setLoading(false);
//   }
// };

//   useEffect(() => {
//     checkAccess();
//     fetchPlans();
//     fetchHistory();
//   }, []);

const activate = async () => {
  setLoading(true);

  try {
    const loaded = await loadRazorpay();
    if (!loaded) throw new Error("Razorpay failed");

    // 🔥 AUTOPAY FLOW (yearly + checkbox)
    // if (planType === "yearly" && autoPay) {
    if (autoPay) {
      await startAutoPay();
      return;
    }

    // ✅ NORMAL ONE-TIME PAYMENT FLOW
    await startOneTimePayment();

  } catch (err) {
    setErrorMsg("Unable to start payment");
    setShowError(true);
  } finally {
    setLoading(false);
  }
};
const startOneTimePayment = async () => {
  const orderRes = await axios.post(
    "https://api.smartbus360.com/api/payment/create-order",
    { planType, months },
    authHeader
  );

  const { orderId, amount, key } = orderRes.data;

  const options = {
    key,
    amount,
    currency: "INR",
    order_id: orderId,
    name: "SmartBus360",
    description: "Map Subscription",

    handler: async (response) => {
      await axios.post(
        "https://api.smartbus360.com/api/payment/verify-map-subscription",
        {
          razorpay_order_id: response.razorpay_order_id,
          razorpay_payment_id: response.razorpay_payment_id,
          razorpay_signature: response.razorpay_signature,
          planType,
          months
        },
        authHeader
      );

      setShowSuccess(true);
      await checkAccess();
      await fetchHistory();
    }
  };

  new window.Razorpay(options).open();
};
const startAutoPay = async () => {
  const res = await axios.post(
    "https://api.smartbus360.com/api/payment/create-autopay-subscription",
    { planType },
    authHeader
  );

  const { subscriptionId, key } = res.data;

  const options = {
    key,
    subscription_id: subscriptionId,
    name: "SmartBus360",
    // description: "Yearly Map AutoPay",
    description:
      planType === "yearly"
        ? "Yearly Map AutoPay"
        : "Monthly Map AutoPay",

    handler: async (response) => {
      await axios.post(
        "https://api.smartbus360.com/api/payment/verify-autopay",
        response,
        authHeader
      );

      setShowSuccess(true);
      await checkAccess();
      await fetchHistory();
    }
  };

  new window.Razorpay(options).open();
};
const handleLogout = () => {
  // 🔐 Clear student auth data
  localStorage.removeItem("studentToken");
  localStorage.removeItem("studentId");
  localStorage.removeItem("studentName");
  localStorage.removeItem("studentEmail");

  // 🚀 Redirect to login
  navigate("/student/login");   // or "/student/login" based on your router
};

  // return (
  //   <div style={{ maxWidth: 420, margin: "40px auto" }}>
  //     <h2>Student Map Subscription</h2>

  //     {access?.allowed ? (
  //       <>
  //         <p>✅ Map access active</p>
  //         <p>Expires on: {access.expiresOn}</p>
  //       </>
  //     ) : (
  //       <>
  //         <h3>Subscribe to Map</h3>

  //         <select value={planType} onChange={(e) => setPlanType(e.target.value)}>
  //           <option value="monthly">Monthly</option>
  //           <option value="yearly">Yearly</option>
  //         </select>

  //         <br /><br />

  //         <input
  //           type="number"
  //           min="1"
  //           value={months}
  //           onChange={(e) => setMonths(Number(e.target.value))}
  //         />

  //         <br /><br />

  //         <input
  //           placeholder="Transaction ID"
  //           value={txnId}
  //           onChange={(e) => setTxnId(e.target.value)}
  //         />

  //         <br /><br />

  //         <button onClick={activate} disabled={loading}>
  //           {loading ? "Processing..." : "I Have Paid"}
  //         </button>
  //       </>
  //     )}

  //     <hr />

  //     <h3>Subscription History</h3>
  //     {subscriptions.map((s) => (
  //       <div key={s.id} style={{ border: "1px solid #ccc", padding: 8 }}>
  //         <p>{s.plan_type} – {s.status}</p>
  //         <p>{s.start_date} → {s.end_date}</p>
  //       </div>
  //     ))}
  //   </div>
  // );
  return (
  <div className="min-h-screen bg-gray-100 py-10 px-4">
    <div className="max-w-xl mx-auto bg-white rounded-xl shadow-md p-6">

      {/* Header */}
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">
        Student Map Subscription
      </h2>

      {/* Access Status */}
      {access?.allowed ? (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6 flex justify-between items-center">
          <div>
            <p className="text-sm text-gray-600">Status</p>
            <p className="text-lg font-medium text-green-700 flex items-center gap-2">
              <span className="w-2.5 h-2.5 bg-green-500 rounded-full"></span>
              Map access active
            </p>
          </div>

          <div className="text-right">
            <p className="text-sm text-gray-600">Expires on</p>
            <p className="font-semibold text-gray-800">
              {access.expiresOn}
            </p>
          </div>
        </div>
      ) : (
        <>
          {/* Subscription Form */}
          <div className="border rounded-lg p-4 mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Subscribe to Map Access
            </h3>

            <div className="space-y-4">

              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  Plan Type
                </label>
                {/* <select
                  value={planType}
                  onChange={(e) => setPlanType(e.target.value)}
                  className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                > */}
                <select
  value={planType}
  onChange={(e) => {
    const value = e.target.value;
    setPlanType(value);

    // 🔥 THIS IS THE KEY LINE
    if (value === "yearly") {
      setMonths(12);
    } else {
      setMonths(1);
    }
  }}
  className="w-full border rounded-md px-3 py-2"
>

                  <option value="monthly">Monthly</option>
                  <option value="yearly">Yearly</option>
                </select>
              </div>
<div>
  {/* {planType === "yearly" && (
  <label className="flex items-center gap-2 text-sm text-gray-700">
    <input
      type="checkbox"
      checked={autoPay}
      onChange={(e) => setAutoPay(e.target.checked)}
    />
    Enable AutoPay (recommended)
  </label>
)} */}
<label className="flex items-center gap-2 text-sm text-gray-700">
  <input
    type="checkbox"
    checked={autoPay}
    onChange={(e) => setAutoPay(e.target.checked)}
  />
  Enable AutoPay
</label>

{autoPay && (
  <p className="text-xs text-gray-500 mt-1">
    {planType === "yearly"
      ? "₹20 will be charged monthly for 12 months"
      : "₹20 will be charged every month until cancelled"}
  </p>
)}


</div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  Number of Months
                </label>
                {/* <input
                  type="number"
                  min="1"
                  value={months}
                  onChange={(e) => setMonths(Number(e.target.value))}
                  className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                /> */}
                <input
  type="number"
  min="1"
  value={months}
  disabled={planType === "yearly"}   // 🔒 lock for yearly
  onChange={(e) => setMonths(Number(e.target.value))}
  className="w-full border rounded-md px-3 py-2"
/>

              </div>

              {/* <div>
                <label className="block text-sm text-gray-600 mb-1">
                  Transaction ID
                </label>
                <input
                  placeholder="Enter transaction ID"
                  value={txnId}
                  onChange={(e) => setTxnId(e.target.value)}
                  className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div> */}

              <button
                onClick={activate}
                disabled={loading}
                className={`w-full py-2 rounded-md text-white font-medium transition
                  ${loading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700"
                  }`}
              >
                {loading ? "Processing..." : "Pay & Activate"}
              </button>

            </div>
          </div>
        </>
      )}

      {/* Subscription History */}
      <h3 className="text-lg font-semibold text-gray-800 mb-3">
        Subscription History
      </h3>

      <div className="space-y-3">
        {subscriptions.length === 0 && (
          <p className="text-sm text-gray-500">
            No subscription history found
          </p>
        )}

        {subscriptions.map((s) => (
          <div
            key={s.id}
            className="border rounded-lg p-4 flex justify-between items-center"
          >
            <div>
              <p className="font-medium text-gray-800 capitalize">
                {s.plan_type} Plan
              </p>
              <p className="text-sm text-gray-500">
                {s.start_date} → {s.end_date}
              </p>
            </div>

            <span
              className={`px-3 py-1 text-sm rounded-full capitalize
                ${s.status === "active" &&(
                  <button
      onClick={() => downloadReceipt(s.id)}
      className="mt-2 text-sm text-blue-600 hover:underline"
    >
      Download Receipt
    </button>

                )
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
                }`}
            >
              {s.status}
            </span>
          </div>
        ))}
      </div>

    </div>
    {/* ✅ Success Modal */}
{showSuccess && (
  <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
    <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-sm text-center">
      <div className="text-green-600 text-4xl mb-3">✅</div>

      <h3 className="text-lg font-semibold text-gray-800 mb-2">
        Payment Successful
      </h3>

      <p className="text-sm text-gray-600 mb-5">
        Your map subscription is now active.
      </p>

      <button
        onClick={() => setShowSuccess(false)}
        className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-md"
      >
        OK
      </button>
    </div>
  </div>
)}
{/* ❌ Error Modal */}
{showError && (
  <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
    <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-sm text-center">
      <div className="text-red-600 text-4xl mb-3">❌</div>

      <h3 className="text-lg font-semibold text-gray-800 mb-2">
        Payment Failed
      </h3>

      <p className="text-sm text-gray-600 mb-5">
        {errorMsg}
      </p>

      <button
        onClick={() => setShowError(false)}
        className="w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded-md"
      >
        Close
      </button>
    </div>
  </div>
)}

  </div>
);

}
