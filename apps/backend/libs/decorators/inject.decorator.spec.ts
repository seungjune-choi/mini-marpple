import { container } from 'tsyringe';

it('token 으로 의존성 주입', () => {
  // Arrange
  const token = Symbol('token');
  const object = { hi: 'there' };
  container.register(token, { useValue: object });

  // Act
  const result = container.resolve<{ hi: string }>(token);

  // Assert
  expect(result).toBe(object);
  expect(result.hi).toBe('there');
});
