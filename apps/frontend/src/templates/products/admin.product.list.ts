import type { View } from 'rune-ts';
import type { Product } from '../../model';
import { BaseProductList } from './base.product.list';
import type { BindModel } from '../../experimental';

export class AdminProductList extends BaseProductList {
  override next(): Promise<{ items: View<{ model: BindModel<Partial<Product>> }>[]; cursor: number }> {
    throw new Error('Method not implemented.');
  }
}
