import { User } from 'src/core';

export class CreateUserResponse {
  public id: number;
  public email: string;
  public createdAt: string;
  public updatedAt: string;

  constructor(args: CreateUserResponse) {
    this.id = args.id;
    this.email = args.email;
    this.createdAt = args.createdAt;
    this.updatedAt = args.updatedAt;
  }

  public static fromEntity(entity: User): CreateUserResponse {
    return new CreateUserResponse({
      id: entity.id!,
      email: entity.email,
      createdAt: entity.createdAt!.toISOString(),
      updatedAt: entity.updatedAt!.toISOString(),
    });
  }
}
