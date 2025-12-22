import { useEffect, useState } from "react";
import axios from "axios";

export default function MapSubscription() {
  const query = new URLSearchParams(window.location.search);
  const studentId = query.get("studentId");

  const [plans, setPlans] = useState([]);
  const [planType, setPlanType] = useState("monthly");
  const [months, setMonths] = useState(1);
  const [txnId, setTxnId] = useState("");
  const [price, setPrice] = useState(0);
  const [loading, setLoading] = useState(false);
const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    axios.get("https://api.smartbus360.com/map/subscription/plans", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
      }
    }).then(res => {
      setPlans(res.data.plans);
    });
  }, []);

  useEffect(() => {
    const selected = plans.find(p => p.plan_type === planType);
    if (selected) {
      setPrice(selected.price_per_month * months);
    }
  }, [planType, months, plans]);

  
  const submitPayment = async () => {
    if (!txnId) {
      alert("Please enter transaction ID");
      return;
    }

    setLoading(true);
    try {
      await axios.post(
        "https://api.smartbus360.com/map/subscription/activate",
        {
          planType,
          months,
          txnId
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        }
      );

    //   alert("Subscription activated! You can return to the app.");
    alert(
  "Payment received successfully.\n" +
  "Map access is now active.\n\n" +
  "Please return to the app."
);
setSubmitted(true);

    } catch (err) {
      alert("Failed to activate subscription");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: "40px auto" }}>
      <h2>Map Access Subscription</h2>

      <label>Plan</label>
      <select value={planType} onChange={e => setPlanType(e.target.value)}>
        <option value="monthly">Monthly</option>
        <option value="yearly">Yearly</option>
      </select>

      <br /><br />

      <label>Number of Months</label>
      <input
        type="number"
        min="1"
        value={months}
        onChange={e => setMonths(Number(e.target.value))}
      />

      <h3>Total: ₹{price}</h3>

      <hr />

      <p><strong>Pay using UPI</strong></p>
      <p>UPI ID: <b>smartbus360@upi</b></p>

      <img
        src="/qr.png"
        alt="QR Code"
        style={{ width: 200 }}
      />

      <br /><br />

      <input
        placeholder="Enter Transaction ID"
        value={txnId}
        onChange={e => setTxnId(e.target.value)}
      />

      <br /><br />

      {/* <button onClick={submitPayment} disabled={loading}>
        {loading ? "Processing..." : "I Have Paid"}
      </button> */}
      <button onClick={submitPayment} disabled={loading || submitted}>
  {submitted ? "Activated" : "I Have Paid"}
</button>

    </div>
  );
}
