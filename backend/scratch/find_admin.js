const User = require('../models/User');
const sequelize = require('../config/database');

async function findAdmin() {
    try {
        await sequelize.authenticate();
        const admins = await User.findAll({ where: { role: 'admin' } });
        if (admins.length > 0) {
            console.log("Found admins:");
            admins.forEach(admin => {
                console.log(`- Email: ${admin.email}, Name: ${admin.name}`);
            });
        } else {
            console.log("No admin users found.");
        }
    } catch (error) {
        console.error("Error finding admin:", error);
    } finally {
        await sequelize.close();
    }
}

findAdmin();
