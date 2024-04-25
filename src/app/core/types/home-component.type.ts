export type Pagination = {
  currentPage: number;
  totalPages: number;
};

export type RouteQueryParams = {
  page: number;
  title: string | null;
};
