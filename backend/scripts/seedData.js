const mongoose = require('mongoose');
const User = require('../models/User');
const Property = require('../models/Property');
const Transaction = require('../models/Transaction');
const Complaint = require('../models/Complaint');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/smart_real_estate';

const seedDatabase = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('MongoDB Connected for seeding');

        const count = await User.countDocuments();
        if (count > 1) {
            console.log('Database already has data. Skipping seed.');
            process.exit(0);
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('password123', salt);

       
        const owner1 = await User.create({ name: 'John Owner', email: 'owner1@test.com', password: hashedPassword, role: 'owner' });
        const owner2 = await User.create({ name: 'Alice Estate', email: 'owner2@test.com', password: hashedPassword, role: 'owner' });
        
        const investor1 = await User.create({ name: 'Mike Investor', email: 'investor1@test.com', password: hashedPassword, role: 'investor' });
        const buyer1 = await User.create({ name: 'Sarah Buyer', email: 'buyer1@test.com', password: hashedPassword, role: 'buyer' });

        
        const prop1 = await Property.create({
            title: 'Modern Apartment downtown',
            price: 500000,
            location: 'New York',
            type: 'Apartment',
            owner: owner1._id,
            status: 'approved',
            roi: 8.5,
            score: 92,
            views: 45
        });

        const prop2 = await Property.create({
            title: 'Suburban Family Home',
            price: 350000,
            location: 'Texas',
            type: 'House',
            owner: owner2._id,
            status: 'pending',
            roi: 6.2,
            score: 75,
            views: 12
        });

        const prop3 = await Property.create({
            title: 'Luxury Villa Beachfront',
            price: 1200000,
            location: 'Miami',
            type: 'Villa',
            owner: owner1._id,
            status: 'approved',
            roi: 12.1,
            score: 98,
            views: 156
        });


        await Transaction.create([
            { user: investor1._id, property: prop1._id, amount: 50000, status: 'completed' },
            { user: buyer1._id, property: prop2._id, amount: 350000, status: 'pending' },
            { user: investor1._id, property: prop3._id, amount: 120000, status: 'completed' }
        ]);

       
        await Complaint.create([
            { user: buyer1._id, subject: 'Payment Issue', description: 'My payment is stuck in pending state.', status: 'open' },
            { user: investor1._id, subject: 'Property details inaccurate', description: 'The ROI shown for the downtown apartment seems to be incorrect.', status: 'resolved' }
        ]);

        console.log('Dummy Data Seeded Successfully!');
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

seedDatabase();
