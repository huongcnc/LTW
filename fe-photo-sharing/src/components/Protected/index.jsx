import { Navigate, Outlet } from "react-router-dom";

export default function Protected({checkLogin}) {
  return checkLogin ? (<Outlet />) : (<Navigate to="/login" replace />);
}
