import { CategoryRepository } from './category.repository';
import { Category } from '../core';
import { randomUUID } from 'node:crypto';
import { DataSource } from '../../libs/database';

describe(CategoryRepository.name, () => {
  const dataSource = global.__DATA_SOURCE__ as DataSource;
  console.log(dataSource.$query);
  const sut = new CategoryRepository(dataSource);

  describe('save', () => {
    it('should save category', async () => {
      // Arrange
      const category = Category.new({ name: randomUUID() });

      // Act
      const result = await sut.save(category);

      // Assert
      expect(result).toMatchObject({
        id: expect.any(Number),
        name: category.name,
        deletedAt: null,
      });
    });
  });
});
