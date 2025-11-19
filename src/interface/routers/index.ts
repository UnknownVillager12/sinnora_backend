import { Router } from 'express';
import UserRouter from './user.router';
import ProductRouter from './product.router';
import OrderRouter from './order.router';
import UploadRouter from './upload.router';

const appRouter = Router();
appRouter.use('/users', UserRouter);
appRouter.use('/products', ProductRouter);
appRouter.use('/orders', OrderRouter);
appRouter.use('/uploads', UploadRouter);
export { appRouter };
