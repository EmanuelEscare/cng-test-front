export interface ApiCollectionResponse<T> {
  data: T[];
  links?: PaginationLinks;
  meta?: PaginationMeta;
  message?: string;
}

export interface ApiItemResponse<T> {
  data: T;
  message?: string;
}

export interface ApiMessageResponse {
  message?: string;
}

export interface PaginationLinks {
  first?: string | null;
  last?: string | null;
  prev?: string | null;
  next?: string | null;
}

export interface PaginationMeta {
  current_page?: number;
  from?: number | null;
  last_page?: number;
  per_page?: number;
  to?: number | null;
  total?: number;
}
