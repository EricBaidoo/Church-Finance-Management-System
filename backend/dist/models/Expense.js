import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database.js';
import User from './User.js';
class Expense extends Model {
    id;
    category;
    description;
    amount;
    expenseDate;
    vendor;
    referenceNumber;
    approvedBy;
    status;
    receiptPath;
    createdAt;
    updatedAt;
    deletedAt;
}
Expense.init({
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
}, {
    sequelize,
    tableName: 'expenses',
    timestamps: true,
    underscored: true,
    paranoid: true
});
export default Expense;
//# sourceMappingURL=Expense.js.map