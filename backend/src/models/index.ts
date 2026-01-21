import User from './User.js';
import Donation from './Donation.js';
import Expense from './Expense.js';
import Budget from './Budget.js';
import FinancialReport from './FinancialReport.js';
import OfferingType from './OfferingType.js';
import Member from './Member.js';
import Pledge from './Pledge.js';

// Member associations
Member.hasMany(Donation, { foreignKey: 'memberId', as: 'offerings' });
Member.hasMany(Pledge, { foreignKey: 'memberId', as: 'pledges' });

// User associations
User.hasMany(Donation, { foreignKey: 'recordedBy', as: 'recordedDonations' });
User.hasMany(Expense, { foreignKey: 'approvedBy', as: 'approvedExpenses' });
User.hasMany(Budget, { foreignKey: 'createdBy', as: 'budgets' });
User.hasMany(FinancialReport, { foreignKey: 'generatedBy', as: 'reports' });
User.hasMany(Pledge, { foreignKey: 'recordedBy', as: 'recordedPledges' });

// OfferingType associations
OfferingType.hasMany(Donation, { foreignKey: 'offeringTypeId', as: 'donations' });

// Donation associations
Donation.belongsTo(Member, { foreignKey: 'memberId', as: 'member' });
Donation.belongsTo(User, { foreignKey: 'recordedBy', as: 'recordedByUser' });
Donation.belongsTo(OfferingType, { foreignKey: 'offeringTypeId', as: 'offeringType' });

// Pledge associations
Pledge.belongsTo(Member, { foreignKey: 'memberId', as: 'member' });
Pledge.belongsTo(User, { foreignKey: 'recordedBy', as: 'recordedByUser' });

// Expense associations
Expense.belongsTo(User, { foreignKey: 'approvedBy', as: 'approver' });

// Budget associations
Budget.belongsTo(User, { foreignKey: 'createdBy', as: 'creator' });

// Financial Report associations
FinancialReport.belongsTo(User, { foreignKey: 'generatedBy', as: 'generator' });

export { User, Donation, Expense, Budget, FinancialReport, OfferingType, Member, Pledge };
