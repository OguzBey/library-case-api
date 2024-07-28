import { InvalidDataError } from '@shared/error-class';
import { col, CreationOptional, DataTypes, FindOptions, fn, InferAttributes, InferCreationAttributes, Model, Projectable, Sequelize } from 'sequelize';

export class BookBorrowReturnHistory extends Model<InferAttributes<BookBorrowReturnHistory>, InferCreationAttributes<BookBorrowReturnHistory>> {
  declare id: CreationOptional<number>;
  declare user: number;
  declare historyType: 'borrow' | 'return';
  declare book: number;
  declare returnScore?: CreationOptional<number>;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;

  static async getBookAvarageScore(bookId: number): Promise<number> {
    const result = await BookBorrowReturnHistory.findOne({ where: { book: bookId, historyType: 'return' }, attributes: [[fn('AVG', col('returnScore')), 'avgReturnScore']] });
    if (!result || !result.get('avgReturnScore')) return -1;
    return Number(result.get('avgReturnScore')) as number;
  }

  static async createHistory(user: number, book: number, historyType: BookBorrowReturnHistory['historyType'], returnScore?: number) {
    return await BookBorrowReturnHistory.create({ user, book, historyType, returnScore });
  }
  static async getReturnedHistoryBooks(user: number) {
    let result: { book: number; userScore: number }[] = [];
    const whereQuery: FindOptions<InferAttributes<BookBorrowReturnHistory, { omit: never }>> = { where: { user, historyType: 'return' } };
    const attributes: Projectable['attributes'] = ['book', 'returnScore'];
    const orderQuery: FindOptions<InferAttributes<BookBorrowReturnHistory, { omit: never }>> = { order: [['createdAt', 'DESC']] };
    const returnedBooks = (await BookBorrowReturnHistory.findAll({ ...whereQuery, ...attributes, ...orderQuery })) as { book: number; returnScore: number }[];
    for (const retBook of returnedBooks) {
      if (result.findIndex((o) => o.book == retBook.book) == -1) result.push({ book: retBook.book, userScore: retBook.returnScore });
    }
    return result;
  }
}

export function initBookBorrowReturnHistory(sequelize: Sequelize) {
  BookBorrowReturnHistory.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      user: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id',
        },
      },
      book: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'books',
          key: 'id',
        },
      },
      historyType: {
        type: DataTypes.ENUM('borrow', 'return'),
        allowNull: false,
      },
      returnScore: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: null,
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    { sequelize, timestamps: true, tableName: 'bookborrowreturnhistories' },
  );
}
