import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Loader from "./Loader";


function RootRedirect() {
  const { user, loading } = useSelector((state) => state.auth);

  if (loading) return <Loader />;

  return user ? (
    <Navigate to="/app" replace />
  ) : (
    <Navigate to="/login" replace />
  );
}


export default RootRedirect;