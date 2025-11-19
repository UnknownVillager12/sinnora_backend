import mongoose from 'mongoose';

export interface IProduct {
  _id?: string;
  name: string;
  description?: string;
  shortDescription?: string;
  brandId?: any;
  categoryId?: any;
  price: number;
  salePrice?: number;
  stockQuantity: number;
  weight?: number;
  size?: string;
  careInstructions?: string;
  warrantyPeriod?: number;
  isFeatured: boolean;
  isActive: boolean;
  imageUrl?: IProductImage[];
  variants?: IProductVariant[];
  status: 'draft' | 'active' | 'inactive' | 'out_of_stock';
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IProductImage {
  _id?: string;
  imageUrl: string;
  public_id: string
  createdAt?: Date;
}

export interface IProductVariant {
  _id?: string;
  productId: string;
  variantType: string;
  variantValue: string;
  priceAdjustment: number;
  stockQuantity: number;
  imageUrl?: IProductImage[];
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
const productImageSchema = new mongoose.Schema(
  {
    imageUrl: {
      type: String,
      required: true,
      maxlength: 500,
    },
    public_id: {
      type: String
    }

  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  },
);

const productVariantSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    variantType: {
      type: String,
      required: true,
      maxlength: 50,
    },
    variantValue: {
      type: String,
      required: true,
      maxlength: 100,
    },
    priceAdjustment: {
      type: Number,
      default: 0,
    },
    stockQuantity: {
      type: Number,
      default: 0,
    },

    imageUrl: {
      type: [productImageSchema],

    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
);
const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      maxlength: 255,
    },
    description: {
      type: String,
    },
    shortDescription: {
      type: String,
    },
    categoryId: {
      type: String,
    },
    price: {
      type: Number,
      required: true,
    },
    salePrice: {
      type: Number,
    },
    stockQuantity: {
      type: Number,
      default: 0,
    },
    weight: {
      type: Number,
    },
    size: {
      type: String,
      maxlength: 20,
    },
    careInstructions: {
      type: String,
    },
    warrantyPeriod: {
      type: Number,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    imageUrl: {
      type: [productImageSchema],
      maxlength: 500,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    status: {
      type: String,
      enum: ['draft', 'active', 'inactive', 'out_of_stock'],
      default: 'draft',
    },
  },
  {
    timestamps: true,
  },
);

export const ProductImage = mongoose.model('ProductImage', productImageSchema);
export const ProductVariant = mongoose.model(
  'ProductVariant',
  productVariantSchema,
);
export const Product = mongoose.model('Product', productSchema);
