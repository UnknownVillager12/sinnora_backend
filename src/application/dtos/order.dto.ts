import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsMongoId,
  IsDate,
  IsObject,
  ValidateNested,
  MaxLength,
  Matches,
  IsNumber,
  IsEnum,
  Min,
  Max,
  IsArray,
  ArrayNotEmpty,
  IsDateString,
} from 'class-validator';
import { Type } from 'class-transformer';

// ================= ORDER ITEM DTOs =================

export class CreateOrderItemDto {
  @IsMongoId({ message: 'Invalid product ID' })
  @IsNotEmpty({ message: 'Product ID is required' })
  productId: string;

  @IsMongoId({ message: 'Invalid variant ID' })
  @IsOptional()
  variantId?: string;

  @IsNumber({}, { message: 'Quantity must be a number' })
  @Min(1, { message: 'Quantity must be at least 1' })
  @Max(999, { message: 'Quantity cannot exceed 999' })
  quantity: number;

  @IsNumber(
    { maxDecimalPlaces: 2 },
    {
      message: 'Unit price must be a valid decimal with up to 2 decimal places',
    },
  )
  @Min(0.01, { message: 'Unit price must be greater than 0' })
  unitPrice: number;

  @IsNumber()
  @Min(0.01, { message: 'Total price must be greater than 0' })
  totalPrice: number; 

  @IsString()
  @IsNotEmpty({ message: 'Product name is required' })
  @MaxLength(255, { message: 'Product name must not exceed 255 characters' })
  productName: string;

  @IsString()
  @IsNotEmpty({ message: 'Product SKU is required' })
  @MaxLength(100, { message: 'Product SKU must not exceed 100 characters' })
  productSku: string;
}

export class OrderItemResponseDto {
  @IsMongoId()
  _id: string;

  @IsMongoId()
  orderId: string;

  @IsMongoId()
  productId: string;

  @IsMongoId()
  @IsOptional()
  variantId?: string;

  @IsNumber()
  quantity: number;

  @IsNumber()
  unitPrice: number;

  @IsNumber()
  totalPrice: number;

  @IsString()
  productName: string;

  @IsString()
  productSku: string;

  @IsDate()
  createdAt: Date;

  constructor(item: any) {
    this._id = item._id?.toString();
    this.orderId = item.orderId?.toString();
    this.productId = item.productId?.toString();
    this.variantId = item.variantId?.toString();
    this.quantity = item.quantity;
    this.unitPrice = parseFloat(item.unitPrice?.toString() || '0');
    this.totalPrice = parseFloat(item.totalPrice?.toString() || '0');
    this.productName = item.productName;
    this.productSku = item.productSku;
    this.createdAt = item.createdAt;
  }
}

// ================= ORDER ADDRESS DTOs =================

export class CreateOrderAddressDto {
  @IsEnum(['billing', 'shipping'], {
    message: 'Address type must be either billing or shipping',
  })
  @IsNotEmpty({ message: 'Address type is required' })
  type: 'billing' | 'shipping';

  @IsString()
  @IsNotEmpty({ message: 'Name is required' })
  @MaxLength(100, { message: 'Name must not exceed 100 characters' })
  name: string;

  @IsString()
  @IsOptional()
  @MaxLength(100, { message: 'Company name must not exceed 100 characters' })
  company?: string;

  @IsString()
  @IsNotEmpty({ message: 'Address line 1 is required' })
  @MaxLength(255, { message: 'Address line 1 must not exceed 255 characters' })
  addressLine1: string;

  @IsString()
  @IsOptional()
  @MaxLength(255, { message: 'Address line 2 must not exceed 255 characters' })
  addressLine2?: string;

  @IsString()
  @IsNotEmpty({ message: 'City is required' })
  @MaxLength(100, { message: 'City must not exceed 100 characters' })
  city: string;

  @IsString()
  @IsNotEmpty({ message: 'State is required' })
  @MaxLength(100, { message: 'State must not exceed 100 characters' })
  state: string;

  @IsString()
  @IsNotEmpty({ message: 'Postal code is required' })
  @MaxLength(20, { message: 'Postal code must not exceed 20 characters' })
  @Matches(/^[A-Za-z0-9\s-]+$/, { message: 'Invalid postal code format' })
  postalCode: string;

  @IsString()
  @IsNotEmpty({ message: 'Country is required' })
  @MaxLength(100, { message: 'Country must not exceed 100 characters' })
  country: string;

  @IsString()
  @IsOptional()
  @MaxLength(20, { message: 'Phone number must not exceed 20 characters' })
  @Matches(/^[\+]?[1-9][\d]{0,15}$/, { message: 'Invalid phone number format' })
  phone?: string;
}

