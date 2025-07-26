// import React from "react";
// import landingImg from "../../assets/img/smartbusapp.jpeg";
// import { FaAndroid, FaApple } from "react-icons/fa";

// function HeroSection() {
//   return (
//     <div className="min-h-screen bg-gray-100 text-gray-900">
//       {/* Hero Section */}
//       <div className="max-w-7xl mx-auto flex flex-col items-center justify-between py-14 lg:flex-row lg:py-20">
//         {/* Left side: Text Content */}
//         <div className="mb-12 w-full text-center lg:mb-0 lg:w-[60%] lg:px-8 lg:text-left px-3">
//           <h1 className="mb-6 text-4xl font-extrabold leading-tight lg:text-5xl">
//             <span className="text-blue-600">Smart Bus 360</span>
//             {" "}India&apos;s 1st Mobile-Based Navigation Technology for Institutes
//           </h1>
//           {/* <h2 className="mb-6 text-xl font-extrabold leading-tight lg:text-3xl">
//             Revolutionize Your Travel with{" "}
//             <span className="text-yellow-400">Smart Bus 360</span>
//           </h2> */}
//           <p className="mb-6 text-lg text-gray-800 lg:text-xl">
//             Our app helps you navigate bus routes, track buses in real-time, and
//             plan your journey more effectively. Join us now and take control of
//             your travel experience.
//           </p>
//           <div className="flex justify-center space-x-8 lg:justify-start">
//             <a
//               href="https://play.google.com/store/apps/details?id=com.smartbus360.app" target="_blank"
//               className="flex items-center rounded-lg bg-green-500 px-6 py-3 text-white transition-all duration-300 hover:bg-green-600" rel="noreferrer"
//             >
//               <FaAndroid className="mr-3 text-2xl" />
//               <span>Get it on Android</span>
//             </a>
//             <a
//               href="https://play.google.com/store/apps/details?id=com.smartbus360.app" target="_blank"
//               className="bg-black flex items-center rounded-lg px-6 py-3 text-gray-700 transition-all duration-300 hover:bg-gray-800 hover:text-white" rel="noreferrer"
//             >
//               <FaApple className="mr-3 text-2xl" />
//               <span>Download on iOS</span>
//             </a>
//           </div>
//         </div>

//         {/* Right side: App Home Screen Image */}
//         <div className="w-full text-center lg:w-[40%] lg:text-left">
//           <img
//             src={landingImg}
//             alt="Smart Bus 360 App Screenshot"
//             className="mx-auto w-full max-w-xs transform rounded-lg shadow-xl transition-all duration-300 hover:scale-105 lg:max-w-sm"
//           />
//         </div>
//       </div>
//     </div>
//   );
// }

// export default HeroSection;



