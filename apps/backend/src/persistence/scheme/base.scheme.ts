export interface BaseScheme<I extends string | number> {
  id: I;
  created_at: Date;
  updated_at: Date;
  deleted_at: Date | null;
}
