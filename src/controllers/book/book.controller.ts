import { NextFunction, Request, Response } from 'express';
import { BookProcessor } from './book.processor';
import { validateData } from '@middlewares/validator';
import { BookIdDTO, CreateBookDTO } from './dtos';
import { to } from '@shared/utils';
import { injectable } from 'tsyringe';

@injectable()
export class BookController {
  constructor(private processor: BookProcessor) {}

  @validateData([{ validateClass: CreateBookDTO, dataType: 'body' }])
  async createBook(req: Request, res: Response, next: NextFunction) {
    const { name } = req.body as Record<string, any> & CreateBookDTO;

    const createExec = await to(this.processor.createBook(name));
    if ('error' in createExec) return next(createExec.error);
    const result = createExec.result;

    console.log(`Book created -> ${name} ${JSON.stringify(result.toJSON())}`);

    res.status(201).json(); // empty response in postman doc
  }

  async getAllBooks(req: Request, res: Response, next: NextFunction) {
    const getAllExec = await to(this.processor.getAllBooks());
    if ('error' in getAllExec) return next(getAllExec.error);
    const books = getAllExec.result;

    res.status(200).json(books);
  }

  @validateData([{ validateClass: BookIdDTO, dataType: 'params' }])
  async getBookById(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params as Record<string, any> & BookIdDTO;

    const bookExec = await to(this.processor.getBookById(id));
    if ('error' in bookExec) return next(bookExec.error);
    const bookResult = bookExec.result;

    res.status(200).json(bookResult);
  }
}
