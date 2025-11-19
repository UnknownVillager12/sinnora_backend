import { Router } from 'express';
import { Order, OrderAddress, OrderItem } from '@/domain/models/Order';
import { RepositoryFactory } from '@/infrastructure/repositories/GenericRepository';
import { OrderController } from '../controllers/order.controller';
import { OrderService } from '@/application/services/Order/OrderService';
import { CheckoutService } from '@/application/services/Checkout/CheckoutService';
import {
  CreateOrderDto,
  OrderDetailResponseDto,
} from '@/application/dtos/order.dto';
import { UseRequestDto, UseResponseDto } from '../middleware/validation';

const orderRepository = RepositoryFactory.createFull<any>(Order);
const orderItemRepository = RepositoryFactory.createFull<any>(OrderItem);
const orderAddressRepository = RepositoryFactory.createFull<any>(OrderAddress);
const checkoutService = new CheckoutService();

const orderService = new OrderService(
  orderRepository,
  orderItemRepository,
  orderAddressRepository,
  checkoutService,
);
const orderController = new OrderController(orderService);
const router = Router();

router
  .route('/')
  .post(
    UseRequestDto(CreateOrderDto),
    UseResponseDto(OrderDetailResponseDto),
    orderController.createOrder,
  );
router.route('/').get(orderController.getAllOrders);
router.route('/:id').get(orderController.getOrderById);
router.route('/:orderId/checkout').post(orderController.checkoutOrder);
export default router;
