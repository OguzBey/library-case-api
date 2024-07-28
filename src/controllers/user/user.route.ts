import { Router } from 'express';
import { container } from 'tsyringe';
import { UserController } from './user.controller';

export const userRouter = Router();

export function initUserRouter() {
  const controller = container.resolve(UserController);
  const createUser = controller.createUser.bind(controller);
  const getAllUsers = controller.getAllUsers.bind(controller);
  const getUserById = controller.getUserById.bind(controller);
  const borrowBook = controller.borrowBook.bind(controller);
  const returnBook = controller.returnBook.bind(controller);

  userRouter.post('/users', createUser);
  userRouter.get('/users', getAllUsers);
  userRouter.get('/users/:id', getUserById);
  userRouter.post('/users/:id/borrow/:bookId', borrowBook);
  userRouter.post('/users/:id/return/:bookId', returnBook);
}
