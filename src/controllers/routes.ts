import { Router } from 'express';
import { bookRouter, initBookRouter } from './book/book.route';
import { userRouter, initUserRouter } from './user/user.route';
const router = Router();

export const initAllRoutes = function () {
  initBookRouter();
  initUserRouter();
  router.use(bookRouter);
  router.use(userRouter);
};

export { router };
