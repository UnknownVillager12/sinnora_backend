import { Router } from 'express';
import { ProductService } from '@/application/services';
import { Product, ProductVariant } from '@/domain/models/Product';
import { RepositoryFactory } from '@/infrastructure/repositories/GenericRepository';
import { ProductController } from '../controllers/product.controller';
import { UseRequestDto, UseResponseDto } from '../middleware/validation';
import {
  CreateProductDto,
  ProductResponseDto,
  UpdateProductDto,
} from '@/application/dtos/product.dto';
// import { IsAdministrator } from '../middleware/auth/auth-guard';
const productRepository = RepositoryFactory.createFull<any>(Product);
const productVariantRepository =
  RepositoryFactory.createFull<any>(ProductVariant);
const productService = new ProductService(
  productRepository,
  productVariantRepository,
);
const productController = new ProductController(productService);
const router = Router();
router.route('/').post(
  // IsAdministrator,
  UseRequestDto(CreateProductDto),
  UseResponseDto(ProductResponseDto),
  productController.createProduct,
);
router.route('/').get(productController.getAllProducts);
router.route('/:id').get(productController.getProductById);
router.route('/:id').put(
  // IsAdministrator,
  UseRequestDto(UpdateProductDto),
  productController.updateProduct,
);
router.route('/:id').delete(productController.deleteProduct);

export default router;
