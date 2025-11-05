import { CartItem } from '../types';
import type { OrderSummary } from '../types';

const CART_KEY = 'cart';
const FAVORITES_KEY = 'favorites';
const COUPON_KEY = 'coupon';
const PROMO_KEY = 'promoc';
const ORDER_SUMMARY_KEY = 'orderSummary';
const ORDER_KEY = 'order';

export const storage = {
  // Cart operations
  getCart: (): CartItem[] => {
    const cart = localStorage.getItem(CART_KEY);
    return cart ? JSON.parse(cart) : [];
  },
  
  setCart: (cart: CartItem[]): void => {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
  },
  
  clearCart: (): void => {
    localStorage.removeItem(CART_KEY);
  },
  
  // Favorites operations
  getFavorites: (): string[] => {
    const favorites = localStorage.getItem(FAVORITES_KEY);
    return favorites ? JSON.parse(favorites) : [];
  },
  
  setFavorites: (favorites: string[]): void => {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
  },
  
  // Coupon operations
  getCoupon: (): string => {
    return localStorage.getItem(COUPON_KEY) || '0';
  },
  
  setCoupon: (discount: string): void => {
    localStorage.setItem(COUPON_KEY, discount);
  },
  
  clearCoupon: (): void => {
    localStorage.removeItem(COUPON_KEY);
  },
  
  // Promo code operations
  getPromo: (): string => {
    return localStorage.getItem(PROMO_KEY) || '';
  },
  
  setPromo: (promo: string): void => {
    localStorage.setItem(PROMO_KEY, promo);
  },
  
  clearPromo: (): void => {
    localStorage.removeItem(PROMO_KEY);
  },
  
  // Order operations
  getOrderSummary: (): string => {
    return localStorage.getItem(ORDER_SUMMARY_KEY) || '';
  },
  
  setOrderSummary: (summary: string): void => {
    localStorage.setItem(ORDER_SUMMARY_KEY, summary);
  },
  
  clearOrderSummary: (): void => {
    localStorage.removeItem(ORDER_SUMMARY_KEY);
  },
  
  getOrder: (): OrderSummary | null => {
    const order = localStorage.getItem(ORDER_KEY);
    return order ? JSON.parse(order) : null;
  },
  
  setOrder: (order: OrderSummary): void => {
    localStorage.setItem(ORDER_KEY, JSON.stringify(order));
  },
  
  clearOrder: (): void => {
    localStorage.removeItem(ORDER_KEY);
  },
  
  // Clear all order-related data
  clearOrderData: (): void => {
    storage.clearCart();
    storage.clearCoupon();
    storage.clearPromo();
    storage.clearOrderSummary();
  },
};
