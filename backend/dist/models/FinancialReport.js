import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database.js';
import User from './User.js';
class FinancialReport extends Model {
    id;
    reportName;
    reportType;
    startDate;
    endDate;
    totalDonations;
    totalExpenses;
    netBalance;
    generatedBy;
    data;
    createdAt;
    updatedAt;
}
FinancialReport.init({
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
}, {
    sequelize,
    tableName: 'financial_reports',
    timestamps: true,
    underscored: true
});
export default FinancialReport;
//# sourceMappingURL=FinancialReport.js.map