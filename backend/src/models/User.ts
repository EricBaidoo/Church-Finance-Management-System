import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database.js';
import bcryptjs from 'bcryptjs';

interface UserAttributes {
  id: number;
  name: string;
  email: string;
  password: string;
  role: 'admin' | 'accountant' | 'pastor' | 'member';
  isActive: boolean;
  phone?: string;
  address?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

interface UserCreationAttributes extends Optional<UserAttributes, 'id'> {}

class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
  public id!: number;
  public name!: string;
  public email!: string;
  public password!: string;
  public role!: 'admin' | 'accountant' | 'pastor' | 'member';
  public isActive!: boolean;
  public phone?: string;
  public address?: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  async comparePassword(password: string): Promise<boolean> {
    return await bcryptjs.compare(password, this.password);
  }
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      set(value: string) {
        const salt = bcryptjs.genSaltSync(10);
        this.setDataValue('password', bcryptjs.hashSync(value, salt));
      }
    },
    role: {
      type: DataTypes.ENUM('admin', 'accountant', 'pastor', 'member'),
      defaultValue: 'member'
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    phone: DataTypes.STRING,
    address: DataTypes.TEXT
  },
  {
    sequelize,
    tableName: 'users',
    timestamps: true,
    underscored: true
  }
);

export default User;
