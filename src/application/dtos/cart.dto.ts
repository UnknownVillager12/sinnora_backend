import {
  IsString,
  IsOptional,
  IsMongoId,
  IsDate,
  ValidateNested,
  IsNumber,
  Min,
  IsArray,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateCartItemDto {
  @IsMongoId({ message: 'Invalid product ID' })
  productId: string;

  @IsMongoId()
  @IsOptional()
  variantId?: string;

  @IsNumber()
  @Min(1, { message: 'Quantity must be at least 1' })
  quantity: number;
}

export class UpdateCartItemDto {
  @IsNumber()
  @Min(1, { message: 'Quantity must be at least 1' })
  quantity: number;
}

export class CartItemResponseDto {
  @IsMongoId()
  id: string;

  @IsMongoId()
  productId: string;

  @IsMongoId()
  @IsOptional()
  variantId?: string;

  @IsNumber()
  quantity: number;

  @IsNumber()
  price: number;

  @IsDate()
  createdAt: Date;

  constructor(item: any) {
    this.id = item._id.toString();
    this.productId = item.productId.toString();
    this.variantId = item.variantId?.toString();
    this.quantity = item.quantity;
    this.price = parseFloat(item.price.toString());
    this.createdAt = item.createdAt;
  }
}

export class CartResponseDto {
  @IsMongoId()
  id: string;

  @IsMongoId()
  @IsOptional()
  userId?: string;

  @IsString()
  @IsOptional()
  sessionId?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CartItemResponseDto)
  items: CartItemResponseDto[];

  @IsDate()
  createdAt: Date;

  constructor(cart: any, items: any[]) {
    this.id = cart._id.toString();
    this.userId = cart.userId?.toString();
    this.sessionId = cart.sessionId;
    this.items = items.map(item => new CartItemResponseDto(item));
    this.createdAt = cart.createdAt;
  }
}
