import { InvalidDataError } from '@shared/error-class';
import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model, Optional, Sequelize } from 'sequelize';

export class User extends Model<InferAttributes<User>, InferCreationAttributes<User>> {
  declare id: CreationOptional<number>;
  declare name: string;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;

  static async getUsers() {
    return (await User.findAll({ attributes: ['id', 'name'], raw: true })) as { id: number; name: string }[];
  }
  static async createUser(name: string) {
    return await User.create({ name });
  }

  static async getUserById(id: number) {
    const user = await User.findOne({ where: { id } });
    if (!user) throw new InvalidDataError('user not found.', 'User');
    return user;
  }
}

export function initUser(sequelize: Sequelize) {
  User.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
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
    { sequelize, timestamps: true, tableName: 'users' },
  );
}
