import { Type } from 'class-transformer';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsUrl,
  IsMongoId,
  IsDate,
  MaxLength,
  IsNumber,
  IsBoolean,
  IsEnum,
  Min,
  IsArray,
  ValidateNested,
} from 'class-validator';

export class ImageSchemaDto {
  @IsString()
  @IsUrl({}, { message: 'Please provide a valid image URL' })
  @IsNotEmpty({ message: 'Image URL is required' })
  imageUrl: string;

  @IsString()
  @IsOptional()
  @IsNotEmpty({ message: 'Public ID is required' })
  public_id: string;
}

export class CreateProductDto {
  @IsString()
  @IsNotEmpty({ message: 'Name is required' })
  @MaxLength(255)
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  shortDescription?: string;

  @IsString()
  @IsOptional()
  categoryId?: string;

  @IsNumber()
  @Min(0)
  @IsNotEmpty({ message: 'Price is required' })
  price: number;

  @IsNumber()
  @Min(0)
  @IsOptional()
  salePrice?: number;

  @IsNumber()
  @Min(0)
  @IsOptional()
  stockQuantity?: number;

  @IsNumber()
  @Min(0)
  @IsOptional()
  weight?: number;

  @IsString()
  @IsOptional()
  @MaxLength(20)
  size?: string;

  @IsString()
  @IsOptional()
  careInstructions?: string;

  @IsNumber()
  @Min(0)
  @IsOptional()
  warrantyPeriod?: number;

  @IsBoolean()
  @IsOptional()
  isFeatured?: boolean;

  @ValidateNested()
  @IsNotEmpty({ message: 'Image is required' })
  @Type(() => ImageSchemaDto)
  imageUrl: ImageSchemaDto[];

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @IsEnum(['draft', 'active', 'inactive', 'out_of_stock'])
  @IsOptional()
  status?: 'draft' | 'active' | 'inactive' | 'out_of_stock';

  @IsArray()
  @ValidateNested({ each: true })
  @IsNotEmpty({ message: 'At least one variant is required' })
  @Type(() => CreateProductVariantDto)
  variants?: CreateProductVariantDto[];
}

export class UpdateProductDto {
  @IsString()
  @IsOptional()
  @MaxLength(255)
  name?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  shortDescription?: string;

  @IsString()
  @IsOptional()
  categoryId?: string;

  @IsNumber()
  @Min(0)
  @IsOptional()
  price?: number;

  @IsNumber()
  @Min(0)
  @IsOptional()
  salePrice?: number;

  @IsNumber()
  @Min(0)
  @IsOptional()
  stockQuantity?: number;

  @IsNumber()
  @Min(0)
  @IsOptional()
  weight?: number;

  @IsString()
  @IsOptional()
  @MaxLength(20)
  size?: string;

  @IsString()
  @IsOptional()
  careInstructions?: string;

  @IsNumber()
  @Min(0)
  @IsOptional()
  warrantyPeriod?: number;

  @IsBoolean()
  @IsOptional()
  isFeatured?: boolean;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @ValidateNested()
  @IsOptional()
  @Type(() => ImageSchemaDto)
  imageUrl?: ImageSchemaDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @IsOptional()
  @Type(() => UpdateProductVariantDto)
  variants?: UpdateProductVariantDto[];

  @IsEnum(['draft', 'active', 'inactive', 'out_of_stock'])
  @IsOptional()
  status?: 'draft' | 'active' | 'inactive' | 'out_of_stock';
}

export class ProductResponseDto {
  @IsMongoId()
  _id: string;

  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  shortDescription?: string;

  @IsMongoId()
  @IsOptional()
  brandId?: string;

  @IsMongoId()
  @IsOptional()
  categoryId?: string;

  @IsNumber()
  price: number;

  @IsNumber()
  @IsOptional()
  salePrice?: number;

  @IsNumber()
  stockQuantity: number;

  @IsNumber()
  @IsOptional()
  weight?: number;

  @IsString()
  @IsOptional()
  size?: string;

