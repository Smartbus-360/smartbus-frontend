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
  const totalTime = 10;
  const [elapsedTime, setElapsedTime] = useState(0);
  const [currentStopIndex, setCurrentStopIndex] = useState(0);
  const [journeyComplete, setJourneyComplete] = useState(false);

  const [footerColorIndex, setFooterColorIndex] = useState(0);
  const flagColors = ["#ff9933", "#ffffff", "#138808"]; // Saffron, White, Green
const [showCompletionPopup, setShowCompletionPopup] = useState(false);

  // Cycle footer color
  useEffect(() => {
    const colorInterval = setInterval(() => {
      setFooterColorIndex((prevIndex) => (prevIndex + 1) % flagColors.length);
    }, 1000);
    return () => clearInterval(colorInterval);
  }, []);

  // Initialize the map
  useEffect(() => {
    if (mapRef.current) return;

      const map = L.map("map", { attributionControl: false }).setView(stops[0].coords, 13);


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
    marker.bindPopup(`<b>SmartBus360</b><br>${stops[0].name}<br>Bus #108`).openPopup();

    const route = L.polyline(stops.map((s) => s.coords), {
      color: "#ff9933",
      weight: 4,
      dashArray: "10, 10",
    }).addTo(map);

    map.fitBounds(route.getBounds());

    mapRef.current = map;
    markerRef.current = marker;
  }, []);

  // Animate the journey
useEffect(() => {
  if (journeyComplete) return;

  const interval = setInterval(() => {
    setElapsedTime((prev) => {
      const next = prev + 1;
      const stopIndex = Math.floor((next / totalTime) * stops.length);

      if (stopIndex < stops.length) {
        setCurrentStopIndex(stopIndex);
        const stop = stops[stopIndex];
        if (markerRef.current && mapRef.current) {
          markerRef.current.setLatLng(stop.coords);
          mapRef.current.panTo(stop.coords);
          markerRef.current
            .bindPopup(`<b>SmartBus360</b><br>${stop.name}<br>Bus #108`)
            .openPopup();
        }
      }

      if (next >= totalTime) {
        setJourneyComplete(true);
        setShowCompletionPopup(true);
        clearInterval(interval);

        // Wait 5 seconds then restart journey
        setTimeout(() => {
          setElapsedTime(0);
          setCurrentStopIndex(0);
          setJourneyComplete(false);
          setShowCompletionPopup(false);
        }, 5000);
      }

      return next;
    });
  }, 1000);

  return () => clearInterval(interval);
}, [journeyComplete]);

  return (
    <div
      style={{
        fontFamily: "Poppins, sans-serif",
        background: "linear-gradient(to right, #0a3d62, #092a45)",
        color: "#fff",
        minHeight: "100vh",
      }}
    >
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
      />

      {/* Alert Marquee */}
      <div
        style={{
          position: "relative",
          overflow: "hidden",
          backgroundColor: "#e74c3c",
          padding: "10px 0",
          textAlign: "left",
          fontWeight: "bold",
          color: "#fff",
          height: "40px",
        }}
      >
        <div
          style={{
            display: "inline-block",
            whiteSpace: "nowrap",
            animation: "marquee 12s linear infinite",
            paddingLeft: "100%",
            fontSize: "14px",
          }}
        >
          <span style={{ marginLeft: 20 }}>
            <i className="fas fa-exclamation-circle" style={{ marginRight: 8 }}></i>
            ATTENTION PARENTS: Please arrive at the stop 2 minutes before the bus arrives.This ensures smooth operations and prevents delays for the next stop. Thank you for your cooperation.
          </span>
        </div>
        <style>
          {`
          @keyframes marquee {
            0% { transform: translateX(0%); }
            100% { transform: translateX(-100%); }
          }
        `}
        </style>
      </div>

      {/* Main content */}
<div className="flex flex-col lg:flex-row h-auto lg:h-[calc(100vh-50px)] overflow-hidden">
        {/* Map */}
<div className="w-full lg:w-1/2 h-[300px] lg:h-full relative">
          <div
  id="map"
  className="w-full h-full rounded-xl shadow-2xl"
/>
        </div>

        {/* Stop Info Box */}
        {stops[currentStopIndex] && (
<div
  className="
    absolute
    bottom-4
    left-1/2
    -translate-x-1/2
    lg:left-4
    lg:translate-x-0
    w-[90%]
    lg:w-[400px]
    bg-[rgba(10,61,98,0.85)]
    rounded-xl
    p-4
    z-50
    shadow-xl
  "
>

            <h3>
              <i className="fas fa-map-marker-alt" style={{ marginRight: 10 }}></i> Upcoming Location
            </h3>
            <p>
              {journeyComplete ? (
                <span style={{ color: "lime", fontWeight: "bold" }}>Journey Complete</span>
              ) : (
                stops[currentStopIndex].name
              )}
            </p>
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 10 }}>
              <div>
                <div style={{ fontWeight: "bold", color: "#ff9933" }}>
                  {stops[currentStopIndex].distance}
                </div>
                <div>Distance</div>
              </div>
              <div>
                <div style={{ fontWeight: "bold", color: "#4caf50" }}>
                  {stops[currentStopIndex].eta}
                </div>
                <div>ETA</div>
              </div>
              <div>
                <div style={{ fontWeight: "bold" }}>108</div>
                <div>Bus No</div>
              </div>
            </div>
          </div>
        )}

        {/* Info Panel */}
