const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Property = require('../models/Property');
const Transaction = require('../models/Transaction');
const Complaint = require('../models/Complaint');
const { adminProtect } = require('../middleware/auth');
const { Op } = require('sequelize');

router.use(adminProtect);

router.get('/dashboard', async (req, res) => {
    try {
        const totalUsers = await User.count();
        const activeListings = await Property.count();
        const soldProperties = await Property.count({ where: { status: 'sold' } });
        const pendingComplaints = await Complaint.count({ where: { status: 'open' } });
        
        const allTransactions = await Transaction.findAll({ where: { status: 'completed' } });
        const totalRevenue = allTransactions.reduce((acc, curr) => acc + curr.amount, 0);

        const monthlySalesMap = {};
        allTransactions.forEach(t => {
            const month = new Date(t.createdAt).getMonth() + 1;
            monthlySalesMap[month] = (monthlySalesMap[month] || 0) + t.amount;
        });
        const monthlySales = Object.keys(monthlySalesMap).map(k => ({ _id: Number(k), totalAmount: monthlySalesMap[k] }));

        const recentTransactions = await Transaction.findAll({
            order: [['createdAt', 'DESC']],
            limit: 5
        });

        res.json({
            stats: { 
                totalUsers, 
                activeListings, 
                soldProperties, 
                pendingComplaints,
                totalRevenue,
                totalTransactions: allTransactions.length
            },
            monthlySales,
            recentTransactions
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


router.get('/users', async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const users = await User.findAll({ 
            attributes: { exclude: ['password'] },
            offset: skip, 
            limit: limit 
        });
        const total = await User.count();

        res.json({ users, total, page, pages: Math.ceil(total / limit) });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.put('/users/:id/status', async (req, res) => {
    try {
        const { status } = req.body;
        const user = await User.findByPk(req.params.id);
        if(!user) return res.status(404).json({message: 'User not found'});
        await user.update({ status });
        const userData = user.toJSON();
        delete userData.password;
        res.json(userData);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.put('/users/:id/role', async (req, res) => {
    try {
        const { role } = req.body;
        const user = await User.findByPk(req.params.id);
        if(!user) return res.status(404).json({message: 'User not found'});
        await user.update({ role });
        const userData = user.toJSON();
        delete userData.password;
        res.json(userData);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


router.get('/properties', async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const properties = await Property.findAll({ offset: skip, limit: limit });
        const total = await Property.count();

        res.json({ properties, total, page, pages: Math.ceil(total / limit) });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.put('/properties/:id/status', async (req, res) => {
    try {
        const { status } = req.body;
        const property = await Property.findByPk(req.params.id);
        if(!property) return res.status(404).json({message: 'Property not found'});
        await property.update({ status });
        res.json(property);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.delete('/properties/:id', async (req, res) => {
    try {
        const property = await Property.findByPk(req.params.id);
        if(property) await property.destroy();
        res.json({ message: 'Property deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// --- TRANSACTIONS ---
router.get('/transactions', async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const transactions = await Transaction.findAll({ offset: skip, limit: limit });
        const total = await Transaction.count();

        res.json({ transactions, total, page, pages: Math.ceil(total / limit) });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.put('/transactions/:id/status', async (req, res) => {
    try {
        const { status } = req.body;
        const transaction = await Transaction.findByPk(req.params.id);
        if(!transaction) return res.status(404).json({message: 'Transaction not found'});
        await transaction.update({ status });
        res.json(transaction);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


router.get('/complaints', async (req, res) => {
    try {
        const complaints = await Complaint.findAll({
            include: [{ model: User, attributes: ['name', 'email'] }]
        });
        res.json(complaints);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.put('/complaints/:id/resolve', async (req, res) => {
    try {
        const complaint = await Complaint.findByPk(req.params.id);
        if(!complaint) return res.status(404).json({message: 'Complaint not found'});
        await complaint.update({ status: 'resolved' });
        res.json(complaint);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
