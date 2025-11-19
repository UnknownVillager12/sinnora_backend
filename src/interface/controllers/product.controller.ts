import { ProductService } from '@/application/services';
import { Request, Response } from 'express';

export class ProductController {
  private productService: ProductService;
  constructor(productService: ProductService) {
    this.productService = productService;
  }

  createProduct = async (req: Request, res: Response) => {
    const productData = req.body;
    const newProduct = await this.productService.createProduct(productData);
    return res.status(201).json(newProduct);
  };

  getAllProducts = async (req: Request, res: Response) => {
    const products = await this.productService.getAllProducts();
    return res.status(200).json(products);
  };

  getProductById = async (req: Request, res: Response) => {
    const productId = req.params.id;
    const product = await this.productService.getProductById(productId);
    return res.status(200).json(product);
  };

  updateProduct = async (req: Request, res: Response) => {
    const productId = req.params.id;
    const updateData = req.body;
    const updatedProduct = await this.productService.updateProduct(
      productId,
      updateData,
    );
    return res.status(200).json(updatedProduct);
  };

  deleteProduct = async (req: Request, res: Response) => {
    const productId = req.params.id;
    await this.productService.deleteProduct(productId);
    return res.status(204).send({

      message: 'Product deleted successfully',
    }
    );
  };
}
