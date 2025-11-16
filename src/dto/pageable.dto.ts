export interface Pageable<T> {
  data: T[];
  pagination: PageablePagination;
}

export interface PageablePagination {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}
