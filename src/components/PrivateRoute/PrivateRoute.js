import React from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const PrivateRoute = ({ children, role }) => {
  const { isAuthenticated } = useSelector((state) => state.auth);
  const user = JSON.parse(localStorage.getItem("user"));
  const userRole = user?.role;

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (role && userRole !== role) {
    return <Navigate to="/" />;
  }

  return children;
};

export default PrivateRoute;
