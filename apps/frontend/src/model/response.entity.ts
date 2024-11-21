export interface ResponseEntity<T> {
  statusCode: number;
  message: string;
  data: T;
  error: unknown;
}
