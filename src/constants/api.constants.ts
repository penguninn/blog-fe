export const API_ENDPOINTS = {
  POSTS: "/posts",
  POSTS_BY_SLUG: "/posts/slug",
  // For GET by id or slug, use POSTS with path param
  POSTS_BY_CATEGORY: "/posts/categories",
  POSTS_BY_TAG: "/posts/tags",
  POSTS_SEARCH: "/posts/search",
  ASSETS_UPLOAD: "/assets/upload",
  // Legacy or unsupported endpoints removed from usage; constants kept minimal

  CATEGORIES: "/categories",
  TAGS: "/tags",
  USERS: "/users",
  USERS_ME: "/users/me",
} as const;

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  GONE: 410,
  INTERNAL_SERVER_ERROR: 500,
} as const;

export type HttpStatusCode = (typeof HTTP_STATUS)[keyof typeof HTTP_STATUS];
