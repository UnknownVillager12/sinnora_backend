import mongoose from 'mongoose';

export interface IUser {
  _id?: mongoose.Types.ObjectId;
  email?: string;
  password?: string;
  firstName: string;
  lastName?: string;
  phoneNumber: string;
  role: 'customer' | 'admin';
  isActive: boolean;
  emailVerified: boolean;
  emailVerifiedAt?: Date;
  gender?: 'female' | 'male' | 'other';
  lastLoginAt?: Date;
  dateOfBirth?: Date;
  accessToken?: string;
  refreshToken?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
export interface IUserAddress {
  _id?: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  type: 'home' | 'work' | 'billing' | 'shipping';
  firstName: string;
  lastName: string;
  company?: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone?: string;
  isDefault: boolean;
}
const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      // required: true,
      // unique: true,
      maxlength: 255,
    },
    // password: {
    //   type: String,
    //   required: true,
    //   maxlength: 255,
    // },
    firstName: {
      type: String,
      required: true,
      maxlength: 100,
      default: 'No Name',
    },
    lastName: {
      type: String,
      // required: true,
      maxlength: 100,
    },
    phoneNumber: {
      type: String,
      unique: true,
      required: true,
      maxlength: 20,
    },
    dateOfBirth: {
      type: Date,
    },
    gender: {
      type: String,
      enum: ['female', 'male', 'other'],
    },
    role: {
      type: String,
      enum: ['customer', 'admin'],
      default: 'customer',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    emailVerified: {
      type: Boolean,
      default: false,
    },
    emailVerifiedAt: {
      type: Date,
    },
    lastLoginAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  },
);
// hash passoword before save
// userSchema.pre('save', async function (next) {
//   if (!this.isModified('passwordHash')) return next();
//   try {
//     const salt = await bcrypt.genSalt(10);
//     this.password = await bcrypt.hash(this.password, salt);
//     next();
//   } catch (err) {
//     next(err as Error);
//   }
// });
// compare password method

const userAddressSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    type: {
      type: String,
      enum: ['home', 'work', 'billing', 'shipping'],
      default: 'home',
    },
    firstName: {
      type: String,
      required: true,
      maxlength: 100,
    },
    lastName: {
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
      default: 'India',
    },
    phone: {
      type: String,
      maxlength: 20,
    },
    isDefault: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);
export const User = mongoose.model('User', userSchema);
export const UserAddress = mongoose.model('UserAddress', userAddressSchema);
