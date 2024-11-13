import { BaseScheme } from '@backend/persistence/scheme/base.scheme';

export interface UserScheme extends BaseScheme<number> {
  email: string;
  password: string;
  is_admin: boolean;
}
