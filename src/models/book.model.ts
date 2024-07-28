import { InvalidDataError, PermissionError } from '@shared/error-class';
import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model, Sequelize, Op } from 'sequelize';

export class Book extends Model<InferAttributes<Book>, InferCreationAttributes<Book>> {
  declare id: CreationOptional<number>;
  declare name: string;
  declare owner: CreationOptional<number> | null;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;

  static async getBooks() {
    return (await Book.findAll({ attributes: ['id', 'name'], raw: true })) as { id: number; name: string }[];
  }

  static async getBookById(id: number) {
    const book = await Book.findOne({ where: { id } });
    if (!book) throw new InvalidDataError(`Book not found.`, 'Book');
    return book;
  }

  static async getBookNamesByIdList(idList: number[]) {
    return (await Book.findAll({ where: { id: { [Op.in]: idList } }, attributes: ['name', 'id'], raw: true })) as { id: number; name: string }[];
  }

  static async getBooksByOwner(owner: number) {
    return (await Book.findAll({ where: { owner }, attributes: ['name'], raw: true })) as { name: string }[];
  }

  static async createBook(name: string) {
    const count = await Book.count({ where: { name } });
    if (count > 0) throw new PermissionError(`This book has already exists. -> ${name}`);
    return await Book.create({ name });
  }
}

export function initBook(sequelize: Sequelize) {
  Book.init(
    {
      id: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      owner: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: null,
        references: {
          model: 'users',
          key: 'id',
        },
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
    { timestamps: true, sequelize, tableName: 'books' },
  );
}
