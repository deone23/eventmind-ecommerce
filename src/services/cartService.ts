import { axiosInstance } from '../api';
import { ApiResponse, CartItem, CartState } from '../types';
import { API_ENDPOINTS } from '../utils/constants';

// Cart API Response Types
interface CartApiResponse {
  cartId: string;
  userId: string;
  items: Array<{
    cartItemId: string;
    product: {
      productId: string;
      name: string;
      price: number;
      imageUrl: string;
      inStock: boolean;
      stock: number;
    };
    quantity: number;
    unitPrice: number;
    totalPrice: number;
    addedAt: string;
  }>;
  summary: {
    itemCount: number;
    uniqueItemCount: number;
    subtotal: number;
    tax: number;
    shipping: number;
    total: number;
    currency: string;
  };
  updatedAt: string;
}

interface AddToCartRequest {
  productId: string;
  quantity: number;
}

interface UpdateCartItemRequest {
  quantity: number;
}

export const cartService = {
  /**
   * Get user's cart
   * GET /api/cart
   */
  getCart: async (): Promise<CartApiResponse> => {
    const response = await axiosInstance.get<ApiResponse<CartApiResponse>>(API_ENDPOINTS.CART);
    return response.data.data!;
  },

  /**
   * Add item to cart
   * POST /api/cart/items
   */
  addItem: async (data: AddToCartRequest): Promise<CartApiResponse> => {
    const response = await axiosInstance.post<ApiResponse<CartApiResponse>>(
      API_ENDPOINTS.ADD_TO_CART,
      data
    );
    return response.data.data!;
  },

  /**
   * Update cart item quantity
   * PUT /api/cart/item/{cartItemId}
   */
  updateItem: async (cartItemId: string, data: UpdateCartItemRequest): Promise<CartApiResponse> => {
    const response = await axiosInstance.put<ApiResponse<CartApiResponse>>(
      API_ENDPOINTS.UPDATE_CART_ITEM.replace(':id', cartItemId),
      data
    );
    return response.data.data!;
  },

  /**
   * Remove item from cart
   * DELETE /api/cart/item/{cartItemId}
   */
  removeItem: async (cartItemId: string): Promise<void> => {
    await axiosInstance.delete(
      API_ENDPOINTS.REMOVE_FROM_CART.replace(':id', cartItemId)
    );
  },

  /**
   * Clear entire cart
   * DELETE /api/cart
   */
  clearCart: async (): Promise<void> => {
    await axiosInstance.delete(API_ENDPOINTS.CLEAR_CART);
  },
};
