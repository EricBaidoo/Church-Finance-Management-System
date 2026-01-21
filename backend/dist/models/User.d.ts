import { Model, Optional } from 'sequelize';
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
interface UserCreationAttributes extends Optional<UserAttributes, 'id'> {
}
declare class User extends Model<UserAttributes, UserCreationAttributes> {
    id: number;
    name: string;
    email: string;
    password: string;
    role: 'admin' | 'accountant' | 'pastor' | 'member';
    isActive: boolean;
    phone?: string;
    address?: string;
    readonly createdAt: Date;
    readonly updatedAt: Date;
    comparePassword(password: string): Promise<boolean>;
}
export default User;
//# sourceMappingURL=User.d.ts.map