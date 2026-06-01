import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { CartState, CartItem, Product } from '../../types';
import { cartService } from '../../services';
import { STORAGE_KEYS } from '../../utils/constants';
import { config } from '../../utils/config';
import toast from 'react-hot-toast';

// Load cart from localStorage as fallback
const loadCartFromStorage = (): CartItem[] => {
  try {
    const cart = localStorage.getItem(STORAGE_KEYS.CART);
    return cart ? JSON.parse(cart) : [];
  } catch {
    return [];
  }
};

const calculateTotals = (items: CartItem[]) => {
  const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const tax = subtotal * config.cart.taxRate;
  const shipping = subtotal >= config.cart.shippingThreshold ? 0 : config.cart.shippingCost;
  const total = subtotal + tax + shipping;

  return { subtotal, totalItems, tax, shipping, total };
};

const initialItems = loadCartFromStorage();
const initialTotals = calculateTotals(initialItems);

const initialState: CartState = {
  items: initialItems,
  ...initialTotals,
};

// Async Thunks for API integration

/**
 * Fetch cart from backend
 */
export const fetchCart = createAsyncThunk(
  'cart/fetchCart',
  async (_, { rejectWithValue }) => {
    try {
      const response = await cartService.getCart();
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch cart');
    }
  }
);

/**
 * Add item to cart (backend)
 */
export const addItemToCart = createAsyncThunk(
  'cart/addItem',
  async ({ productId, quantity }: { productId: string; quantity: number }, { rejectWithValue }) => {
    try {
      const response = await cartService.addItem({ productId, quantity });
      toast.success('Item added to cart');
      return response;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to add item to cart';
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

/**
 * Update cart item quantity (backend)
 */
export const updateCartItem = createAsyncThunk(
  'cart/updateItem',
  async ({ cartItemId, quantity }: { cartItemId: string; quantity: number }, { rejectWithValue }) => {
    try {
      const response = await cartService.updateItem(cartItemId, { quantity });
      toast.success('Cart updated');
      return response;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to update cart';
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

/**
 * Remove item from cart (backend)
 */
export const removeCartItem = createAsyncThunk(
  'cart/removeItem',
  async (cartItemId: string, { rejectWithValue }) => {
    try {
      await cartService.removeItem(cartItemId);
      toast.success('Item removed from cart');
      return cartItemId;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to remove item';
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

/**
 * Clear entire cart (backend)
 */
export const clearCartAsync = createAsyncThunk(
  'cart/clearCart',
  async (_, { rejectWithValue }) => {
    try {
      await cartService.clearCart();
      toast.success('Cart cleared');
      return;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to clear cart';
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    // Local cart operations (for offline/fallback)
    addToCart: (state, action: PayloadAction<{ product: Product; quantity?: number }>) => {
      const { product, quantity = 1 } = action.payload;
      const existingItem = state.items.find(item => item.productId === product.id);

      if (existingItem) {
        const newQuantity = Math.min(
          existingItem.quantity + quantity,
          config.cart.maxQuantityPerItem
        );
        existingItem.quantity = newQuantity;
      } else {
        state.items.push({
          productId: product.id,
          product,
          quantity: Math.min(quantity, config.cart.maxQuantityPerItem),
          addedAt: new Date().toISOString(),
        });
      }

      const totals = calculateTotals(state.items);
      Object.assign(state, totals);
      localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(state.items));
    },
    updateQuantity: (state, action: PayloadAction<{ productId: string; quantity: number }>) => {
      const item = state.items.find(item => item.productId === action.payload.productId);
      if (item) {
        item.quantity = Math.min(
          Math.max(1, action.payload.quantity),
          config.cart.maxQuantityPerItem
        );
        const totals = calculateTotals(state.items);
        Object.assign(state, totals);
        localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(state.items));
      }
    },
    removeFromCart: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(item => item.productId !== action.payload);
      const totals = calculateTotals(state.items);
      Object.assign(state, totals);
      localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(state.items));
    },
    clearCart: (state) => {
      state.items = [];
      state.totalItems = 0;
      state.subtotal = 0;
      state.tax = 0;
      state.shipping = 0;
      state.total = 0;
      localStorage.removeItem(STORAGE_KEYS.CART);
    },
  },
  extraReducers: (builder) => {
    // Fetch Cart
    builder.addCase(fetchCart.fulfilled, (state, action) => {
      const cartData = action.payload;
      // Map backend cart structure to frontend state
      state.items = cartData.items.map(item => ({
        productId: item.product.productId,
        product: {
          id: item.product.productId,
          name: item.product.name,
          price: item.product.price,
          thumbnail: item.product.imageUrl,
          inStock: item.product.inStock,
          stock: item.product.stock,
        } as Product,
        quantity: item.quantity,
        addedAt: item.addedAt,
      }));
      state.totalItems = cartData.summary.itemCount;
      state.subtotal = cartData.summary.subtotal;
      state.tax = cartData.summary.tax;
      state.shipping = cartData.summary.shipping;
      state.total = cartData.summary.total;
      localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(state.items));
    });

    // Add Item to Cart
    builder.addCase(addItemToCart.fulfilled, (state, action) => {
      const cartData = action.payload;
      state.items = cartData.items.map(item => ({
        productId: item.product.productId,
        product: {
          id: item.product.productId,
          name: item.product.name,
          price: item.product.price,
          thumbnail: item.product.imageUrl,
          inStock: item.product.inStock,
          stock: item.product.stock,
        } as Product,
        quantity: item.quantity,
        addedAt: item.addedAt,
      }));
      state.totalItems = cartData.summary.itemCount;
      state.subtotal = cartData.summary.subtotal;
      state.tax = cartData.summary.tax;
      state.shipping = cartData.summary.shipping;
      state.total = cartData.summary.total;
      localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(state.items));
    });

    // Update Cart Item
    builder.addCase(updateCartItem.fulfilled, (state, action) => {
      const cartData = action.payload;
      state.items = cartData.items.map(item => ({
        productId: item.product.productId,
        product: {
          id: item.product.productId,
          name: item.product.name,
          price: item.product.price,
          thumbnail: item.product.imageUrl,
          inStock: item.product.inStock,
          stock: item.product.stock,
        } as Product,
        quantity: item.quantity,
        addedAt: item.addedAt,
      }));
      state.totalItems = cartData.summary.itemCount;
      state.subtotal = cartData.summary.subtotal;
      state.tax = cartData.summary.tax;
      state.shipping = cartData.summary.shipping;
      state.total = cartData.summary.total;
      localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(state.items));
    });

    // Remove Cart Item
    builder.addCase(removeCartItem.fulfilled, (state, action) => {
      state.items = state.items.filter(item => item.productId !== action.payload);
      const totals = calculateTotals(state.items);
      Object.assign(state, totals);
      localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(state.items));
    });

    // Clear Cart
    builder.addCase(clearCartAsync.fulfilled, (state) => {
      state.items = [];
      state.totalItems = 0;
      state.subtotal = 0;
      state.tax = 0;
      state.shipping = 0;
      state.total = 0;
      localStorage.removeItem(STORAGE_KEYS.CART);
    });
  },
});

export const { addToCart, updateQuantity, removeFromCart, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
