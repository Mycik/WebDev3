import { Navigate } from "react-router-dom";
import { useEffect, type ReactNode } from "react";
import { useAuthStore } from "../../../store/useAuthStore";

const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const { user, loaded, fetchUser } = useAuthStore();

  useEffect(() => {
    if (!loaded) fetchUser();
  }, [loaded, fetchUser]);

  if (!loaded) return <p>Loading...</p>;
  if (!user) return <Navigate to="/auth" />;

  return children;
};

export default ProtectedRoute;
