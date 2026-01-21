import User from '../models/User.js';
import sequelize from '../config/database.js';
import 'dotenv/config';
async function seedDatabase() {
    try {
        await sequelize.authenticate();
        console.log('✅ Database connection established');
        // Import models
        await import('../models/index.js');
        // Clear all data to reset
        console.log('🔄 Clearing database...');
        await sequelize.truncate({ cascade: true, restartIdentity: true });
        // Create admin user
        await User.create({
            name: 'Admin User',
            email: 'admin@church.local',
            password: 'password',
            role: 'admin',
            phone: '1234567890',
            address: '123 Church St',
            isActive: true
        });
        console.log('✅ Admin user created');
        // Create accountant user
        await User.create({
            name: 'Accountant User',
            email: 'accountant@church.local',
            password: 'password',
            role: 'accountant',
            phone: '0987654321',
            address: '456 Faith Ave',
            isActive: true
        });
        console.log('✅ Accountant user created');
        // Create pastor user
        await User.create({
            name: 'Pastor John',
            email: 'pastor@church.local',
            password: 'password',
            role: 'pastor',
            phone: '5555555555',
            address: '789 Hope Lane',
            isActive: true
        });
        console.log('✅ Pastor user created');
        // Create regular members
        for (let i = 1; i <= 2; i++) {
            await User.create({
                name: `Member ${i}`,
                email: `member${i}@church.local`,
                password: 'password',
                role: 'member',
                phone: `555000000${i}`,
                address: `${i}00 Church Rd`,
                isActive: true
            });
        }
        console.log('✅ Member users created');
        console.log('✅ Database seeding completed successfully!');
        process.exit(0);
    }
    catch (error) {
        console.error('❌ Seeding failed:', error);
        process.exit(1);
    }
}
seedDatabase();
//# sourceMappingURL=seed.js.map