export class OrderAddressResponseDto {
  @IsMongoId()
  _id: string;

  @IsMongoId()
  orderId: string;

  @IsEnum(['billing', 'shipping'])
  type: 'billing' | 'shipping';

  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  company?: string;

  @IsString()
  addressLine1: string;

  @IsString()
  @IsOptional()
  addressLine2?: string;

  @IsString()
  city: string;

  @IsString()
  state: string;

  @IsString()
  postalCode: string;

  @IsString()
  country: string;

  @IsString()
  @IsOptional()
  phone?: string;

  @IsDate()
  createdAt: Date;

  constructor(address: any) {
    this._id = address._id?.toString();
    this.orderId = address.orderId?.toString();
    this.type = address.type;
    this.name = address.name;
    this.company = address.company;
    this.addressLine1 = address.addressLine1;
    this.addressLine2 = address.addressLine2;
    this.city = address.city;
    this.state = address.state;
    this.postalCode = address.postalCode;
    this.country = address.country;
    this.phone = address.phone;
    this.createdAt = address.createdAt;
  }
}

// ================= MAIN ORDER DTOs =================

export class CreateOrderDto {
  @IsMongoId({ message: 'Invalid user ID' })
  @IsNotEmpty({ message: 'User ID is required' })
  userId: string;

  @IsString()
  @IsNotEmpty({ message: 'Order number is required' })
  @MaxLength(50, { message: 'Order number must not exceed 50 characters' })
  orderNumber: string;

  @IsEnum(
    ['cod', 'credit_card', 'debit_card', 'upi', 'net_banking', 'wallet'],
    {
      message:
        'Payment method must be one of: cod, credit_card, debit_card, upi, net_banking, wallet',
    },
  )
  @IsNotEmpty({ message: 'Payment method is required' })
  paymentMethod:
    | 'cod'
    | 'credit_card'
    | 'debit_card'
    | 'upi'
    | 'net_banking'
    | 'wallet';

  @IsArray()
  @ArrayNotEmpty({ message: 'At least one order item is required' })
  @ValidateNested({ each: true })
  @Type(() => CreateOrderItemDto)
  items: CreateOrderItemDto[];

  @IsObject()
  @ValidateNested()
  @Type(() => CreateOrderAddressDto)
  @IsNotEmpty({ message: 'Billing address is required' })
  billingAddress: CreateOrderAddressDto;

  @IsObject()
  @ValidateNested()
  @Type(() => CreateOrderAddressDto)
  @IsNotEmpty({ message: 'Shipping address is required' })
  shippingAddress: CreateOrderAddressDto;

  @IsNumber(
    { maxDecimalPlaces: 2 },
    { message: 'Subtotal must be a valid decimal' },
  )
  @Min(0, { message: 'Subtotal must be greater than or equal to 0' })
  subtotal: number;

  @IsNumber(
    { maxDecimalPlaces: 2 },
    { message: 'Tax amount must be a valid decimal' },
  )
  @Min(0, { message: 'Tax amount must be greater than or equal to 0' })
  @IsOptional()
  taxAmount?: number;

  @IsNumber(
    { maxDecimalPlaces: 2 },
    { message: 'Shipping amount must be a valid decimal' },
  )
  @Min(0, { message: 'Shipping amount must be greater than or equal to 0' })
  @IsOptional()
  shippingAmount?: number;

  @IsNumber(
    { maxDecimalPlaces: 2 },
    { message: 'Discount amount must be a valid decimal' },
  )
  @Min(0, { message: 'Discount amount must be greater than or equal to 0' })
  @IsOptional()
  discountAmount?: number;

  @IsNumber(
    { maxDecimalPlaces: 2 },
    { message: 'Total amount must be a valid decimal' },
  )
  @Min(0.01, { message: 'Total amount must be greater than 0' })
  totalAmount: number;

  @IsString()
  @IsOptional()
  @MaxLength(3, { message: 'Currency code must be 3 characters' })
  @Matches(/^[A-Z]{3}$/, { message: 'Currency must be a valid 3-letter code' })
  currency?: string;

  @IsString()
  @IsOptional()
  @MaxLength(1000, { message: 'Notes must not exceed 1000 characters' })
  notes?: string;
}

export class UpdateOrderDto {
  @IsEnum(
    [
      'pending',
      'confirmed',
      'processing',
      'shipped',
      'delivered',
      'cancelled',
      'refunded',
    ],
    {
      message:
        'Status must be one of: pending, confirmed, processing, shipped, delivered, cancelled, refunded',
    },
  )
  @IsOptional()
  status?:
    | 'pending'
    | 'confirmed'
    | 'processing'
    | 'shipped'
    | 'delivered'
    | 'cancelled'
    | 'refunded';

