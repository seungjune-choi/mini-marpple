import { Cart } from './cart.entity';
import { CartItem } from './cart-item.entity';
import { Product } from './product.entity';

describe(Cart.name, () => {
  describe('물품 총액 계산', () => {
    it('should return 0 when there is no item', () => {
      // Arrange
      const sut = new Cart({ userId: 1 });

      // Act
      const actual = sut.calculateItemsPrice();

      // Assert
      expect(actual).toBe(0);
    });

    it('should return the sum of the prices of the items', () => {
      // Arrange
      const sut = new Cart({ userId: 1 });

      sut.items = [
        new CartItem({ product: new Product({ price: 10000 }), quantity: 10 }),
        new CartItem({ product: new Product({ price: 20000 }), quantity: 9 }),
      ];

      // Act
      const actual = sut.calculateItemsPrice();

      // Assert
      expect(actual).toBe(280000);
    });
  });
});
