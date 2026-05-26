import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CartState, CartItem, Product } from '../../types';
import { STORAGE_KEYS } from '../../utils/constants';
import { config } from '../../utils/config';

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

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
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
});

export const { addToCart, updateQuantity, removeFromCart, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
