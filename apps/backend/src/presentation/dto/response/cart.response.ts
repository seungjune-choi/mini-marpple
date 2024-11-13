import { map, pipe, sum, toArray } from '@fxts/core';
import { Cart, CartItem } from '@backend/core';

class CartItemResponse {
  id!: number;
  product!: {
    id: number;
    name: string;
    price: number;
    representativeImage: {
      id: number;
      url: string;
    };
  };
  quantity!: number;
  totalPrice!: number;

  constructor(args: Omit<CartItemResponse, 'totalPrice'>) {
    Object.assign(this, args);
    this.totalPrice = this.product.price * this.quantity;
  }

  static fromEntity(entity: CartItem) {
    return new CartItemResponse({
      id: entity.id!,
      product: {
        id: entity.product.id!,
        name: entity.product.name,
        price: entity.product.price,
        representativeImage: {
          id: entity.product.getRepresentativeImage().id!,
          url: entity.product.getRepresentativeImage().path!,
        },
      },
      quantity: entity.quantity,
    });
  }
}

class CartSummary {
  totalItems: number;
  totalProductPrice: number;
  shippingFee: number;
  totalOrderPrice: number;

  constructor(items: CartItemResponse[], shippingFee: number) {
    this.totalItems = pipe(
      items,
      map((item) => item.quantity),
      sum,
    );
    this.totalProductPrice = pipe(
      items,
      map((item) => item.totalPrice),
      sum,
    );
    this.shippingFee = shippingFee;
    this.totalOrderPrice = this.totalProductPrice + this.shippingFee;
  }
}

export class CartResponse {
  id: number;
  items: CartItemResponse[];
  summary: CartSummary;

  constructor(id: number, items: CartItemResponse[], shippingFee: number) {
    this.id = id;
    this.items = items;
    this.summary = new CartSummary(items, shippingFee);
  }

  static from(cart: Cart, shippingFee: number) {
    return new CartResponse(
      cart.id!,
      pipe(
        cart.items,
        map((item) => CartItemResponse.fromEntity(item)),
        toArray,
      ),
      shippingFee,
    );
  }
}
