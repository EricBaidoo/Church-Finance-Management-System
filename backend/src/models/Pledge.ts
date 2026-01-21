import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database.js';
import Member from './Member.js';
import User from './User.js';

interface PledgeAttributes {
  id: number;
  memberId: number;
  pledgeType: string;
  amountPledged: number;
  amountPaid: number;
  pledgeDate: Date;
  dueDate?: Date;
  status: 'active' | 'completed' | 'cancelled';
  description?: string;
  recordedBy: number;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

interface PledgeCreationAttributes extends Optional<PledgeAttributes, 'id' | 'amountPaid' | 'status'> {}

class Pledge extends Model<PledgeAttributes, PledgeCreationAttributes> implements PledgeAttributes {
  public id!: number;
  public memberId!: number;
  public pledgeType!: string;
  public amountPledged!: number;
  public amountPaid!: number;
  public pledgeDate!: Date;
  public dueDate?: Date;
  public status!: 'active' | 'completed' | 'cancelled';
  public description?: string;
  public recordedBy!: number;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
  public readonly deletedAt?: Date;
}

Pledge.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    memberId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'member_id',
      references: {
        model: Member,
        key: 'id'
      },
      onDelete: 'RESTRICT'
    },
    pledgeType: {
      type: DataTypes.STRING(100),
      allowNull: false,
      field: 'pledge_type'
    },
    amountPledged: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
      field: 'amount_pledged'
    },
    amountPaid: {
      type: DataTypes.DECIMAL(12, 2),
      defaultValue: 0.00,
      field: 'amount_paid'
    },
    pledgeDate: {
      type: DataTypes.DATE,
      allowNull: false,
      field: 'pledge_date'
    },
    dueDate: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'due_date'
    },
    status: {
      type: DataTypes.ENUM('active', 'completed', 'cancelled'),
      defaultValue: 'active'
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    recordedBy: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'recorded_by',
      references: {
        model: User,
        key: 'id'
      },
      onDelete: 'RESTRICT'
    },
    createdAt: {
      type: DataTypes.DATE,
      field: 'created_at'
    },
    updatedAt: {
      type: DataTypes.DATE,
      field: 'updated_at'
    },
    deletedAt: {
      type: DataTypes.DATE,
      field: 'deleted_at'
    }
  },
  {
    sequelize,
    tableName: 'pledges',
    underscored: true,
    paranoid: true,
    timestamps: true
  }
);

export default Pledge;
