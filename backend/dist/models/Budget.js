import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database.js';
import User from './User.js';
class Budget extends Model {
    id;
    category;
    allocatedAmount;
    startDate;
    endDate;
    description;
    createdBy;
    createdAt;
    updatedAt;
    deletedAt;
}
Budget.init({
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
}, {
    sequelize,
    tableName: 'budgets',
    timestamps: true,
    underscored: true,
    paranoid: true
});
export default Budget;
//# sourceMappingURL=Budget.js.map