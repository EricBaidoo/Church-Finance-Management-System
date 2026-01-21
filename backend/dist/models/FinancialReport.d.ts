import { Model, Optional } from 'sequelize';
interface FinancialReportAttributes {
    id: number;
    reportName: string;
    reportType: 'monthly' | 'quarterly' | 'yearly' | 'custom';
    startDate: Date;
    endDate: Date;
    totalDonations: number;
    totalExpenses: number;
    netBalance: number;
    generatedBy: number;
    data?: object;
    createdAt?: Date;
    updatedAt?: Date;
}
interface FinancialReportCreationAttributes extends Optional<FinancialReportAttributes, 'id'> {
}
declare class FinancialReport extends Model<FinancialReportAttributes, FinancialReportCreationAttributes> implements FinancialReportAttributes {
    id: number;
    reportName: string;
    reportType: 'monthly' | 'quarterly' | 'yearly' | 'custom';
    startDate: Date;
    endDate: Date;
    totalDonations: number;
    totalExpenses: number;
    netBalance: number;
    generatedBy: number;
    data?: object;
    readonly createdAt: Date;
    readonly updatedAt: Date;
}
export default FinancialReport;
//# sourceMappingURL=FinancialReport.d.ts.map