import { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import LoadingSpinner from "@/components/common/Loading/LoadingSpinner";
import { useKeycloakAuth } from "@/hooks/useKeycloak";

interface ProtectedRouteProps {
  children: ReactNode;
  roles?: string[];
  requireAuth?: boolean;
}

const ProtectedRoute = ({
  children,
  roles = [],
  requireAuth = true,
}: ProtectedRouteProps) => {
  const location = useLocation();
  const { isAuthenticated, isInitialized, hasAnyRole, login } =
    useKeycloakAuth();

  if (!isInitialized) {
    return <LoadingSpinner />;
  }

  if (requireAuth && !isAuthenticated) {
    login?.({ redirectUri: window.location.href });
    return <LoadingSpinner />;
  }

  if (roles.length > 0 && !hasAnyRole(roles)) {
    return <Navigate to="/unauthorized" replace state={{ from: location }} />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
