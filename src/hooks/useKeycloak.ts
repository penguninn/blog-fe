import { useKeycloak } from "@react-keycloak/web";
import { useMemo } from "react";
import type {
  KeycloakLoginOptions,
  KeycloakLogoutOptions,
  KeycloakRegisterOptions,
} from "keycloak-js";

export const useKeycloakAuth = () => {
  const { keycloak, initialized } = useKeycloak();

  const auth = useMemo(() => {
    type Token = {
      realm_access?: { roles?: string[] };
      resource_access?: Record<string, { roles?: string[] }>;
    } & Record<string, unknown>;
    const token = keycloak?.tokenParsed as Token | undefined;
    const realmRoles: string[] = token?.realm_access?.roles ?? [];
    const resourceRoles: string[] = token?.resource_access
      ? Object.values(token.resource_access).flatMap((r) => r.roles ?? [])
      : [];
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

      login: (options?: KeycloakLoginOptions) => keycloak?.login(options),
      logout: (options?: KeycloakLogoutOptions) => keycloak?.logout(options),
      register: (options?: KeycloakRegisterOptions) => keycloak?.register(options),
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
