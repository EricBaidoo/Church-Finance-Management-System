import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database.js';
import User from './User.js';

interface FinancialReportAttributes {
  id: number;
  reportName: string;
  reportType: 'monthly' | 'quarterly' | 'yearly' | 'custom';
  startDate: Date;
  endDate: Date;
  totalDonations: number;
  totalExpenses: number;
  netBalance: number;
  generatedBy: number;
  data?: object;
  createdAt?: Date;
  updatedAt?: Date;
}

interface FinancialReportCreationAttributes extends Optional<FinancialReportAttributes, 'id'> {}

class FinancialReport extends Model<FinancialReportAttributes, FinancialReportCreationAttributes> implements FinancialReportAttributes {
  public id!: number;
  public reportName!: string;
  public reportType!: 'monthly' | 'quarterly' | 'yearly' | 'custom';
  public startDate!: Date;
  public endDate!: Date;
  public totalDonations!: number;
  public totalExpenses!: number;
  public netBalance!: number;
  public generatedBy!: number;
  public data?: object;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

FinancialReport.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    reportName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    reportType: {
      type: DataTypes.ENUM('monthly', 'quarterly', 'yearly', 'custom'),
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
    totalDonations: {
      type: DataTypes.DECIMAL(12, 2),
      defaultValue: 0
    },
    totalExpenses: {
      type: DataTypes.DECIMAL(12, 2),
      defaultValue: 0
    },
    netBalance: {
      type: DataTypes.DECIMAL(12, 2),
      defaultValue: 0
    },
    generatedBy: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: 'id'
      },
      onDelete: 'RESTRICT'
    },
    data: {
      type: DataTypes.JSON,
      allowNull: true
    }
  },
  {
    sequelize,
    tableName: 'financial_reports',
    timestamps: true,
    underscored: true
  }
);

export default FinancialReport;
