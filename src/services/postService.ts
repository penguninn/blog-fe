import axiosInstance from "@/api/axiosInstance";
import { API_ENDPOINTS } from "@/constants";
import type {
  GetAllPostsParams,
  GetPostsByCategoryParams,
  GetPostsByTagParams,
  PaginatedResponse,
  Post,
  PostCreateRequest,
  PostUpdateRequest,
  SimpleSearchParams,
} from "@/types";

const ensurePage1 = <T extends { page?: number; size?: number }>(
  params?: T
): T | undefined => {
  if (!params) return { page: 1 } as T;
  const p = { ...params };
  if (typeof p.page !== "number" || p.page < 1) p.page = 1;
  return p;
};

export const postService = {
  getAll: (params?: GetAllPostsParams) =>
    axiosInstance.get<PaginatedResponse<Post>>(API_ENDPOINTS.POSTS, {
      params: ensurePage1(params),
    }),

  getById: (id: string) =>
    axiosInstance.get<Post>(`${API_ENDPOINTS.POSTS}/${encodeURIComponent(id)}`),

  getBySlug: (slug: string) =>
    axiosInstance.get<Post>(
      `${API_ENDPOINTS.POSTS_BY_SLUG}/${encodeURIComponent(slug)}`
    ),

  create: (data: PostCreateRequest) =>
    axiosInstance.post<Post>(API_ENDPOINTS.POSTS, data),

  update: (id: string, data: PostUpdateRequest) =>
    axiosInstance.put<Post>(`${API_ENDPOINTS.POSTS}/${id}`, data),

  delete: (id: string) =>
    axiosInstance.delete<void>(`${API_ENDPOINTS.POSTS}/${id}`),

  getByCategory: (categoryId: string, params?: GetPostsByCategoryParams) =>
    axiosInstance.get<PaginatedResponse<Post>>(
      `${API_ENDPOINTS.POSTS_BY_CATEGORY}/${encodeURIComponent(categoryId)}/posts`,
      { params: ensurePage1(params) }
    ),

  getByTag: (tagId: string, params?: GetPostsByTagParams) =>
    axiosInstance.get<PaginatedResponse<Post>>(
      `${API_ENDPOINTS.POSTS_BY_TAG}/${encodeURIComponent(tagId)}/posts`,
      { params: ensurePage1(params) }
    ),

  search: (params: SimpleSearchParams) =>
    axiosInstance.get<PaginatedResponse<Post>>(API_ENDPOINTS.POSTS_SEARCH, {
      params: ensurePage1(params),
    }),
};

export type PostService = typeof postService;
