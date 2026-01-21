import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database.js';

interface MemberAttributes {
  id: number;
  memberNumber: string;
  fullName: string;
  phone?: string;
  email?: string;
  address?: string;
  dateOfBirth?: Date;
  gender?: 'male' | 'female';
  maritalStatus?: 'single' | 'married' | 'widowed' | 'divorced';
  occupation?: string;
  joinDate: Date;
  isActive: boolean;
  notes?: string;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

interface MemberCreationAttributes extends Optional<MemberAttributes, 'id'> {}

class Member extends Model<MemberAttributes, MemberCreationAttributes> implements MemberAttributes {
  public id!: number;
  public memberNumber!: string;
  public fullName!: string;
  public phone?: string;
  public email?: string;
  public address?: string;
  public dateOfBirth?: Date;
  public gender?: 'male' | 'female';
  public maritalStatus?: 'single' | 'married' | 'widowed' | 'divorced';
  public occupation?: string;
  public joinDate!: Date;
  public isActive!: boolean;
  public notes?: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
  public readonly deletedAt?: Date;
}

Member.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    memberNumber: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
      field: 'member_number'
    },
    fullName: {
      type: DataTypes.STRING(255),
      allowNull: false,
      field: 'full_name'
    },
    phone: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    address: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    dateOfBirth: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'date_of_birth'
    },
    gender: {
      type: DataTypes.ENUM('male', 'female'),
      allowNull: true
    },
    maritalStatus: {
      type: DataTypes.ENUM('single', 'married', 'widowed', 'divorced'),
      allowNull: true,
      field: 'marital_status'
    },
    occupation: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    joinDate: {
      type: DataTypes.DATE,
      allowNull: false,
      field: 'join_date'
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      field: 'is_active'
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true
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
    tableName: 'members',
    underscored: true,
    paranoid: true,
    timestamps: true
  }
);

export default Member;
