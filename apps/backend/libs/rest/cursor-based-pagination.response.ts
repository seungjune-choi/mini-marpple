export interface CursorBasedPaginationResponse<T> {
  items: T[];
  cursor: number | null;
}
