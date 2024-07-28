import { Router } from 'express';
import { container } from 'tsyringe';
import { BookController } from './book.controller';

export const bookRouter = Router();

export function initBookRouter() {
  const controller = container.resolve(BookController);
  const createBook = controller.createBook.bind(controller);
  const getAllBooks = controller.getAllBooks.bind(controller);
  const getBookById = controller.getBookById.bind(controller);

  bookRouter.post('/books', createBook);
  bookRouter.get('/books', getAllBooks);
  bookRouter.get('/books/:id', getBookById);
}
