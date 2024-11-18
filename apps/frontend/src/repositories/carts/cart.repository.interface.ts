export interface ICartRepository {
  addItem(productId: number, quantity: number): Promise<unknown>;
}
