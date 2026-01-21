import { Model, Optional } from 'sequelize';
interface ExpenseAttributes {
    id: number;
    category: string;
    description: string;
    amount: number;
    expenseDate: Date;
    vendor?: string;
    referenceNumber?: string;
    approvedBy?: number;
    status: 'pending' | 'approved' | 'rejected';
    receiptPath?: string;
    createdAt?: Date;
    updatedAt?: Date;
    deletedAt?: Date;
}
interface ExpenseCreationAttributes extends Optional<ExpenseAttributes, 'id'> {
}
declare class Expense extends Model<ExpenseAttributes, ExpenseCreationAttributes> implements ExpenseAttributes {
    id: number;
    category: string;
    description: string;
    amount: number;
    expenseDate: Date;
    vendor?: string;
    referenceNumber?: string;
    approvedBy?: number;
    status: 'pending' | 'approved' | 'rejected';
    receiptPath?: string;
    readonly createdAt: Date;
    readonly updatedAt: Date;
    readonly deletedAt?: Date;
}
export default Expense;
//# sourceMappingURL=Expense.d.ts.map