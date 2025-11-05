export interface Product {
  image: string;
  description: string;
  name: string;
  code: string;
  size: string;
  stock: number;
  price: number;
  unisex: string;
  originalIndex: number;
}

export interface CartItem {
  name: string;
  price: number | string;
  code: string;
  size: string;
  quantity: number;
  image: string;
  unisex: string;
  max: number;
  originalIndex: number;
}

export interface Coupon {
  discountValue: number;
  discountType: string;
}

export interface OrderData {
  orderDate: string;
  name: string;
  phone: string;
  status: string;
  email: string;
  address: string;
  productCodes: string;
  productCount: string;
  totalCount: number;
  eachPrice: string;
  shipping: number;
  totalPrice: number;
  discount: number;
  pstatus: string;
  orderid: string;
}

export interface CheckoutFormData {
  fullName: string;
  phone: string;
  email: string;
  street: string;
  city: string;
  division: string;
  district: string;
}

export interface OrderSummary {
  fullName: string;
  phone: string;
  email: string;
  address: {
    street: string;
    city: string;
    division: string;
    district: string;
    country: string;
  };
  products: string;
  quantities: string;
  totalQuantity: number;
  prices: string;
  sump: number;
  sizes: string;
  shippingCost: number;
  discount: number;
  promo: string;
  totalSum: number;
  orderId: string;
}
