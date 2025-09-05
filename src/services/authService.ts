import keycloak from "@/utils/keycloakConfig";

export const authService = {
  login: (options?: Parameters<typeof keycloak.login>[0]) =>
    keycloak.login(options as any),
  logout: (options?: Parameters<typeof keycloak.logout>[0]) =>
    keycloak.logout(options as any),
  account: () => keycloak.accountManagement(),
  refresh: (minValidity = 30) => keycloak.updateToken(minValidity),
  getToken: () => keycloak.token ?? null,
  isAuthenticated: () => Boolean(keycloak.authenticated),
};

export type AuthService = typeof authService;
