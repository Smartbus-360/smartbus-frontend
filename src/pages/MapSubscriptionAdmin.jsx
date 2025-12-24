// import { useEffect, useState } from "react";
// import axios from "axios";

// export default function MapSubscriptionAdmin() {
//   const [subs, setSubs] = useState([]);
//   const token = localStorage.getItem("accessToken");

//   const fetchSubscriptions = async () => {
//   const res = await axios.get(
//     "http://localhost:3000/api/map/subscription/history",
//     {
//       headers: { Authorization: `Bearer ${token}` }
//     }
//   );
//   setSubs(res.data.subscriptions);
// };


//   useEffect(() => {
//     fetchSubscriptions();
//   }, []);

// //   const revoke = async (id) => {
// //     if (!window.confirm("Revoke this subscription?")) return;

// //     await axios.put(
// //       `https://api.smartbus360.com/admin/map-subscription/revoke/${id}`,
// //       {},
// //       { headers: { Authorization: `Bearer ${token}` } }
// //     );

// //     fetchSubscriptions();
// //   };
// const revoke = async (id) => {
//   if (!window.confirm("Revoke this subscription?")) return;

//   await axios.put(
//     `http://localhost:3000/api/map-subscription/revoke/${id}`,
//     {},
//     { headers: { Authorization: `Bearer ${token}` } }
//   );

//   fetchSubscriptions();
// };


//   return (
//     <div style={{ padding: 30 }}>
//       <h2>Map Subscriptions (Admin)</h2>

//       {subs.map(sub => (
//         <div
//           key={sub.id}
//           style={{
//             border: "1px solid #ccc",
//             padding: 10,
//             marginBottom: 10
//           }}
//         >
//           <p><b>Student:</b> {sub.student_id}</p>
//           <p><b>Plan:</b> {sub.plan_type}</p>
//           <p><b>Status:</b> {sub.status}</p>

//           {sub.status === "active" && (
//             <button
//               style={{ background: "red", color: "white" }}
//               onClick={() => revoke(sub.id)}
//             >
//               Revoke
//             </button>
//           )}
//         </div>
//       ))}
//     </div>
//   );
// }

import { useEffect, useState } from "react";
import axiosInstance from "../api/axios";

export default function MapSubscriptionAdmin() {
  const [subs, setSubs] = useState([]);
  const [plans, setPlans] = useState([]);

  const fetchSubscriptions = async () => {
    const res = await axiosInstance.get(
      "/map/subscription/history"
    );
    setSubs(res.data.subscriptions || []);
  };

  const fetchPlans = async () => {
    const res = await axiosInstance.get(
      "/map/subscription/plans"
    );
    setPlans(res.data.plans || []);
  };

  const revoke = async (id) => {
    if (!window.confirm("Revoke this subscription?")) return;

    await axiosInstance.put(
      `/admin/map-subscription/revoke/${id}`
    );

    fetchSubscriptions();
  };

  useEffect(() => {
    fetchSubscriptions();
    fetchPlans();
  }, []);

//   return (
//     <div style={{ padding: 24 }}>
//       <h2>Map Subscription Management</h2>

//       <h3>Available Plans</h3>
//       {plans.map((p, i) => (
//         <div key={i}>
//           {p.plan_type} – ₹{p.price_per_month}/month
//         </div>
//       ))}

//       <hr />

//       <h3>Subscription History</h3>
//       {subs.length === 0 && <p>No subscriptions found</p>}

//       {subs.map((sub) => (
//         <div key={sub.id} style={{ border: "1px solid #ddd", padding: 12 }}>
//           <p><b>Student ID:</b> {sub.student_id}</p>
//           <p><b>Plan:</b> {sub.plan_type}</p>
//           <p><b>Status:</b> {sub.status}</p>

//           {sub.status === "active" && (
//             <button
//               onClick={() => revoke(sub.id)}
//               style={{ background: "red", color: "#fff" }}
//             >
//               Revoke
//             </button>
//           )}
//         </div>
//       ))}
//     </div>
//   );
return (
  <div className="min-h-screen bg-gray-100 p-6">
    <div className="max-w-6xl mx-auto space-y-6">

      {/* Header */}
      <div className="bg-white rounded-xl shadow p-6">
        <h2 className="text-2xl font-semibold text-gray-800">
          Map Subscription Management
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          Admin panel to manage map subscription plans and student access
        </p>
      </div>

      {/* Plans */}
      <div className="bg-white rounded-xl shadow p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Available Plans
        </h3>

        {plans.length === 0 && (
          <p className="text-sm text-gray-500">No plans available</p>
        )}

        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
          {plans.map((p, i) => (
            <div
              key={i}
              className="border rounded-lg p-4 flex flex-col justify-between"
            >
              <p className="text-sm text-gray-500">Plan Type</p>
              <p className="text-lg font-medium capitalize text-gray-800">
                {p.plan_type}
              </p>

              <p className="mt-2 text-sm text-gray-500">Price</p>
              <p className="text-lg font-semibold text-blue-600">
                ₹{p.price_per_month} / month
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Subscriptions */}
      <div className="bg-white rounded-xl shadow p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Subscription History
        </h3>

        {subs.length === 0 && (
          <p className="text-sm text-gray-500">
            No subscriptions found
          </p>
        )}

        <div className="space-y-3">
          {subs.map((sub) => (
            <div
              key={sub.id}
              className="border rounded-lg p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
            >
              <div className="space-y-1">
                <p className="text-sm text-gray-500">
                  Student ID
                </p>
                <p className="font-medium text-gray-800">
                  {sub.student_id}
                </p>

                <p className="text-sm text-gray-500">
                  Plan
                </p>
                <p className="capitalize font-medium text-gray-800">
                  {sub.plan_type}
                </p>
              </div>

              <div className="flex items-center gap-4">
                <span
                  className={`px-3 py-1 text-sm rounded-full capitalize
                    ${
                      sub.status === "active"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                >
                  {sub.status}
                </span>

                {sub.status === "active" && (
                  <button
                    onClick={() => revoke(sub.id)}
                    className="bg-red-600 hover:bg-red-700 text-white text-sm px-4 py-2 rounded-md transition"
                  >
                    Revoke
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  </div>
);

}
