import { io } from "socket.io-client";

const socket = io(`${import.meta.env.VITE_API_BASE_URL}/notification`, {
  transports: ["websocket"],
  withCredentials: true,
});

// socket.on("newInstitute", (data) => {
//     console.log(data.message); // This will log the notification
// });

export { socket };
