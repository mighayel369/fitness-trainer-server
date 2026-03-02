export function paginate<T>(
  data: T[],
  total: number,
  page: number,
  limit: number
) {
  return {
    data,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
}