  @IsEnum(['pending', 'paid', 'failed', 'refunded'], {
    message: 'Payment status must be one of: pending, paid, failed, refunded',
  })
  @IsOptional()
  paymentStatus?: 'pending' | 'paid' | 'failed' | 'refunded';

  @IsString()
  @IsOptional()
  @MaxLength(1000, { message: 'Notes must not exceed 1000 characters' })
  notes?: string;

  @IsDateString({}, { message: 'Shipped date must be a valid date' })
  @IsOptional()
  shippedAt?: string;

  @IsDateString({}, { message: 'Delivered date must be a valid date' })
  @IsOptional()
  deliveredAt?: string;

  @IsDateString({}, { message: 'Cancelled date must be a valid date' })
  @IsOptional()
  cancelledAt?: string;
}

export class OrderSummaryResponseDto {
  @IsMongoId()
  id: string;

  @IsString()
  orderNumber: string;

  @IsEnum([
    'pending',
    'confirmed',
    'processing',
    'shipped',
    'delivered',
    'cancelled',
    'refunded',
  ])
  status:
    | 'pending'
    | 'confirmed'
    | 'processing'
    | 'shipped'
    | 'delivered'
    | 'cancelled'
    | 'refunded';

  @IsEnum(['pending', 'paid', 'failed', 'refunded'])
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';

  @IsNumber()
  totalAmount: number;

  @IsString()
  currency: string;

  @IsNumber()
  itemCount: number;

  @IsDate()
  createdAt: Date;

  constructor(order: any, itemCount: number = 0) {
    this.id = order._id?.toString();
    this.orderNumber = order.orderNumber;
    this.status = order.status;
    this.paymentStatus = order.paymentStatus;
    this.totalAmount = parseFloat(order.totalAmount?.toString() || '0');
    this.currency = order.currency || 'INR';
    this.itemCount = itemCount;
    this.createdAt = order.createdAt;
  }
}

export class OrderDetailResponseDto {
  @IsMongoId()
  _id: string;

  @IsMongoId()
  userId: string;

  @IsString()
  orderNumber: string;

  @IsEnum([
    'pending',
    'confirmed',
    'processing',
    'shipped',
    'delivered',
    'cancelled',
    'refunded',
  ])
  status:
    | 'pending'
    | 'confirmed'
    | 'processing'
    | 'shipped'
    | 'delivered'
    | 'cancelled'
    | 'refunded';

  @IsEnum(['pending', 'paid', 'failed', 'refunded'])
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';

  @IsEnum(['cod', 'credit_card', 'debit_card', 'upi', 'net_banking', 'wallet'])
  paymentMethod:
    | 'cod'
    | 'credit_card'
    | 'debit_card'
    | 'upi'
    | 'net_banking'
    | 'wallet';

  @IsNumber()
  subtotal: number;

  @IsNumber()
  taxAmount: number;

  @IsNumber()
  shippingAmount: number;

  @IsNumber()
  discountAmount: number;

  @IsNumber()
  totalAmount: number;

  @IsString()
  currency: string;

  @IsString()
  @IsOptional()
  notes?: string;

  @IsDate()
  @IsOptional()
  shippedAt?: Date;

  @IsDate()
  @IsOptional()
  deliveredAt?: Date;

  @IsDate()
  @IsOptional()
  cancelledAt?: Date;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemResponseDto)
  items: OrderItemResponseDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderAddressResponseDto)
  addresses: OrderAddressResponseDto[];

  @IsDate()
  createdAt: Date;

  @IsDate()
  updatedAt: Date;

  constructor(order: any, items: any[] = [], addresses: any[] = []) {
    this._id = order._id?.toString();
    this.userId = order.userId?.toString();
    this.orderNumber = order.orderNumber;
    this.status = order.status;
    this.paymentStatus = order.paymentStatus;
    this.paymentMethod = order.paymentMethod;
    this.subtotal = parseFloat(order.subtotal?.toString() || '0');
    this.taxAmount = parseFloat(order.taxAmount?.toString() || '0');
    this.shippingAmount = parseFloat(order.shippingAmount?.toString() || '0');
    this.discountAmount = parseFloat(order.discountAmount?.toString() || '0');
    this.totalAmount = parseFloat(order.totalAmount?.toString() || '0');
    this.currency = order.currency || 'INR';
    this.notes = order.notes;
    this.shippedAt = order.shippedAt;
    this.deliveredAt = order.deliveredAt;
    this.cancelledAt = order.cancelledAt;
    this.items = items.map(item => new OrderItemResponseDto(item));
    this.addresses = addresses.map(
      address => new OrderAddressResponseDto(address),
    );
    this.createdAt = order.createdAt;
    this.updatedAt = order.updatedAt;
  }
}