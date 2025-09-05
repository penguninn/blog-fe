import axios from "axios";
import keycloak from "@/utils/keycloakConfig";
import { isStandardResponse, toLegacyFromStandard } from "@/utils/apiHelpers";

const getBaseURL = () => {
  const baseURL = import.meta.env.VITE_API_BASE_URL;

  if (baseURL) {
    const cleanURL = baseURL.replace(/\/$/, "");
    return cleanURL.endsWith("/api") ? cleanURL : `${cleanURL}/api`;
  }
  return "/api";
};

const axiosInstance = axios.create({
  baseURL: getBaseURL(),
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

axiosInstance.interceptors.request.use(
  async (config) => {
    config.headers = config.headers || {};
    if (keycloak?.authenticated) {
      try {
        await keycloak.updateToken(30);
        if (keycloak.token) {
          config.headers["Authorization"] = `Bearer ${keycloak.token}`;
        }
      } catch (err) {
        console.error("Token refresh failed:", err);
      }
    }
    return config;
  },
  (error) => {
    console.error("Request error:", error);
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => {
    try {
      const payload = response.data;
      if (isStandardResponse(payload)) {
        response.data = toLegacyFromStandard(payload as any);
      }
    } catch (e) {}
    return response;
  },
  async (error) => {
    try {
      const payload = error.response?.data;
      if (isStandardResponse(payload) && payload.error) {
        error.response.data = payload;
        if (payload.correlationId) {
          console.error(
            `Request ${payload.correlationId} failed:`,
            payload.error?.title || error.message
          );
        }
      }
    } catch {}

    if (error.response?.status === 401) {
      try {
        if (keycloak?.authenticated) {
          await keycloak.logout();
        }
      } catch {}
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
