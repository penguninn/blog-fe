export interface Tag {
  id: string;
  name: string;
  description?: string | null;
  color?: string | null;
}

export interface TagCreateRequest {
  name: string;
  description?: string | null;
  color?: string | null;
}

export interface TagUpdateRequest extends TagCreateRequest {}
