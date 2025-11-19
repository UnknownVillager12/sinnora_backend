import { OrderService } from '@/application/services/Order/OrderService';
import { Request, Response } from 'express';

export class OrderController {
  // Placeholder for order controller methods
  private orderService: OrderService;
  constructor(orderService: OrderService) {
    this.orderService = orderService;
  }
  createOrder = async (req: Request, res: Response) => {
    const orderData = req.body;
    const newOrder = await this.orderService.createOrder(orderData);
    // console.log('New Order Created:', newOrder);
    return res.status(201).json(newOrder);
  };
  getAllOrders = async (req: any, res: Response) => {
    const userId = req.query?.userId || (req.user && req.user._id); 
    const orders = await this.orderService.getAllOrders(userId);
    return res.status(200).json(orders);
  };
  getOrderById = async (req: Request, res: Response) => {
    const orderId = req.params.id;
    const order = await this.orderService.getOrderById(orderId);
    return res.status(200).json(order);
  };
  checkoutOrder = async (req: Request, res: Response) => {
    const orderId = req.params.orderId;
    const checkoutOrder = await this.orderService.checkoutOrder(orderId);
    return res.status(200).json(checkoutOrder);
  };
}
