import {
  IsString,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  MinLength,
  IsMongoId,
  IsDate,
  IsObject,
  ValidateNested,
  MaxLength,
  Matches,
  IsBoolean,
  IsEnum,
  IsDateString,
  IsPhoneNumber,
} from 'class-validator';
import { Type, Transform } from 'class-transformer';

export class CreateUserDto {
  @IsEmail({}, { message: 'Please provide a valid email' })
  @IsNotEmpty({ message: 'Email is required' })
  @MaxLength(255)
  @Transform(({ value }) => value?.toLowerCase?.())
  email: string;

  @IsString()
  @IsNotEmpty({ message: 'Password is required' })
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  @MaxLength(100)
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
    {
      message:
        'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
    },
  )
  password: string;

  @IsString()
  @IsNotEmpty({ message: 'First name is required' })
  @MaxLength(100)
  @MinLength(2)
  firstName: string;

  @IsString()
  @IsNotEmpty({ message: 'Last name is required' })
  @MaxLength(100)
  lastName: string;

  @IsString()
  @IsOptional()
  @MaxLength(20)
  phoneNumber?: string;

  @IsDate()
  @IsOptional()
  @Transform(({ value }) => (value ? new Date(value) : value))
  dateOfBirth?: Date;

  @IsEnum(['female', 'male', 'other'])
  @IsOptional()
  gender?: 'female' | 'male' | 'other';

  @IsEnum(['customer', 'admin'])
  @IsOptional()
  role?: 'customer' | 'admin';
}

export class UpdateUserDto {
  @IsEmail({}, { message: 'Please provide a valid email' })
  @IsOptional()
  @MaxLength(255)
  email?: string;

  @IsString()
  @IsOptional()
  @MinLength(8)
  @MaxLength(100)
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
    { message: 'Password must meet complexity requirements' },
  )
  password?: string;

  @IsString()
  @IsOptional()
  @MaxLength(100)
  firstName?: string;

  @IsString()
  @IsOptional()
  @MaxLength(100)
  lastName?: string;

  @IsString()
  @IsOptional()
  @MaxLength(20)
  phoneNumber?: string;

  @IsDateString()
  @IsOptional()
  dateOfBirth?: string;

  @IsEnum(['female', 'male', 'other'])
  @IsOptional()
  gender?: 'female' | 'male' | 'other';

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}

export class UserResponseDto {
  @IsString()
  _id: string;

  @IsEmail()
  email: string;

  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsString()
  @IsOptional()
  phoneNumber?: string;

  @IsDateString()
  @IsOptional()
  dateOfBirth?: Date;

  @IsEnum(['female', 'male', 'other'])
  @IsOptional()
  gender?: 'female' | 'male' | 'other';

  @IsEnum(['customer', 'admin'])
  role: 'customer' | 'admin';

  @IsBoolean()
  isActive: boolean;

  @IsBoolean()
  emailVerified: boolean;

  @IsDate()
  createdAt: Date;

  @IsString()
  @IsOptional()
  accessToken?: string;

  @IsString()
  @IsOptional()
  refreshToken?: string;

  constructor(user: any) {
    this._id = user._id.toString();
    this.email = user.email;
    this.firstName = user.firstName;
    this.lastName = user.lastName;
    this.phoneNumber = user.phoneNumber;
    this.dateOfBirth = user.dateOfBirth;
    this.gender = user.gender;
    this.role = user.role;
    this.isActive = user.isActive;
    this.emailVerified = user.emailVerified;
    this.accessToken = user.accessToken;
    this.refreshToken = user.refreshToken;
    this.createdAt = user.createdAt;
  }
}

export class UserLoginDto {
  // @IsPhoneNumber(null, { message: 'Please provide a valid phone number' })
  @IsNotEmpty({ message: 'Phone Number is required' })
  phoneNumber: string;

  // @IsString()
  // @IsNotEmpty({ message: 'Password is required' })
  // password: string;
}

