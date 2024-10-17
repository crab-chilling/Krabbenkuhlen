import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import { isUserAuthenticated } from "../store/selectors/user.selectors";

const PrivateRoute = () => {
  const isAuthenticated = useSelector(isUserAuthenticated);
  if (!isAuthenticated) return <Navigate to="/login" />;
  return <Outlet />;
};

export default PrivateRoute;
