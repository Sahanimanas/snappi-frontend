import { Navigate } from "react-router-dom";

export const AdminProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("adminToken");
  
  if (!token) {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
};