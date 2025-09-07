import type {
  ContentBlock,
  PaginatedResponse,
  PaginationParams,
  SortingParams,
  PostStatus,
  PostSortBy,
} from "./api.types";
import type { Category } from "./category.types";
import type { Tag } from "./tag.types";

export interface Post {
  id: string;
  title: string;
  slug: string;
  authorName?: string;
  status: PostStatus;
  excerpt?: string | null;
  views?: number;
  likesCount?: number;
  publishedAt?: string | null;
  scheduledFor?: string | null;
  category: Category;
  tags: Tag[];
  contents: ContentBlock[];
  createdDate?: string;
  modifiedDate?: string;
}

export interface GetAllPostsParams
  extends PaginationParams,
    SortingParams<PostSortBy> {}

export interface GetPostsByCategoryParams
  extends PaginationParams,
    SortingParams<PostSortBy> {}

export interface GetPostsByTagParams
  extends PaginationParams,
    SortingParams<PostSortBy> {}

export interface PostCreateRequest {
  title: string;
  slug: string | null;
  excerpt?: string | null;
  status: PostStatus;
  categoryId: string;
  tagIds: string[];
  contents: ContentBlock[];
}

export type PostUpdateRequest = Omit<PostCreateRequest, "slug"> & {
  slug?: string | null;
};

export interface SimpleSearchParams
  extends PaginationParams,
    SortingParams<PostSortBy> {
  query: string;
}

export interface Engagement {
  postId: string;
  likesCount: number;
  liked: boolean;
}

// Comments (kept with posts domain for now)
export interface Comment {
  id: string;
  content: string;
  authorName: string;
  authorId: string;
  postId: string;
  parentCommentId?: string | null;
  likesCount?: number;
  replies?: Comment[];
  createdDate: string;
  modifiedDate: string;
}

export interface CommentCreateRequest {
  content: string;
  postId: string;
  parentCommentId?: string | null;
}

export interface CommentUpdateRequest {
  content: string;
}

export type PaginatedPosts = PaginatedResponse<Post>;

// Re-export useful types for convenience
export type { PostStatus, PostSortBy };
