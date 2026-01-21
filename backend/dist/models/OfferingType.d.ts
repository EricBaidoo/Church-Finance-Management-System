import { Model, Optional } from 'sequelize';
interface OfferingTypeAttributes {
    id: number;
    name: string;
    code: string;
    description?: string;
    isActive: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}
interface OfferingTypeCreationAttributes extends Optional<OfferingTypeAttributes, 'id'> {
}
declare class OfferingType extends Model<OfferingTypeAttributes, OfferingTypeCreationAttributes> {
    id: number;
    name: string;
    code: string;
    description?: string;
    isActive: boolean;
    readonly createdAt: Date;
    readonly updatedAt: Date;
}
export default OfferingType;
//# sourceMappingURL=OfferingType.d.ts.map