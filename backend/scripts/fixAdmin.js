const User = require('../models/User');
const sequelize = require('../config/database');

async function fixAdmin() {
    await sequelize.sync();
    await User.update({ isVerified: true }, { where: { email: 'realestate123@gmail.com' } });
    console.log("Admin account verified!");
}

fixAdmin();
