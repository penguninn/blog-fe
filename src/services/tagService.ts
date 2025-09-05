import axiosInstance from "@/api/axiosInstance";
import { API_ENDPOINTS } from "@/constants";
import type { Tag, TagCreateRequest, TagUpdateRequest } from "@/types";

export const tagService = {
  getAll: () => axiosInstance.get<Tag[]>(API_ENDPOINTS.TAGS),
  getById: (id: string) =>
    axiosInstance.get<Tag>(`${API_ENDPOINTS.TAGS}/${id}`),
  create: (data: TagCreateRequest) =>
    axiosInstance.post<Tag>(API_ENDPOINTS.TAGS, data),
  update: (id: string, data: TagUpdateRequest) =>
    axiosInstance.put<Tag>(`${API_ENDPOINTS.TAGS}/${id}`, data),
  delete: (id: string) =>
    axiosInstance.delete<void>(`${API_ENDPOINTS.TAGS}/${id}`),
};

export type TagService = typeof tagService;
