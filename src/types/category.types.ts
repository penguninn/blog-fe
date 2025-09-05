export interface Category {
  id: string;
  name: string;
  description?: string | null;
}

export interface CategoryCreateRequest {
  name: string;
  description?: string | null;
}

export interface CategoryUpdateRequest extends CategoryCreateRequest {}
