import { useSelector } from "react-redux";
import Loader from "./Loader";
import { Navigate } from "react-router-dom";

function ProtectedRoute({ children }) {
  const { user, loading } = useSelector((state) => state.auth);

  if (loading) return <Loader />;
  if (!user) return <Navigate to="/login" replace />;

  return children;
}
export default ProtectedRoute;
