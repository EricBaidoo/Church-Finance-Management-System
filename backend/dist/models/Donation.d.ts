import { Model, Optional } from 'sequelize';
interface DonationAttributes {
    id: number;
    memberId: number;
    amount: number;
    donationType: 'tithe' | 'offering' | 'special' | 'other';
    offeringTypeId?: number;
    description?: string;
    donationDate: Date;
    referenceNumber?: string;
    paymentMethod: 'cash' | 'check' | 'online' | 'transfer';
    recordedBy: number;
    createdAt?: Date;
    updatedAt?: Date;
    deletedAt?: Date;
}
interface DonationCreationAttributes extends Optional<DonationAttributes, 'id'> {
}
declare class Donation extends Model<DonationAttributes, DonationCreationAttributes> implements DonationAttributes {
    id: number;
    memberId: number;
    amount: number;
    donationType: 'tithe' | 'offering' | 'special' | 'other';
    offeringTypeId?: number;
    description?: string;
    donationDate: Date;
    referenceNumber?: string;
    paymentMethod: 'cash' | 'check' | 'online' | 'transfer';
    recordedBy: number;
    readonly createdAt: Date;
    readonly updatedAt: Date;
    readonly deletedAt?: Date;
}
export default Donation;
//# sourceMappingURL=Donation.d.ts.map