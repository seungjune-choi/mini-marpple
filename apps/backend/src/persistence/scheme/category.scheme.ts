import { BaseScheme } from '@backend/persistence/scheme';

export interface CategoryScheme extends BaseScheme<number> {
  name: string;
}
