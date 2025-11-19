import { CreateOrderDto } from '@/application/dtos/order.dto';
import mongoose from 'mongoose';
import { IOrder, IOrderAddress, IOrderItem } from '@/domain/models/Order';
import { IRepository } from '@/infrastructure/repositories/GenericRepository';
import { AppError } from '@/interface/middleware/error/error';
import { CheckoutService } from '../Checkout/CheckoutService';

export class OrderService {
  constructor(
    private orderRepository: IRepository<IOrder>,
    private orderItemRepository: IRepository<IOrderItem>,
    private orderAddressRepository: IRepository<IOrderAddress>,
    private checkoutService: CheckoutService,
  ) {
    this.orderRepository = orderRepository;
    this.orderItemRepository = orderItemRepository;
    this.orderAddressRepository = orderAddressRepository;
    this.checkoutService = checkoutService;
  }
  generateOrderNumber = async () => {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000)
      .toString()
      .padStart(3, '0');
    const orderNumber = `ORD-${timestamp}-${random}`;

    const existing = await this.orderRepository.findOne({ orderNumber });
    if (existing) {
      return this.generateOrderNumber(); // Recursively generate a new one if collision occurs
    }

    return orderNumber;
  }
  createOrder = async (orderData: CreateOrderDto): Promise<any | null> => {
    const { items, billingAddress, shippingAddress, ...orderDetails } = orderData;
    const orderNumber = await this.generateOrderNumber();

    return await this.orderRepository.withTransaction(async session => {
      const order = await this.orderRepository.create(
        {
          ...orderDetails,
          orderNumber,
          userId: new mongoose.Types.ObjectId(orderDetails.userId),
        },
        { session },
      );

      if (!order) throw new AppError('Order creation failed', 500);

      // Save order items and addresses
      const orderItems = items.map(item => ({
        insertOne: {
          document: {
            ...item,
            productId: new mongoose.Types.ObjectId(item.productId), // Ensure productId is ObjectId
            orderId: order._id,
          },
        },
      }));

      await this.orderItemRepository.bulkWrite(orderItems, { session });

      const addresses = [];
      if (billingAddress) {
        addresses.push({
          insertOne: {
            document: {
              ...billingAddress,
              orderId: order._id,
              type: 'billing',
            },
          },
        });
      }
      if (shippingAddress) {
        addresses.push({
          insertOne: {
            document: {
              ...shippingAddress,
              orderId: order._id,
              type: 'shipping',
            },
          },
        });
      }
      if (addresses.length > 0) {
        await this.orderAddressRepository.bulkWrite(addresses, { session });
      }

      // Fetch the saved data within the session to ensure consistency
      const savedOrderItems = await this.orderItemRepository.findMany(
        {
          orderId: order._id,
        },
        { session },
      );

      const orderAddresses = await this.orderAddressRepository.findMany(
        {
          orderId: order._id,
        },
        { session },
      );

      return order;
    });
  };
  getOrderById = async (orderId: string): Promise<any | null> => {
    const order = await this.orderRepository.findById(orderId);
    if (!order) return null;
    const items = await this.orderItemRepository.findMany({
      orderId: order._id,
    });
    const addresses = await this.orderAddressRepository.findMany({
      orderId: order._id,
    });
    return {
      _id: order._id,
      ...order,
      items,
      addresses,
    };
  }

  getAllOrders = async (userId?: string): Promise<any[]> => {
    const filter: any = {};
    if (userId) {
      try {
        filter.userId = new mongoose.Types.ObjectId(userId);
      } catch {
        filter.userId = userId;
      }
    }

    const orders = await this.orderRepository.findMany(filter);

    const enrichedOrders = await Promise.all(
      orders.map(async order => {
        const items = await this.orderItemRepository.findMany({ orderId: order._id });
        const addresses = await this.orderAddressRepository.findMany({ orderId: order._id });

        return {
          _id: order._id,
          ...order,
          items: items,
          addresses,
        };
      }),
    );

    return enrichedOrders;
  }
  checkoutOrder = async (orderId: string) => {
    const orderExists = await this.orderRepository.findById(orderId);
    if (!orderExists) {
      throw new AppError('Order not found', 404);
    }
    const checkoutOrder = await this.checkoutService.createRazorpayOrder(
      orderExists.totalAmount,
      'INR',
      `receipt_${orderId}_${Date.now()}`,
    );
    return {
      orderId: orderId,
      amount: checkoutOrder.amount / 100,
      currency: checkoutOrder.currency,
      receipt: checkoutOrder.receipt,
      status: checkoutOrder.status,
    };
  }
}
