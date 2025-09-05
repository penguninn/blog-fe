import { ReactNode } from "react";
import { useKeycloakAuth } from "@/hooks/useKeycloak";

interface RoleGuardProps {
  anyOf?: string[];
  allOf?: string[];
  not?: string[];
  requireAuth?: boolean;
  fallback?: ReactNode;
  children: ReactNode;
}

const RoleGuard = ({
  anyOf = [],
  allOf = [],
  not = [],
  requireAuth = true,
  fallback = null,
  children,
}: RoleGuardProps) => {
  const { isAuthenticated, hasAnyRole, hasAllRoles } = useKeycloakAuth();

  if (requireAuth && !isAuthenticated) return fallback;
  if (anyOf.length > 0 && !hasAnyRole(anyOf)) return fallback;
  if (allOf.length > 0 && !hasAllRoles(allOf)) return fallback;
  if (not.length > 0 && not.some((r) => hasAnyRole([r]))) return fallback;
  return <>{children}</>;
};

export default RoleGuard;
