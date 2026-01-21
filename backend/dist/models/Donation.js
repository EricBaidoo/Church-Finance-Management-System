import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database.js';
import User from './User.js';
import OfferingType from './OfferingType.js';
class Donation extends Model {
    id;
    memberId;
    amount;
    donationType;
    offeringTypeId;
    description;
    donationDate;
    referenceNumber;
    paymentMethod;
    recordedBy;
    createdAt;
    updatedAt;
    deletedAt;
}
Donation.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    memberId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User,
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
}, {
    sequelize,
    tableName: 'donations',
    timestamps: true,
    underscored: true,
    paranoid: true
});
export default Donation;
//# sourceMappingURL=Donation.js.map