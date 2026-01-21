import { Model, Optional } from 'sequelize';
interface BudgetAttributes {
    id: number;
    category: string;
    allocatedAmount: number;
    startDate: Date;
    endDate: Date;
    description?: string;
    createdBy: number;
    createdAt?: Date;
    updatedAt?: Date;
    deletedAt?: Date;
}
interface BudgetCreationAttributes extends Optional<BudgetAttributes, 'id'> {
}
declare class Budget extends Model<BudgetAttributes, BudgetCreationAttributes> implements BudgetAttributes {
    id: number;
    category: string;
    allocatedAmount: number;
    startDate: Date;
    endDate: Date;
    description?: string;
    createdBy: number;
    readonly createdAt: Date;
    readonly updatedAt: Date;
    readonly deletedAt?: Date;
}
export default Budget;
//# sourceMappingURL=Budget.d.ts.map