import React, { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const stops = [
  { coords: [12.9784, 77.6408], name: "Koramangala Stop", distance: "7.2 km", eta: "14 min" },
  { coords: [12.9716, 77.5946], name: "MG Road Stop", distance: "6.5 km", eta: "13 min" },
  { coords: [12.9758, 77.5765], name: "Shivajinagar Stop", distance: "5.8 km", eta: "12 min" },
  { coords: [12.9665, 77.5877], name: "Richmond Town Stop", distance: "4.9 km", eta: "10 min" },
  { coords: [12.9498, 77.6434], name: "HSR Layout Stop", distance: "4.1 km", eta: "8 min" },
  { coords: [12.9255, 77.5468], name: "Rajajinagar Stop", distance: "3.5 km", eta: "7 min" },
  { coords: [12.9141, 77.6846], name: "Marathahalli Stop", distance: "2.8 km", eta: "6 min" },
  { coords: [12.9698, 77.75], name: "Whitefield Stop", distance: "0.0 km", eta: "0 min" },
];

function HeroSection() {
  const mapRef = useRef(null);
  const markerRef = useRef(null);
  const [currentStopIndex, setCurrentStopIndex] = useState(0);
  const [etaCountdown, setEtaCountdown] = useState(20);

  useEffect(() => {
    if (mapRef.current) return; // Prevent reinitialization
    setTimeout(() => {
  map.invalidateSize();
}, 0);


const map = L.map("map").setView(stops[0].coords, 13);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "",
      maxZoom: 19,
    }).addTo(map);

    const busIcon = L.icon({
      iconUrl:
        "https://static.vecteezy.com/system/resources/thumbnails/034/467/980/small_2x/bus-city-bus-shuttle-bus-travel-company-bus-tourist-bus-passenger-bus-yellow-bus-transparent-background-ai-generated-png.png",
      iconSize: [66, 66],
      iconAnchor: [22, 22],
    });

    const marker = L.marker(stops[0].coords, { icon: busIcon }).addTo(map);
    marker.bindPopup("<b>SmartBus360</b><br>Bus #108").openPopup();

    mapRef.current = map;
    markerRef.current = marker;

    const route = L.polyline(stops.map((s) => s.coords), {
      color: "#ff9933",
      weight: 4,
      dashArray: "10, 10",
    }).addTo(map);

    map.fitBounds(route.getBounds());
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setEtaCountdown((prev) => {
        if (prev <= 1) {
          moveToNextStop();
          return 20;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [currentStopIndex]);

  const moveToNextStop = () => {
    const nextIndex = (currentStopIndex + 1) % stops.length;
    const stop = stops[nextIndex];

    if (markerRef.current && mapRef.current) {
          const stop = stops[nextIndex];
      markerRef.current.setLatLng(stop.coords);
      mapRef.current.panTo(stop.coords);
    markerRef.current.bindPopup(`<b>SmartBus360</b><br>${stop.name}<br>Bus #108`).openPopup();
    }

    setCurrentStopIndex(nextIndex);
  };

  return (
    <div style={{ fontFamily: "Poppins, sans-serif", background: "linear-gradient(to right, #0a3d62, #092a45)", color: "#fff", minHeight: "100vh" }}>
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
      />
<div style={{
  position: "relative",
  overflow: "hidden",
  backgroundColor: "#e74c3c",
  padding: "10px 0",
  textAlign: "left",
  fontWeight: "bold",
  color: "#fff",
  height: "40px"
}}>
  <div style={{
    display: "inline-block",
    whiteSpace: "nowrap",
    animation: "marquee 12s linear infinite",
    paddingLeft: "100%",
    transform: "translateX(0)",
    willChange: "transform",
    fontSize: "14px"
  }}>
    <span style={{ marginLeft: 20 }}>
      <i className="fas fa-exclamation-circle" style={{ marginRight: 8 }}></i>
      ATTENTION PARENTS: Please arrive at the stop 2 minutes before the bus arrives.
    </span>
  </div>

  {/* Embedded keyframes */}
  <style>
    {`
      @keyframes marquee {
        0% { transform: translateX(0%); }
        100% { transform: translateX(-100%); }
      }
    `}
  </style>
</div>

   <div style={{
  display: "flex",
  height: "calc(100vh - 50px)", // Adjust for header/alert height
  overflow: "hidden"
}}>
     {/* Map Section */}
<div style={{ width: "50%", height: "100%", position: "relative" }}>
  <div id="map" style={{ width: "100%", height: "100%", borderRadius: "15px", boxShadow: "0 20px 50px rgba(0,0,0,0.3)", minHeight: "100%" }} />

  {/* Floating info box rendered OUTSIDE map div */}
</div>

{/* Render this OUTSIDE the map container */}
{stops[currentStopIndex] && (
  <div style={{
    position: "absolute",
    bottom: 40,
    left: 40,
    background: "rgba(10, 61, 98, 0.85)",
    borderRadius: 15,
    padding: 15,
    zIndex: 9999,
    maxWidth: "400px",
    boxShadow: "0 0 20px rgba(0,0,0,0.3)"
  }}>
    <h3><i className="fas fa-map-marker-alt" style={{ marginRight: 10 }}></i> Upcoming Location</h3>
    <p>{stops[currentStopIndex].name}</p>
    <div style={{ display: "flex", justifyContent: "space-between", marginTop: 10 }}>
      <div>
        <div style={{ fontWeight: "bold", color: "#ff9933" }}>{stops[currentStopIndex].distance}</div>
        <div>Distance</div>
      </div>
      <div>
        <div style={{ fontWeight: "bold", color: "#4caf50" }}>{stops[currentStopIndex].eta}</div>
        <div>ETA</div>
      </div>
      <div>
        <div style={{ fontWeight: "bold" }}>108</div>
        <div>Bus No</div>
      </div>
    </div>
  </div>
)}


        {/* Info Section */}
        <div style={{ flex: "1 1 500px", display: "flex", flexDirection: "column", gap: "20px" }}>
          <div style={{ background: "rgba(255,255,255,0.1)", borderRadius: 15, padding: 20 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <i className="fas fa-bus" style={{ color: "#ff9933", fontSize: 30 }}></i>
              <h2 style={{ fontSize: 22, fontWeight: "bold" }}>Bus Arrival Information</h2>
            </div>
            <p style={{ marginTop: 10 }}>
              <i className="fas fa-users"></i> Parents can see estimated arrival time or view live bus status.
            </p>
            <div style={{ textAlign: "center", margin: "20px 0" }}>
              <div style={{ color: "#a0d2ff", textTransform: "uppercase", fontSize: 14 }}>Bus Arrives In</div>
              <div style={{
                fontSize: 48,
                background: "linear-gradient(to right, #ff9933, #4caf50)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                fontFamily: "'Orbitron', sans-serif",
                fontWeight: "bold"
              }}>
                00:{etaCountdown.toString().padStart(2, "0")}
              </div>
              <div style={{ color: "#a0d2ff", textTransform: "uppercase", fontSize: 14 }}>Seconds</div>
            </div>
            <div style={{ marginTop: 10 }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14 }}>
                <span>Previous Stop</span>
                <span>Your Stop</span>
              </div>
              <div style={{ height: 10, background: "#0a3d62", borderRadius: 10, overflow: "hidden", marginTop: 5 }}>
                <div
                  style={{
                    height: "100%",
                    background: "linear-gradient(to right, #ff9933, #4caf50)",
                    width: `${((20 - etaCountdown) / 20) * 100}%`,
                    transition: "width 1s ease"
                  }}
                />
              </div>
            </div>
          </div>

          <div style={{ background: "rgba(255,255,255,0.1)", borderRadius: 15, padding: 20 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <i className="fas fa-info-circle" style={{ color: "#ff9933", fontSize: 30 }}></i>
              <h2 style={{ fontSize: 22, fontWeight: "bold" }}>Bus Status</h2>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 20 }}>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontWeight: "bold", color: "lime" }}>Online</div>
                <div>Bus Driver</div>
              </div>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontWeight: "bold", color: "lime" }}>On Time</div>
                <div>Status</div>
              </div>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontWeight: "bold", color: "lime" }}>32 Students</div>
                <div>Capacity</div>
              </div>
            </div>
          </div>
        </div>
      </div>
            {/* 🔻 Footer added here */}
      <footer style={{
        backgroundColor: "#ff9933",
        color: "#fff",
        textAlign: "center",
        padding: "12px",
        fontSize: "14px",
        fontWeight: "500",
        borderTop: "2px solid #fff",
        marginTop: "40px"
      }}>
        © 2023 SMART BUS 360. Revolutionizing student transportation with real-time tracking and AI-powered analytics.
      </footer>
    
    </div>
  );
}

export default HeroSection;
