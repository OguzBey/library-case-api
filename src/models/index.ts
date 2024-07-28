import { User, initUser } from './user.model';
import { Book, initBook } from './book.model';
import { BookBorrowReturnHistory, initBookBorrowReturnHistory } from './book-borrow-return-history.model';
import { container } from 'tsyringe';
import { Database } from './db';

export function registerModels() {
  container.register('User', { useValue: User });
  container.register('Book', { useValue: Book });
  container.register('BookBorrowReturnHistory', { useValue: BookBorrowReturnHistory });
}

export function initModels() {
  const database = container.resolve(Database);
  const sequelize = database.sequelize;
  initUser(sequelize);
  initBook(sequelize);
  initBookBorrowReturnHistory(sequelize);
}