  @IsString()
  @IsOptional()
  careInstructions?: string;

  @IsNumber()
  @IsOptional()
  warrantyPeriod?: number;

  @IsBoolean()
  isFeatured: boolean;

  @IsBoolean()
  isActive: boolean;

  @IsEnum(['draft', 'active', 'inactive', 'out_of_stock'])
  status: 'draft' | 'active' | 'inactive' | 'out_of_stock';

  @IsDate()
  createdAt: Date;

  @IsDate()
  updatedAt: Date;

  constructor(product: any) {
    this._id = product._id.toString();
    this.name = product.name;
    this.description = product.description;
    this.shortDescription = product.shortDescription;
    this.brandId = product.brandId?.toString();
    this.categoryId = product.categoryId?.toString();
    this.price = parseFloat(product.price?.toString() || '0');
    this.salePrice = product.salePrice
      ? parseFloat(product.salePrice.toString())
      : undefined;
    this.stockQuantity = product.stockQuantity || 0;
    this.weight = product.weight
      ? parseFloat(product.weight.toString())
      : undefined;
    this.size = product.size;
    this.careInstructions = product.careInstructions;
    this.warrantyPeriod = product.warrantyPeriod;
    this.isFeatured = product.isFeatured || false;
    this.isActive = product.isActive !== undefined ? product.isActive : true;
    this.status = product.status || 'draft';
    this.createdAt = product.createdAt;
    this.updatedAt = product.updatedAt;
  }
}

// ================= PRODUCT VARIANT DTOs =================

export class CreateProductVariantDto {
  @IsMongoId()
  @IsOptional()
  @IsNotEmpty({ message: 'Product ID is required' })
  productId: string;

  @IsString()
  @IsNotEmpty({ message: 'Variant type is required' })
  @MaxLength(50)
  variantType: string;

  @IsString()
  @IsNotEmpty({ message: 'Variant value is required' })
  @MaxLength(100)
  variantValue: string;

  @IsNumber()
  @IsOptional()
  priceAdjustment?: number;

  @IsNumber()
  @Min(0)
  @IsOptional()
  stockQuantity?: number;

  @ValidateNested()
  @Type(() => ImageSchemaDto)
  @IsNotEmpty({ message: 'Image is required' })
  imageUrl: ImageSchemaDto[];

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}

export class UpdateProductVariantDto {
  @IsMongoId()
  @IsOptional()
  productId?: string;

  @IsString()
  @IsOptional()
  @MaxLength(50)
  variantType?: string;

  @IsString()
  @IsOptional()
  @MaxLength(100)
  variantValue?: string;

  @IsNumber()
  @IsOptional()
  priceAdjustment?: number;

  @IsNumber()
  @Min(0)
  @IsOptional()
  stockQuantity?: number;

  @ValidateNested()
  @Type(() => ImageSchemaDto)
  @IsOptional()
  imageUrl?: ImageSchemaDto;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}

export class ProductVariantResponseDto {
  @IsMongoId()
  _id: string;

  @IsMongoId()
  productId: string;

  @IsString()
  variantType: string;

  @IsString()
  variantValue: string;

  @IsNumber()
  priceAdjustment: number;

  @IsNumber()
  stockQuantity: number;

  @ValidateNested()
  @Type(() => ImageSchemaDto)
  @IsOptional()
  imageUrl?: ImageSchemaDto;

  @IsBoolean()
  isActive: boolean;

  @IsDate()
  createdAt: Date;

  @IsDate()
  updatedAt: Date;

  constructor(variant: any) {
    this._id = variant._id.toString();
    this.productId = variant.productId.toString();
    this.variantType = variant.variantType;
    this.variantValue = variant.variantValue;
    this.priceAdjustment = variant.priceAdjustment || 0;
    this.stockQuantity = variant.stockQuantity || 0;
    this.imageUrl = variant.imageUrl;
    this.isActive = variant.isActive !== undefined ? variant.isActive : true;
    this.createdAt = variant.createdAt;
    this.updatedAt = variant.updatedAt;
  }
}