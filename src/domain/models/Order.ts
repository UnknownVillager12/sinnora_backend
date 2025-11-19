import mongoose from 'mongoose';

export interface IOrder {
  _id?: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  orderNumber: string;
  status:
    | 'pending'
    | 'confirmed'
    | 'processing'
    | 'shipped'
    | 'delivered'
    | 'cancelled'
    | 'refunded';
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  paymentMethod:
    | 'cod'
    | 'credit_card'
    | 'debit_card'
    | 'upi'
    | 'net_banking'
    | 'wallet';
  subtotal: number;
  taxAmount?: number; // Optional, defaults to 0 in schema
  shippingAmount?: number; // Optional, defaults to 0 in schema
  discountAmount?: number; // Optional, defaults to 0 in schema
  totalAmount: number;
  currency?: string; // Optional, defaults to 'INR' in schema
  notes?: string; // Optional, not required in schema
  shippedAt?: Date; // Optional, not required in schema
  deliveredAt?: Date; // Optional, not required in schema
  cancelledAt?: Date; // Optional, not required in schema
  createdAt?: Date; // Managed by timestamps
  updatedAt?: Date; // Managed by timestamps
}

export interface IOrderItem {
  _id?: mongoose.Types.ObjectId;
  orderId: mongoose.Types.ObjectId;
  productId: mongoose.Types.ObjectId;
  variantId?: mongoose.Types.ObjectId; // Optional in schema
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  productName: string;
  productSku: string;
  createdAt?: Date; // Managed by timestamps
}

export interface IOrderAddress {
  _id?: mongoose.Types.ObjectId;
  orderId: mongoose.Types.ObjectId;
  type: 'billing' | 'shipping';
  name: string;
  company?: string; // Optional in schema
  addressLine1: string;
  addressLine2?: string; // Optional in schema
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone?: string; // Optional in schema
  createdAt?: Date; // Managed by timestamps
}

// Order Model
const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    orderNumber: {
      type: String,
      required: true,
      unique: true,
      maxlength: 50,
    },
    status: {
      type: String,
      enum: [
        'pending',
        'confirmed',
        'processing',
        'shipped',
        'delivered',
        'cancelled',
        'refunded',
      ],
      default: 'pending',
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'failed', 'refunded'],
      default: 'pending',
    },
    paymentMethod: {
      type: String,
      enum: [
        'cod',
        'credit_card',
        'debit_card',
        'upi',
        'net_banking',
        'wallet',
      ],
      required: true,
    },
    subtotal: {
      type: Number,
      required: true,
    },
    taxAmount: {
      type: Number,
      default: 0,
    },
    shippingAmount: {
      type: Number,
      default: 0,
    },
    discountAmount: {
      type: Number,
      default: 0,
    },
    totalAmount: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      maxlength: 3,
      default: 'INR',
    },
    notes: {
      type: String,
    },
    shippedAt: {
      type: Date,
    },
    deliveredAt: {
      type: Date,
    },
    cancelledAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  },
);

// OrderItem Model
const orderItemSchema = new mongoose.Schema(
  {
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Order',
      required: true,
    },
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    variantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ProductVariant',
    },
    quantity: {
      type: Number,
      required: true,
    },
    unitPrice: {
      type: Number,
      required: true,
    },
    totalPrice: {
      type: Number,
      required: true,
    },
    productName: {
      type: String,
      required: true,
      maxlength: 255,
    },
    productSku: {
      type: String,
      required: true,
      maxlength: 100,
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  },
);

// OrderAddress Model
const orderAddressSchema = new mongoose.Schema(
  {
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Order',
      required: true,
    },
    type: {
      type: String,
      enum: ['billing', 'shipping'],
      required: true,
    },
    name: {
      type: String,
      required: true,
      maxlength: 100,
    },
    company: {
      type: String,
      maxlength: 100,
    },
    addressLine1: {
      type: String,
      required: true,
      maxlength: 255,
    },
    addressLine2: {
      type: String,
      maxlength: 255,
    },
    city: {
      type: String,
      required: true,
      maxlength: 100,
    },
    state: {
      type: String,
      required: true,
      maxlength: 100,
    },
    postalCode: {
      type: String,
      required: true,
      maxlength: 20,
    },
    country: {
      type: String,
      required: true,
      maxlength: 100,
    },
    phone: {
      type: String,
      maxlength: 20,
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  },
);

export const OrderAddress = mongoose.model('OrderAddress', orderAddressSchema);
export const OrderItem = mongoose.model('OrderItem', orderItemSchema);
export const Order = mongoose.model('Order', orderSchema);
