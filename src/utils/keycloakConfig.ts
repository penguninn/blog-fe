import Keycloak from "keycloak-js";

const keycloakConfig = {
  url: import.meta.env.VITE_KEYCLOAK_URL,
  realm: import.meta.env.VITE_KEYCLOAK_REALM,
  clientId: import.meta.env.VITE_KEYCLOAK_CLIENT_ID,
};

const keycloak = new Keycloak(keycloakConfig);

export const keycloakInitOptions = {
  onLoad: "check-sso",
  checkLoginIframe: false,
  silentCheckSsoFallback: false,
  silentCheckSsoRedirectUri: window.location.origin + "/silent-check-sso.html",
  flow: "standard",
  responseMode: "fragment",
  scope: "openid profile email",
  pkceMethod: "S256",
};

export default keycloak;
