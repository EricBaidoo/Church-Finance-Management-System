import sequelize from '../config/database.js';
import bcryptjs from 'bcryptjs';
import 'dotenv/config';
async function fixPassword() {
    try {
        await sequelize.authenticate();
        console.log('✅ Database connection established');
        // Hash the correct password
        const correctHash = bcryptjs.hashSync('password', 10);
        console.log('Generated hash:', correctHash);
        // Update the password in database directly
        const result = await sequelize.query(`UPDATE users SET password = ? WHERE email = 'admin@church.local'`, {
            replacements: [correctHash],
            type: 'UPDATE'
        });
        console.log('✅ Password updated for admin user');
        process.exit(0);
    }
    catch (error) {
        console.error('❌ Failed:', error);
        process.exit(1);
    }
}
fixPassword();
//# sourceMappingURL=fixPassword.js.map