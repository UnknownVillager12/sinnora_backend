import { CreateProductDto } from '@/application/dtos/product.dto';
import { IProduct, IProductVariant } from '@/domain/models/Product';
import { IRepository } from '@/infrastructure/repositories/GenericRepository';
import { AppError } from '@/interface/middleware/error/error';

export class ProductService {
  private productRepository: IRepository<IProduct>;
  private productVariantRepository: IRepository<IProductVariant>;
  constructor(
    productRepository: IRepository<IProduct>,
    productVariantRepository: IRepository<IProductVariant>,
  ) {
    this.productRepository = productRepository;
    this.productVariantRepository = productVariantRepository;
  }
  getProductById = async (productId: string): Promise<IProduct> => {
    const product = await this.productRepository.findById(productId);
    if (!product) throw new AppError('Product not found', 404);
    return product;
  };
  getAllProducts = async (): Promise<Partial<IProduct[]>> => {
    const products = await this.productRepository.findMany({
      
    });
    return products;
  };
  createProduct = async (
    productData: CreateProductDto,
  ): Promise<IProduct | null> => {
    return await this.productRepository.withTransaction(async session => {
      const { variants, ...productDetail } = productData;

      const existingProduct = await this.productRepository.findOne(
        {
          name: productDetail.name,
        },
        { session },
      );
      if (existingProduct) {
        throw new AppError(
          'Product with this name already exists',
          409,
        );
      }

      const newProduct = await this.productRepository.create(productDetail, {
        session,
      });
      if(!newProduct) throw new AppError('Failed to create product', 500);
      let productVariant = variants?.map(variant => ({
        ...variant,
        productId: newProduct?._id,
      }));
      const productVariantResponse =
        await this.productVariantRepository.createMany(productVariant || [], {
          session,
        });
      if (!newProduct) throw new AppError('Failed to create product', 500);
      newProduct.variants = productVariantResponse;
      return newProduct;
    });
  };
  updateProduct = async (
    productId: string,
    updateData: any,
  ): Promise<Partial<any>> => {
    // return variant also if updated

    const product = await this.productRepository.findById(productId);
    
    if (!product) throw new AppError('Product not found', 404);
    const updatedProduct = await this.productRepository.updateById(
      productId,
      updateData,
    );
    if (!updatedProduct) throw new AppError('Failed to update product', 500);
    const variants = await this.productVariantRepository.findMany({
      productId: productId,
    });
    updatedProduct.variants = variants||[];
 
    return {updatedProduct};
  };
  deleteProduct = async (productId: string): Promise<boolean> => {
    const result = await this.productRepository.deleteById(productId);
    if (!result) throw new AppError('Product not found', 404);
    return true;
  };
}
