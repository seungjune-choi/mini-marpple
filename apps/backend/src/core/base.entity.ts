import { Expose } from 'class-transformer';

export abstract class BaseEntity<I extends number | string> {
  @Expose({ name: 'id' })
  id?: I;

  @Expose({ name: 'created_at' })
  createdAt?: Date;

  @Expose({ name: 'updated_at' })
  updatedAt?: Date;

  @Expose({ name: 'deleted_at' })
  deletedAt: Date | null = null;
}
