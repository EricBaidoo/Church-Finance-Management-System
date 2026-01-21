import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database.js';
import bcryptjs from 'bcryptjs';
class User extends Model {
    async comparePassword(password) {
        return await bcryptjs.compare(password, this.password);
    }
}
User.init({
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
        set(value) {
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
}, {
    sequelize,
    tableName: 'users',
    timestamps: true,
    underscored: true
});
export default User;
//# sourceMappingURL=User.js.map