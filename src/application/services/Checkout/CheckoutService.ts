import { IOrder } from '@/domain/models/Order';
import { IRepository } from '@/infrastructure/repositories/GenericRepository';
import { ProductService } from '../Product/ProductService';
import { Logger } from '@/config';
// import { razorpay } from "@/config/razorpay";
import { AppError } from '@/interface/middleware/error/error';
let razorpay:any ={}
export class CheckoutService {
  private razorpayKey: string | undefined;
  private orderRepository: IRepository<IOrder>;
  private productService: ProductService;
  constructor() {
    // this.razorpayKey = process.env.RAZORPAY_KEY_ID;
  }
  getRazorpayKey = (): string | undefined => {
    return this.razorpayKey;
  };
  validateRazorpayConfig = () => {
    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
      Logger.warn(
        'Razorpay credentials not configured. Payment features will be limited.',
      );
      return false;
    }
    return true;
  };
  createRazorpayOrder = async (amount, currency = 'INR', receipt = null) => {
    if (!this.validateRazorpayConfig()) {
      throw new Error('Razorpay not configured');
    }
    const options = {
      amount: amount * 100,
      currency,
      receipt: receipt || `receipt_${Date.now()}`,
    };
    const order = await razorpay.orders.create(options);
    Logger.info('Razorpay order created:');
    return order;
  };
}
