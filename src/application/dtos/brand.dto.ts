import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsUrl,
  IsMongoId,
  IsDate,
  MaxLength,
  Matches,
  IsBoolean,
} from 'class-validator';
export class CreateBrandDto {
  @IsString()
  @IsNotEmpty({ message: 'Name is required' })
  @MaxLength(100)
  name: string;

  @IsString()
  @IsNotEmpty({ message: 'Slug is required' })
  @MaxLength(100)
  @Matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
    message: 'Slug must be lowercase and can contain hyphens',
  })
  slug: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsUrl({}, { message: 'Please provide a valid logo URL' })
  @IsOptional()
  @MaxLength(500)
  logoUrl?: string;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}

export class UpdateBrandDto {
  @IsString()
  @IsOptional()
  @MaxLength(100)
  name?: string;

  @IsString()
  @IsOptional()
  @MaxLength(100)
  @Matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
    message: 'Slug must be lowercase and can contain hyphens',
  })
  slug?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsUrl({}, { message: 'Please provide a valid logo URL' })
  @IsOptional()
  @MaxLength(500)
  logoUrl?: string;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}

export class BrandResponseDto {
  @IsMongoId()
  id: string;

  @IsString()
  name: string;

  @IsString()
  slug: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsUrl()
  @IsOptional()
  logoUrl?: string;

  @IsBoolean()
  isActive: boolean;

  @IsDate()
  createdAt: Date;

  constructor(brand: any) {
    this.id = brand._id.toString();
    this.name = brand.name;
    this.slug = brand.slug;
    this.description = brand.description;
    this.logoUrl = brand.logoUrl;
    this.isActive = brand.isActive;
    this.createdAt = brand.createdAt;
  }
}
