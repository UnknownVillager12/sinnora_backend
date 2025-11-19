import 'express-async-errors';
import 'reflect-metadata';
import { PORT, Server } from '@/config';

const server = new Server({
  port: PORT,
});
server.start();
