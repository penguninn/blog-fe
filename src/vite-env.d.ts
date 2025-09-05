/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_KEYCLOAK_URL: string;
  readonly VITE_KEYCLOAK_REALM: string;
  readonly VITE_KEYCLOAK_CLIENT_ID: string;
  readonly VITE_API_BASE_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

// SVG imports
declare module "*.svg" {
  const content: string;
  export default content;
}

// CSS imports
declare module "*.css" {
  const content: Record<string, string>;
  export default content;
}
