import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { addToCart as addToCartAction, updateQuantity, removeFromCart, clearCart } from '../store/slices/cartSlice';
import { Product } from '../types';
import toast from 'react-hot-toast';

export const useCart = () => {
  const dispatch = useAppDispatch();
  const cart = useAppSelector((state) => state.cart);

  const addToCart = useCallback((product: Product, quantity: number = 1) => {
    dispatch(addToCartAction({ product, quantity }));
    toast.success(`${product.name} added to cart`);
  }, [dispatch]);

  const updateItemQuantity = useCallback((productId: string, quantity: number) => {
    dispatch(updateQuantity({ productId, quantity }));
  }, [dispatch]);

  const removeItem = useCallback((productId: string) => {
    dispatch(removeFromCart(productId));
    toast.success('Item removed from cart');
  }, [dispatch]);

  const clearAllItems = useCallback(() => {
    dispatch(clearCart());
    toast.success('Cart cleared');
  }, [dispatch]);

  const getItemQuantity = useCallback((productId: string): number => {
    const item = cart.items.find(item => item.productId === productId);
    return item?.quantity || 0;
  }, [cart.items]);

  const isInCart = useCallback((productId: string): boolean => {
    return cart.items.some(item => item.productId === productId);
  }, [cart.items]);

  return {
    ...cart,
    addToCart,
    updateItemQuantity,
    removeItem,
    clearAllItems,
    getItemQuantity,
    isInCart,
  };
};
