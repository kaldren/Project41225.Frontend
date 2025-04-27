export interface IPaginatedResponse<T> {
  result: T[];
  page?: number;
  total?: number;
}
