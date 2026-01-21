import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database.js';

interface OfferingTypeAttributes {
  id: number;
  name: string;
  code: string;
  description?: string;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

interface OfferingTypeCreationAttributes extends Optional<OfferingTypeAttributes, 'id'> {}

class OfferingType extends Model<OfferingTypeAttributes, OfferingTypeCreationAttributes> {
  declare id: number;
  declare name: string;
  declare code: string;
  declare description?: string;
  declare isActive: boolean;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

OfferingType.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true
    },
    code: {
      type: DataTypes.STRING(20),
      allowNull: false,
      unique: true
    },
    description: DataTypes.TEXT,
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    }
  },
  {
    sequelize,
    tableName: 'offering_types',
    timestamps: true,
    underscored: true
  }
);

export default OfferingType;
