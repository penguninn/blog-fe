import { useKeycloak } from "@react-keycloak/web";
import { useMemo } from "react";

export const useKeycloakAuth = () => {
  const { keycloak, initialized } = useKeycloak();

  const auth = useMemo(() => {
    const token = keycloak?.tokenParsed as any | undefined;
    const realmRoles: string[] = Array.isArray(token?.realm_access?.roles)
      ? token.realm_access.roles
      : [];
    const resourceRoles: string[] = Object.values(
      token?.resource_access || {}
    ).flatMap((r: any) => r?.roles || []);
    const allRolesLower = new Set<string>(
      [...realmRoles, ...resourceRoles].map((r) => String(r).toLowerCase())
    );

    const hasRole = (role: string) => {
      if (!role) return false;
      return allRolesLower.has(role.toLowerCase());
    };

    const hasAnyRole = (roles: string[] = []) => roles.some((r) => hasRole(r));
    const hasAllRoles = (roles: string[] = []) =>
      roles.every((r) => hasRole(r));

    return {
      user: keycloak?.tokenParsed as Record<string, unknown> | undefined,
      isAuthenticated: !!keycloak?.authenticated,
      isInitialized: initialized,

      hasRole,
      hasAnyRole,
      hasAllRoles,
      hasResourceRole: (role: string, resource?: string) =>
        Boolean(keycloak?.hasResourceRole(role, resource)),

      login: (options?: unknown) => keycloak?.login(options as any),
      logout: (options?: unknown) => keycloak?.logout(options as any),
      register: (options?: unknown) => keycloak?.register(options as any),
      accountManagement: () => keycloak?.accountManagement(),

      token: keycloak?.token,
      refreshToken: keycloak?.refreshToken,
      updateToken: (minValidity = 30) => keycloak?.updateToken(minValidity),
      isTokenExpired: () => Boolean(keycloak?.isTokenExpired()),
      timeSkew: keycloak?.timeSkew,
    };
  }, [keycloak, initialized]);

  return auth;
};

export default useKeycloakAuth;
