import React from "react";
import { Navigate } from "react-router-dom";

// Protected route wrapper
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token"); // Get the token from localStorage

  // If there's no token, redirect to login
  if (!token) {
    return <Navigate to="/Login" />;
  }

  // Render children if authenticated
  return children;
};

export default ProtectedRoute;