export class UserLoginResponseDto {
  @IsString()
  token: string;

  @IsObject()
  @ValidateNested()
  @Type(() => UserResponseDto)
  user: UserResponseDto;

  constructor(token: string, user: UserResponseDto) {
    this.token = token;
    this.user = user;
  }
}

// ================= USER ADDRESS DTOs =================

export class CreateUserAddressDto {
  @IsMongoId({ message: 'Invalid user ID' })
  userId: string;

  @IsEnum(['home', 'work', 'billing', 'shipping'])
  @IsOptional()
  type?: 'home' | 'work' | 'billing' | 'shipping';

  @IsString()
  @IsNotEmpty({ message: 'First name is required' })
  @MaxLength(100)
  firstName: string;

  @IsString()
  @IsNotEmpty({ message: 'Last name is required' })
  @MaxLength(100)
  lastName: string;

  @IsString()
  @IsOptional()
  @MaxLength(100)
  company?: string;

  @IsString()
  @IsNotEmpty({ message: 'Address line 1 is required' })
  @MaxLength(255)
  addressLine1: string;

  @IsString()
  @IsOptional()
  @MaxLength(255)
  addressLine2?: string;

  @IsString()
  @IsNotEmpty({ message: 'City is required' })
  @MaxLength(100)
  city: string;

  @IsString()
  @IsNotEmpty({ message: 'State is required' })
  @MaxLength(100)
  state: string;

  @IsString()
  @IsNotEmpty({ message: 'Postal code is required' })
  @MaxLength(20)
  postalCode: string;

  @IsString()
  @IsOptional()
  @MaxLength(100)
  country?: string;

  @IsString()
  @IsOptional()
  @MaxLength(20)
  phoneNumber?: string;

  @IsBoolean()
  @IsOptional()
  isDefault?: boolean;
}

export class UpdateUserAddressDto {
  @IsEnum(['home', 'work', 'billing', 'shipping'])
  @IsOptional()
  type?: 'home' | 'work' | 'billing' | 'shipping';

  @IsString()
  @IsOptional()
  @MaxLength(100)
  firstName?: string;

  @IsString()
  @IsOptional()
  @MaxLength(100)
  lastName?: string;

  @IsString()
  @IsOptional()
  @MaxLength(100)
  company?: string;

  @IsString()
  @IsOptional()
  @MaxLength(255)
  addressLine1?: string;

  @IsString()
  @IsOptional()
  @MaxLength(255)
  addressLine2?: string;

  @IsString()
  @IsOptional()
  @MaxLength(100)
  city?: string;

  @IsString()
  @IsOptional()
  @MaxLength(100)
  state?: string;

  @IsString()
  @IsOptional()
  @MaxLength(20)
  postalCode?: string;

  @IsString()
  @IsOptional()
  @MaxLength(100)
  country?: string;

  @IsString()
  @IsOptional()
  @MaxLength(20)
  phoneNumber?: string;

  @IsBoolean()
  @IsOptional()
  isDefault?: boolean;
}

export class UserAddressResponseDto {
  @IsMongoId()
  id: string;

  @IsMongoId()
  userId: string;

  @IsEnum(['home', 'work', 'billing', 'shipping'])
  type: 'home' | 'work' | 'billing' | 'shipping';

  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

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
  phoneNumber?: string;

  @IsBoolean()
  isDefault: boolean;

  @IsDate()
  createdAt: Date;

  constructor(address: any) {
    this.id = address._id.toString();
    this.userId = address.userId.toString();
    this.type = address.type;
    this.firstName = address.firstName;
    this.lastName = address.lastName;
    this.company = address.company;
    this.addressLine1 = address.addressLine1;
    this.addressLine2 = address.addressLine2;
    this.city = address.city;
    this.state = address.state;
    this.postalCode = address.postalCode;
    this.country = address.country;
    this.phoneNumber = address.phoneNumber;
    this.isDefault = address.isDefault;
    this.createdAt = address.createdAt;
  }
}
