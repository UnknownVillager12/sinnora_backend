import mongoose from 'mongoose';

export interface ICategory {
  name: string;
  slug: string;
  description: string;
  parentId: mongoose.Types.ObjectId;
  imageUrl: string;
  isActive: boolean;
  sortOrder: number;
  metaTitle: string;
  metaDescription: string;
  createdAt?: Date;
  updatedAt?: Date;
}
const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      maxlength: 100,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      maxlength: 100,
    },
    description: {
      type: String,
    },
    parentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
    },
    imageUrl: {
      type: String,
      maxlength: 500,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    sortOrder: {
      type: Number,
      default: 0,
    },
    metaTitle: {
      type: String,
      maxlength: 255,
    },
    metaDescription: {
      type: String,
      maxlength: 500,
    },
  },
  {
    timestamps: true,
  },
);

export const Category = mongoose.model('Category', categorySchema);
