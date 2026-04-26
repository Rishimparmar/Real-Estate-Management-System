const express = require('express');
const cors = require('cors');
require('dotenv').config();

const apiRoutes = require('./routes/api');
const adminRoutes = require('./routes/admin');
const sequelize = require('./config/database');

const app = express();

app.use(cors());
app.use(express.json({ limit: '10mb' }));

app.use('/api', apiRoutes);
app.use('/api/admin', adminRoutes);

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: err.message || 'Something broke!' });
});

const PORT = process.env.PORT || 5000;

const User = require('./models/User');
const Property = require('./models/Property');
const Complaint = require('./models/Complaint');
const Transaction = require('./models/Transaction');
const bcrypt = require('bcryptjs');

// Associations
Complaint.belongsTo(User, { foreignKey: 'user' });
User.hasMany(Complaint, { foreignKey: 'user' });

Transaction.belongsTo(User, { foreignKey: 'user' });
Transaction.belongsTo(Property, { foreignKey: 'property' });
Property.hasMany(Transaction, { foreignKey: 'property' });

const server = app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
}).on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
        console.error(`Port ${PORT} is already in use. Please kill the process using this port.`);
        process.exit(1);
    } else {
        console.error('Server error:', err);
        process.exit(1);
    }
});

sequelize.sync()
    .then(async () => {
        console.log('SQLite Database Connected and Synced');
        
        const adminExists = await User.findOne({ where: { email: 'realestate123@gmail.com' } });
        if (!adminExists) {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash('realestate@123', salt);
            await User.create({
                name: 'Admin',
                email: 'realestate123@gmail.com',
                password: hashedPassword,
                role: 'admin',
                isVerified: true
            });
            console.log('Default admin seeded.');
        }
    })
    .catch(err => console.error('Database connection error:', err));
