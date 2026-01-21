import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database.js';
import User from './User.js';

interface ExpenseAttributes {
  id: number;
  category: string;
  description: string;
  amount: number;
  expenseDate: Date;
  vendor?: string;
  referenceNumber?: string;
  approvedBy?: number;
  status: 'pending' | 'approved' | 'rejected';
  receiptPath?: string;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

interface ExpenseCreationAttributes extends Optional<ExpenseAttributes, 'id'> {}

class Expense extends Model<ExpenseAttributes, ExpenseCreationAttributes> implements ExpenseAttributes {
  public id!: number;
  public category!: string;
  public description!: string;
  public amount!: number;
  public expenseDate!: Date;
  public vendor?: string;
  public referenceNumber?: string;
  public approvedBy?: number;
  public status!: 'pending' | 'approved' | 'rejected';
  public receiptPath?: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
  public readonly deletedAt?: Date;
}

Expense.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    category: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    amount: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false
    },
    expenseDate: {
      type: DataTypes.DATE,
      allowNull: false
    },
    vendor: DataTypes.STRING,
    referenceNumber: {
      type: DataTypes.STRING,
      unique: true
    },
    approvedBy: {
      type: DataTypes.INTEGER,
      references: {
        model: User,
        key: 'id'
      },
      onDelete: 'SET NULL'
    },
    status: {
      type: DataTypes.ENUM('pending', 'approved', 'rejected'),
      defaultValue: 'pending'
    },
    receiptPath: DataTypes.STRING
  },
  {
    sequelize,
    tableName: 'expenses',
    timestamps: true,
    underscored: true,
    paranoid: true
  }
);

export default Expense;
