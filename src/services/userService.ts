import axiosInstance from "@/api/axiosInstance";
import { API_ENDPOINTS } from "@/constants";
// This service only includes endpoints supported by backend for current user

export interface UserProfile {
  id: string;
  userId: string;
  displayName: string;
  gender: boolean | null;
  dob: string | null;
  avatarUrl?: string | null;
  bio?: string | null;
  username: string;
  email: string;
  pendingEmail?: string | null;
  emailVerified: boolean;
  enabled: boolean;
  identitySyncStatus?: string;
  createdDate: string;
  modifiedDate: string;
}

export interface UpdateProfileRequest {
  displayName?: string;
  gender?: boolean | null;
  dob?: string | null;
  avatarUrl?: string | null;
  bio?: string | null;
}

export interface UpdateUsernameRequest {
  username: string;
}
export interface UpdateEmailRequest {
  email: string;
}

export const userService = {
  getCurrent: () => axiosInstance.get<UserProfile>(`${API_ENDPOINTS.USERS_ME}`),
  updateCurrent: (data: UpdateProfileRequest) =>
    axiosInstance.patch<UserProfile>(`${API_ENDPOINTS.USERS_ME}`, data),
  updateCurrentUsername: (data: UpdateUsernameRequest) =>
    axiosInstance.patch<UserProfile>(
      `${API_ENDPOINTS.USERS_ME}/username`,
      data
    ),
  updateCurrentEmail: (data: UpdateEmailRequest) =>
    axiosInstance.patch<UserProfile>(`${API_ENDPOINTS.USERS_ME}/email`, data),
};

export type UserService = typeof userService;
