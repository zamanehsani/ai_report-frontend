// PrivateRoute.js

import { Navigate, Outlet } from "react-router";
import { useStore } from "@/store/use-bears";

const PrivateRoute = () => {
  const isAuthenticated = useStore((state) => state.isAuthenticated);

  return isAuthenticated ? <Outlet /> : <Navigate to="/" replace />;
};

export default PrivateRoute;
