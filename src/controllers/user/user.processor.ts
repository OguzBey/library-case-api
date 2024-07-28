import { BookBorrowReturnHistory } from '@models/book-borrow-return-history.model';
import { Book } from '@models/book.model';
import { User } from '@models/user.model';
import { PermissionError } from '@shared/error-class';
import { InferAttributes } from 'sequelize';
import { inject, injectable } from 'tsyringe';

type IUserResultBookPresent = {
  name: string;
};

type IUserResultBookPast = {
  name: string;
  userScore: number;
};

@injectable()
export class UserProcessor {
  constructor(
    @inject('User') private userModel: typeof User,
    @inject('Book') private bookModel: typeof Book,
    @inject('BookBorrowReturnHistory') private bookBorrowReturnHistoryModel: typeof BookBorrowReturnHistory,
  ) {}

  async createUser(name: string) {
    const createdUser = await this.userModel.createUser(name);
    return createdUser;
  }

  async getAllUsers() {
    const users = await this.userModel.getUsers();
    return users;
  }

  async getUserById(userId: number) {
    const user = await this.userModel.getUserById(userId);
    const { updatedAt, createdAt, ...userData } = user.toJSON();
    let result: InferAttributes<User, { omit: 'updatedAt' | 'createdAt' }> & { books: { past: IUserResultBookPast[]; present: IUserResultBookPresent[] } } = {
      ...userData,
      books: { past: [], present: [] },
    };
    const returnedUserLastScoredBooks = await this.bookBorrowReturnHistoryModel.getReturnedHistoryBooks(userId);
    if (returnedUserLastScoredBooks.length > 0) {
      let idList = returnedUserLastScoredBooks.map((o) => o.book);
      const bookNamesWithIds = await this.bookModel.getBookNamesByIdList(idList);
      for (const bookNameObj of bookNamesWithIds) {
        const userScore = returnedUserLastScoredBooks.find((o) => o.book == bookNameObj.id)!.userScore;
        result.books.past.push({ name: bookNameObj.name, userScore });
      }
    }
    result.books.present = await this.bookModel.getBooksByOwner(userId);

    return result;
  }

  async borrowBook(userId: number, bookId: number) {
    // check user
    const user = await this.userModel.getUserById(userId);
    // check book
    const book = await this.bookModel.getBookById(bookId);
    if (typeof book.owner == 'number') {
      // already has borrowed
      if (book.owner == userId) throw new PermissionError(`${user.name} has already borrowed this book -> ${book.name}`);
      else throw new PermissionError(`This book (${book.name}) has already borrowed by another user.`);
    } else {
      // borrowable
      const transaction = await this.bookModel.sequelize?.transaction();
      try {
        await this.bookModel.update({ owner: userId }, { where: { id: bookId } });
        await this.bookBorrowReturnHistoryModel.createHistory(userId, bookId, 'borrow');
        await transaction?.commit();
      } catch (e) {
        // transaction failed
        console.error(`Error transaction borrow book ${e}`);
        await transaction?.rollback();
      }
    }
  }

  async returnBook(userId: number, bookId: number, score: number) {
    // check user
    const user = await this.userModel.getUserById(userId);
    // check book
    const book = await this.bookModel.getBookById(bookId);

    if (book.owner != userId) throw new PermissionError(`This book "${book.name}" is not the book borrowed by (${user.name})`);
    const transaction = await this.bookModel.sequelize?.transaction();
    try {
      await this.bookModel.update({ owner: null }, { where: { id: bookId } });
      await this.bookBorrowReturnHistoryModel.createHistory(userId, bookId, 'return', score);
      await transaction?.commit();
    } catch (e) {
      // transaction failed
      console.error(`Error transaction return book ${e}`);
      await transaction?.rollback();
    }
  }
}
