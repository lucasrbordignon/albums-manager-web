import { Outlet, Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import LogoutButton from "../components/LogoutButton";

export function PrivateLayout() {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  return (
    <div className="min-h-screen">
      <div className="w-full flex justify-end p-4">
        <LogoutButton />
      </div>
      <Outlet />
    </div>
  );
}
