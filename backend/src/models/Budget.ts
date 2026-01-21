import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database.js';
import User from './User.js';

interface BudgetAttributes {
  id: number;
  category: string;
  allocatedAmount: number;
  startDate: Date;
  endDate: Date;
  description?: string;
  createdBy: number;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

interface BudgetCreationAttributes extends Optional<BudgetAttributes, 'id'> {}

class Budget extends Model<BudgetAttributes, BudgetCreationAttributes> implements BudgetAttributes {
  public id!: number;
  public category!: string;
  public allocatedAmount!: number;
  public startDate!: Date;
  public endDate!: Date;
  public description?: string;
  public createdBy!: number;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
  public readonly deletedAt?: Date;
}

Budget.init(
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
    allocatedAmount: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false
    },
    startDate: {
      type: DataTypes.DATE,
      allowNull: false
    },
    endDate: {
      type: DataTypes.DATE,
      allowNull: false
    },
    description: DataTypes.TEXT,
    createdBy: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: 'id'
      },
      onDelete: 'RESTRICT'
    }
  },
  {
    sequelize,
    tableName: 'budgets',
    timestamps: true,
    underscored: true,
    paranoid: true
  }
);

export default Budget;
