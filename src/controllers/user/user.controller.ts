import { injectable } from 'tsyringe';
import { UserProcessor } from './user.processor';
import { NextFunction, Request, Response } from 'express';
import { ReturnBorrowBookIdDTO, CreateUserDTO, UserIdDTO, ScoreDTO } from './dtos';
import { validateData } from '@middlewares/validator';
import { to } from '@shared/utils';

@injectable()
export class UserController {
  constructor(private processor: UserProcessor) {}

  @validateData([{ validateClass: CreateUserDTO, dataType: 'body' }])
  async createUser(req: Request, res: Response, next: NextFunction) {
    const { name } = req.body as Record<string, any> & CreateUserDTO;

    const createExec = await to(this.processor.createUser(name));
    if ('error' in createExec) return next(createExec.error);
    const createdUser = createExec.result;

    console.log(`User created -> ${name} ${JSON.stringify(createdUser.toJSON())}`);

    res.status(201).json();
  }

  async getAllUsers(req: Request, res: Response, next: NextFunction) {
    const usersExec = await to(this.processor.getAllUsers());
    if ('error' in usersExec) return next(usersExec.error);
    const usersRaw = usersExec.result;

    res.status(200).json(usersRaw);
  }

  @validateData([{ validateClass: UserIdDTO, dataType: 'params' }])
  async getUserById(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params as Record<string, any> & UserIdDTO;

    const userExec = await to(this.processor.getUserById(id));
    if ('error' in userExec) return next(userExec.error);
    const userResult = userExec.result;

    res.status(200).json(userResult);
  }

  @validateData([{ validateClass: ReturnBorrowBookIdDTO, dataType: 'params' }])
  async borrowBook(req: Request, res: Response, next: NextFunction) {
    const { bookId, id } = req.params as Record<string, any> & ReturnBorrowBookIdDTO;

    const borrowExec = await to(this.processor.borrowBook(id, bookId));
    if ('error' in borrowExec) return next(borrowExec.error);

    res.status(204).json(); // postman doc resp empty and 204
  }

  @validateData([
    { validateClass: ReturnBorrowBookIdDTO, dataType: 'params' },
    { validateClass: ScoreDTO, dataType: 'body' },
  ])
  async returnBook(req: Request, res: Response, next: NextFunction) {
    const { bookId, id } = req.params as Record<string, any> & ReturnBorrowBookIdDTO;
    const { score } = req.body as Record<string, any> & ScoreDTO;

    const returnExec = await to(this.processor.returnBook(id, bookId, score));
    if ('error' in returnExec) return next(returnExec.error);

    res.status(204).json(); // postman doc resp empty and 204
  }
}
