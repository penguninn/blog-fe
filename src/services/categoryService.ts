import axiosInstance from "@/api/axiosInstance";
import { API_ENDPOINTS } from "@/constants";
import type {
  Category,
  CategoryCreateRequest,
  CategoryUpdateRequest,
} from "@/types";

export const categoryService = {
  getAll: () => axiosInstance.get<Category[]>(API_ENDPOINTS.CATEGORIES),
  getById: (id: string) =>
    axiosInstance.get<Category>(`${API_ENDPOINTS.CATEGORIES}/${id}`),
  create: (data: CategoryCreateRequest) =>
    axiosInstance.post<Category>(API_ENDPOINTS.CATEGORIES, data),
  update: (id: string, data: CategoryUpdateRequest) =>
    axiosInstance.put<Category>(`${API_ENDPOINTS.CATEGORIES}/${id}`, data),
  delete: (id: string) =>
    axiosInstance.delete<void>(`${API_ENDPOINTS.CATEGORIES}/${id}`),
};

export type CategoryService = typeof categoryService;
