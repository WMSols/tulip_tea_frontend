import { Navigate, Outlet } from "react-router-dom";
import { useAppSelector } from "@/Redux/Hooks/hooks";

interface Props {
  allowedRoles?: string[];
}

export default function ProtectedRoute({ allowedRoles }: Props) {
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);
  console.log(isAuthenticated, user);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
