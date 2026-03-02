export interface PaginationInputDTO {
  searchQuery: string;
  filter: Record<string, any>
  currentPage: number;
  limit: number;
}

export interface PaginationOutputDTO<T> {
  data: T[];
  total: number;
}