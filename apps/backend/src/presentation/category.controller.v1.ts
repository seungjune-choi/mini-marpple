import { CategoryService } from '@backend/usecase';
import { Controller, Get } from '@libs/decorators';
import { ResponseEntity } from '@libs/rest';

@Controller('/categories/v1')
export class CategoryControllerV1 {
  constructor(private readonly categoryService: CategoryService) {}

  @Get()
  async findMany() {
    return await this.categoryService.findMany().then(ResponseEntity.ok);
  }
}
