import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database.js';
class OfferingType extends Model {
}
OfferingType.init({
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
}, {
    sequelize,
    tableName: 'offering_types',
    timestamps: true,
    underscored: true
});
export default OfferingType;
//# sourceMappingURL=OfferingType.js.map