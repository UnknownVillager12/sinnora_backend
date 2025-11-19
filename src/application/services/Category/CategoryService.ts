import { ICategory } from '@/domain/models/Category';
import { IRepository } from '@/infrastructure/repositories/GenericRepository';
import { AppError } from '@/interface/middleware/error/error';

export class CategoryService {
  constructor(private categoryRepository: IRepository<ICategory>) {}
  async getCategoryById(categoryId: string): Promise<ICategory | null> {
    const category = await this.categoryRepository.findById(categoryId);
    if (!category) throw new AppError('Category not found', 404);
    return category;
  }
  async getAllCategories(): Promise<ICategory[]> {
    const categories = await this.categoryRepository.findMany({});
    return categories;
  }
  async createCategory(
    categoryData: Partial<ICategory>,
  ): Promise<ICategory | null> {
    const existingCategory = await this.categoryRepository.findOne({
      name: categoryData.name,
    });
    if (existingCategory)
      throw new AppError('Category with this name already exists', 409);
    const newCategory = await this.categoryRepository.create(categoryData);
    if (!newCategory) throw new AppError('Failed to create category', 500);
    return newCategory;
  }
  async updateCategory(
    categoryId: string,
    updateData: Partial<ICategory>,
  ): Promise<ICategory | null> {
    const category = await this.categoryRepository.findById(categoryId);
    if (!category) throw new AppError('Category not found', 404);
    const updatedCategory = await this.categoryRepository.updateById(
      categoryId,
      updateData,
    );
    if (!updatedCategory) throw new AppError('Failed to update category', 500);
    return updatedCategory;
  }
  async deleteCategory(categoryId: string): Promise<boolean> {
    const result = await this.categoryRepository.deleteById(categoryId);
    if (!result) throw new AppError('Category not found', 404);
    return true;
  }
}
