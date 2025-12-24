import { Navigate } from "react-router-dom";

export default function StudentPrivateRoute({ children }) {
  const token = localStorage.getItem("studentToken");
  return token ? children : <Navigate to="/student/login" replace />;
}