<div className="w-full lg:w-1/2 flex flex-col gap-5 p-4">
          {/* Countdown Panel */}
<div className="bg-white/10 rounded-xl p-5">
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <i className="fas fa-bus" style={{ color: "#ff9933", fontSize: 30 }}></i>
              <h2 style={{ fontSize: 22, fontWeight: "bold" }}>Bus Arrival Information</h2>
            </div>
            <p style={{ marginTop: 10 }}>
              <i className="fas fa-users"></i> Parents can see estimated arrival time or view live bus
              status.
            </p>
            <div style={{ textAlign: "center", margin: "20px 0" }}>
              <div style={{ color: "#a0d2ff", textTransform: "uppercase", fontSize: 14 }}>
                Bus Arrives In
              </div>
              <div
                style={{
                  fontSize: 48,
                  background: "linear-gradient(to right, #ff9933, #4caf50)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  fontFamily: "'Orbitron', sans-serif",
                  fontWeight: "bold",
                }}
              >
                00:{Math.max(totalTime - elapsedTime, 0).toString().padStart(2, "0")}
              </div>
              <div style={{ color: "#a0d2ff", textTransform: "uppercase", fontSize: 14 }}>
                Seconds
              </div>
            </div>
            <div style={{ marginTop: 10 }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14 }}>
                <span>Start</span>
                <span>End</span>
              </div>
<div
  style={{
    position: "relative",
    height: 20,
    background: "#0a3d62",
    borderRadius: 10,
    overflow: "hidden",
    marginTop: 10,
  }}
>
  {/* The full timeline line (static) */}
  <div
    style={{
      position: "absolute",
      top: 8,
      left: 0,
      height: 4,
      width: "100%",
      background: "linear-gradient(to right, #ff9933, #4caf50)",
      borderRadius: 10,
    }}
  />

  {/* The moving bus */}
  <div
    style={{
      position: "absolute",
      top: 0,
      left: `calc(${(elapsedTime / totalTime) * 100}% - 20px)`,
      transition: "left 1s ease",
    }}
  >
    <img
      src="https://static.vecteezy.com/system/resources/thumbnails/034/467/980/small_2x/bus-city-bus-shuttle-bus-travel-company-bus-tourist-bus-passenger-bus-yellow-bus-transparent-background-ai-generated-png.png"
      alt="bus"
      style={{
        width: 40,
        height: 40,
        transform: "translateY(-8px)",
        filter: "drop-shadow(0 0 5px #ff9933)",
      }}
    />
  </div>
</div>
            </div>
          </div>

          {/* Status Panel */}
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

{showCompletionPopup && (
  <div style={{
    position: "fixed",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    background: "linear-gradient(to right, #0a3d62, #092a45)",
    padding: "30px 50px",
    borderRadius: "20px",
    boxShadow: "0 0 25px rgba(255, 153, 51, 0.6)",
    color: "#fff",
    textAlign: "center",
    zIndex: 9999,
    fontFamily: "'Poppins', sans-serif",
    border: "2px solid #ff9933",
    animation: "glowBorder 1.5s ease-in-out infinite alternate"
  }}>
    <div style={{ fontSize: "30px", marginBottom: "15px", color: "#4caf50" }}>
      🚌
    </div>
    <div style={{
      fontSize: "20px",
      fontWeight: "bold",
      marginBottom: "10px"
    }}>
      Journey Complete!
    </div>
    <div style={{
      fontSize: "16px",
      color: "#a0d2ff"
    }}>
      Bus has reached the final stop.<br />
      Restarting in 5 seconds...
    </div>

    <style>
      {`
        @keyframes glowBorder {
          from {
            box-shadow: 0 0 25px rgba(255, 153, 51, 0.6);
          }
          to {
            box-shadow: 0 0 35px rgba(76, 175, 80, 0.8);
          }
        }
      `}
    </style>
  </div>
)}

      {/* Footer */}
      <footer
        style={{
          backgroundColor: flagColors[footerColorIndex],
          color: "#000",
          textAlign: "center",
          padding: "12px",
          fontSize: "14px",
          fontWeight: "500",
          borderTop: "2px solid #fff",
          marginTop: "20px",
          transition: "background-color 0.5s ease",
        }}
      >
        © 2023 - 2025 SMART BUS 360. Student transportation with real-time tracking and
        AI-powered analytics.
      </footer>
    </div>
  );
}

export default HeroSection;
