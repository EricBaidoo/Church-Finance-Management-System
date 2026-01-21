import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database.js';
import User from './User.js';
import OfferingType from './OfferingType.js';
import Member from './Member.js';

interface DonationAttributes {
  id: number;
  memberId: number;
  amount: number;
  donationType: 'tithe' | 'offering' | 'special' | 'other';
  offeringTypeId?: number;
  description?: string;
  donationDate: Date;
  referenceNumber?: string;
  paymentMethod: 'cash' | 'check' | 'online' | 'transfer';
  recordedBy: number;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

interface DonationCreationAttributes extends Optional<DonationAttributes, 'id'> {}

class Donation extends Model<DonationAttributes, DonationCreationAttributes> implements DonationAttributes {
  public id!: number;
  public memberId!: number;
  public amount!: number;
  public donationType!: 'tithe' | 'offering' | 'special' | 'other';
  public offeringTypeId?: number;
  public description?: string;
  public donationDate!: Date;
  public referenceNumber?: string;
  public paymentMethod!: 'cash' | 'check' | 'online' | 'transfer';
  public recordedBy!: number;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
  public readonly deletedAt?: Date;
}

Donation.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    memberId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Member,
        key: 'id'
      },
      onDelete: 'RESTRICT'
    },
    amount: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false
    },
    offeringTypeId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: OfferingType,
        key: 'id'
      },
      onDelete: 'RESTRICT'
    },
    donationType: {
      type: DataTypes.ENUM('tithe', 'offering', 'special', 'other'),
      allowNull: false
    },
    description: DataTypes.TEXT,
    donationDate: {
      type: DataTypes.DATE,
      allowNull: false
    },
    referenceNumber: {
      type: DataTypes.STRING,
      unique: true
    },
    paymentMethod: {
      type: DataTypes.ENUM('cash', 'check', 'online', 'transfer'),
      defaultValue: 'cash'
    },
    recordedBy: {
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
    tableName: 'donations',
    timestamps: true,
    underscored: true,
    paranoid: true
  }
);

export default Donation;
