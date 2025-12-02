import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem("token"); // or any auth flag

  if (!isAuthenticated) {
    // If not logged in, redirect to login
    return <Navigate to="/" replace />;
  }

  return children; // If logged in, render the component
};

export default ProtectedRoute;
