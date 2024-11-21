export interface CartItem {
  id: number;
  product: {
    id: number;
    name: string;
    price: number;
    description: string;
    representativeImage: {
      id: number;
      url: string;
    };
  };
  quantity: number;
  totalPrice: number;
}

export interface CartSummary {
  totalItems: number;
  totalProductPrice: number;
  shippingFee: number;
  totalOrderPrice: number;
}

export interface Cart {
  id: number;
  items: CartItem[];
  summary: CartSummary;
}
