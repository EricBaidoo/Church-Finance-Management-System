import sequelize from './config/database.js';
console.log('Testing database connection...');
try {
    await sequelize.authenticate();
    console.log('✅ Database connected successfully');
    process.exit(0);
}
catch (error) {
    console.error('❌ Database connection failed:', error);
    process.exit(1);
}
//# sourceMappingURL=test-db.js.map