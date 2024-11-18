import { CategoryRepository } from '@backend/persistence';
import { Injectable } from '@libs/decorators';

@Injectable()
export class CategoryService {
  constructor(private readonly categoryRepository: CategoryRepository) {}

  async findMany() {
    return await this.categoryRepository.findMany();
  }
}
