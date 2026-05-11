export interface StorefrontCartItem {
  id: string;
  productId: string;
  variantId?: string | null;
  productName: string;
  variantName?: string | null;
  variantSku?: string | null;
  variantAttributes?: any;
  productImage: string;
  priceSnapshot: string;
  quantity: number;
  subtotal: string;

  availableStock?: number;
  error?: string | null;
}
