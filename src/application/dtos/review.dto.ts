import {
  IsString,
  IsOptional,
  IsMongoId,
  IsDate,
  MaxLength,
  IsNumber,
  IsBoolean,
  Min,
  Max,
} from 'class-validator';

export class CreateReviewDto {
  @IsMongoId({ message: 'Invalid user ID' })
  userId: string;

  @IsMongoId({ message: 'Invalid product ID' })
  productId: string;

  @IsMongoId()
  @IsOptional()
  orderItemId?: string;

  @IsNumber()
  @Min(1, { message: 'Rating must be at least 1' })
  @Max(5, { message: 'Rating must be at most 5' })
  rating: number;

  @IsString()
  @IsOptional()
  @MaxLength(255)
  title?: string;

  @IsString()
  @IsOptional()
  comment?: string;
}

export class UpdateReviewDto {
  @IsNumber()
  @Min(1, { message: 'Rating must be at least 1' })
  @Max(5, { message: 'Rating must be at most 5' })
  @IsOptional()
  rating?: number;

  @IsString()
  @IsOptional()
  @MaxLength(255)
  title?: string;

  @IsString()
  @IsOptional()
  comment?: string;

  @IsBoolean()
  @IsOptional()
  isApproved?: boolean;
}

export class ReviewResponseDto {
  @IsMongoId()
  id: string;

  @IsMongoId()
  userId: string;

  @IsMongoId()
  productId: string;

  @IsMongoId()
  @IsOptional()
  orderItemId?: string;

  @IsNumber()
  rating: number;

  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  comment?: string;

  @IsBoolean()
  isVerifiedPurchase: boolean;

  @IsBoolean()
  isApproved: boolean;

  @IsNumber()
  helpfulCount: number;

  @IsDate()
  createdAt: Date;

  constructor(review: any) {
    this.id = review._id.toString();
    this.userId = review.userId.toString();
    this.productId = review.productId.toString();
    this.orderItemId = review.orderItemId?.toString();
    this.rating = review.rating;
    this.title = review.title;
    this.comment = review.comment;
    this.isVerifiedPurchase = review.isVerifiedPurchase;
    this.isApproved = review.isApproved;
    this.helpfulCount = review.helpfulCount;
    this.createdAt = review.createdAt;
  }
}
