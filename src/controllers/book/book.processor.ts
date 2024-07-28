import { BookBorrowReturnHistory } from '@models/book-borrow-return-history.model';
import { Book } from '@models/book.model';
import { inject, injectable } from 'tsyringe';

@injectable()
export class BookProcessor {
  constructor(
    @inject('Book') private bookModel: typeof Book,
    @inject('BookBorrowReturnHistory') private bookBorrowReturnHistoryModel: typeof BookBorrowReturnHistory,
  ) {}

  async createBook(name: string) {
    const createdBook = await this.bookModel.createBook(name);
    return createdBook;
  }

  async getAllBooks() {
    const allBooks = await this.bookModel.getBooks();
    return allBooks;
  }

  async getBookById(id: number) {
    const book = await this.bookModel.getBookById(id);
    const { createdAt, updatedAt, owner, ...bookData } = book.toJSON();

    let result: { id: number; name: string; score: string | -1 } = { ...bookData, score: '' };
    const avgScore = await this.bookBorrowReturnHistoryModel.getBookAvarageScore(id);
    console.dir(avgScore, { depth: null });
    result.score = avgScore == -1 ? avgScore : avgScore.toFixed(2);

    return result;
  }
}
