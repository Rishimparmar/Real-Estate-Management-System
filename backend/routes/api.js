const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Property = require('../models/Property');
const { protect } = require('../middleware/auth');
const { calculatePropertyScore, calculateROI, calculateRiskLevel } = require('../utils/aiCalculations');
const { Op } = require('sequelize');
const sendEmail = require('../utils/sendEmail');


const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET || 'secret123', { expiresIn: '30d' });
};


router.post('/register', async (req, res) => {
    try {
        const { name, email, password, role } = req.body;
        if (!name || !email || !password) return res.status(400).json({ message: 'Please add all fields' });

        const userExists = await User.findOne({ where: { email } });
        if (userExists) return res.status(400).json({ message: 'User already exists' });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

        const user = await User.create({ 
            name, email, password: hashedPassword, role: role || 'investor',
            otp, otpExpires, isVerified: false
        });

        if (user) {
            try {
                await sendEmail({
                    email: user.email,
                    subject: 'Verify your SmartInvest account',
                    message: `Your OTP is: ${otp}. It will expire in 10 minutes.`
                });
                res.status(201).json({ message: 'Registration successful. Please check your email for the OTP.', email: user.email });
            } catch (error) {
                console.error('Error sending email:', error);
                await user.destroy();
                res.status(500).json({ message: 'Error sending OTP email. Registration failed.' });
            }
        } else {
            res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ where: { email } });

        if (user && (await bcrypt.compare(password, user.password))) {
            if (!user.isVerified) {
                return res.status(401).json({ message: 'Account not verified. Please verify your OTP.' });
            }
            res.json({ _id: user.id, name: user.name, email: user.email, role: user.role, token: generateToken(user.id) });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.post('/verify-otp', async (req, res) => {
    try {
        const { email, otp } = req.body;
        const user = await User.findOne({ where: { email } });

        if (!user) return res.status(404).json({ message: 'User not found' });
        if (user.isVerified) return res.status(400).json({ message: 'User is already verified' });
        if (user.otp !== otp) return res.status(400).json({ message: 'Invalid OTP' });
        if (user.otpExpires < new Date()) return res.status(400).json({ message: 'OTP has expired' });

        user.isVerified = true;
        user.otp = null;
        user.otpExpires = null;
        await user.save();

        res.json({ message: 'Account verified successfully', token: generateToken(user.id), _id: user.id, name: user.name, email: user.email, role: user.role });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.post('/resend-otp', async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ where: { email } });

        if (!user) return res.status(404).json({ message: 'User not found' });
        if (user.isVerified) return res.status(400).json({ message: 'User is already verified' });

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

        user.otp = otp;
        user.otpExpires = otpExpires;
        await user.save();

        await sendEmail({
            email: user.email,
            subject: 'Verify your SmartInvest account',
            message: `Your new OTP is: ${otp}. It will expire in 10 minutes.`
        });

        res.json({ message: 'New OTP sent to your email' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.post('/forgot-password', async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ where: { email } });

        if (!user) return res.status(404).json({ message: 'User not found' });

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

        user.otp = otp;
        user.otpExpires = otpExpires;
        await user.save();

        await sendEmail({
            email: user.email,
            subject: 'Password Reset OTP',
            message: `Your OTP for password reset is: ${otp}. It will expire in 10 minutes.`
        });

        res.json({ message: 'Password reset OTP sent to your email' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.post('/reset-password', async (req, res) => {
    try {
        const { email, otp, newPassword } = req.body;
        const user = await User.findOne({ where: { email } });

        if (!user) return res.status(404).json({ message: 'User not found' });
        if (user.otp !== otp) return res.status(400).json({ message: 'Invalid OTP' });
        if (user.otpExpires < new Date()) return res.status(400).json({ message: 'OTP has expired' });

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);
        user.isVerified = true;
        user.otp = null;
        user.otpExpires = null;
        await user.save();

        res.json({ message: 'Password reset successful' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.get('/me', protect, async (req, res) => {
    res.json(req.user);
});

router.get('/properties', async (req, res) => {
    try {
        const { budget, location, type, minScore } = req.query;
        let where = {};

        if (budget) where.price = { [Op.lte]: Number(budget) };
        if (location) where.location = { [Op.like]: `%${location}%` };
        if (type) where.type = type;
        if (minScore) where.score = { [Op.gte]: Number(minScore) };

        const properties = await Property.findAll({ where });
        res.json(properties);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.post('/properties', protect, async (req, res) => {
    try {
        if (req.user.role !== 'owner') return res.status(403).json({ message: 'Only owners can add properties' });

        const { title, price, location, type, amenities, images } = req.body;
        
        const propertyData = { title, price, location, type, amenities: amenities || [], images: images || [] };
        const score = calculatePropertyScore(propertyData);
        const roi = calculateROI(price);
        const riskLevel = calculateRiskLevel(score, roi);

        const property = await Property.create({
            ...propertyData,
            owner: req.user.id,
            score,
            roi,
            riskLevel
        });

        res.status(201).json(property);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.get('/properties/:id', async (req, res) => {
    try {
        const property = await Property.findByPk(req.params.id);
        if (!property) return res.status(404).json({ message: 'Property not found' });
        
        property.views += 1;
        await property.save();

        res.json(property);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.put('/properties/:id', protect, async (req, res) => {
    try {
        const property = await Property.findByPk(req.params.id);
        if (!property) return res.status(404).json({ message: 'Property not found' });

        if (property.owner.toString() !== req.user.id.toString()) return res.status(403).json({ message: 'Not authorized' });

        await property.update(req.body);
        res.json(property);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.delete('/properties/:id', protect, async (req, res) => {
    try {
        const property = await Property.findByPk(req.params.id);
        if (!property) return res.status(404).json({ message: 'Property not found' });

        if (property.owner.toString() !== req.user.id.toString()) return res.status(403).json({ message: 'Not authorized' });

        await property.destroy();
        res.json({ message: 'Property removed' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


router.get('/recommendations', protect, async (req, res) => {
    try {
        const { budget, riskLevel } = req.query;
        let where = {};
        
        if (budget) where.price = { [Op.lte]: Number(budget) };
        if (riskLevel) where.riskLevel = riskLevel;

        const properties = await Property.findAll({ 
            where, 
            order: [['score', 'DESC'], ['roi', 'DESC']],
            limit: 10 
        });
        res.json(properties);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


router.post('/favorites/:id', protect, async (req, res) => {
    try {
        const user = await User.findByPk(req.user.id);
        const propId = req.params.id;

        let favs = user.favorites || [];
        if (favs.includes(propId)) {
            favs = favs.filter(id => id.toString() !== propId.toString());
        } else {
            favs.push(propId);
        }
        user.favorites = favs;
        await user.save();
        res.json(user.favorites);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.get('/favorites', protect, async (req, res) => {
    try {
        const user = await User.findByPk(req.user.id);
        res.json(user.favorites || []);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

const Transaction = require('../models/Transaction');
const Complaint = require('../models/Complaint');

router.post('/invest/:id', protect, async (req, res) => {
    try {
        const amount = req.body.amount || 0;
        const user = await User.findByPk(req.user.id);
        const property = await Property.findByPk(req.params.id);
        
        if (!property) return res.status(404).json({ message: 'Property not found' });

        // Update user's investment portfolio (JSON column)
        let invs = user.investments || [];
        invs.push({ property: req.params.id, amount, date: new Date() });
        user.investments = invs;
        await user.save();

        // Create a formal Transaction record for admin dashboard
        await Transaction.create({
            user: user.id,
            property: property.id,
            amount: amount,
            status: 'completed'
        });
        
        res.json({ message: 'Investment successful', investments: user.investments });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.post('/complaints', protect, async (req, res) => {
    try {
        const { subject, description } = req.body;
        if (!subject || !description) return res.status(400).json({ message: 'Please provide subject and description' });

        const complaint = await Complaint.create({
            user: req.user.id,
            subject,
            description
        });

        res.status(201).json(complaint);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.get('/portfolio', protect, async (req, res) => {
    try {
        const user = await User.findByPk(req.user.id);
        res.json(user.investments || []);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


router.get('/insights', protect, async (req, res) => {
    try {
        if(req.user.role !== 'owner') return res.status(403).json({ message: 'Not authorized'});
        const properties = await Property.findAll({ where: { owner: req.user.id } });
        
        const totalViews = properties.reduce((acc, curr) => acc + curr.views, 0);
        const totalListings = properties.length;
        const averageScore = properties.length > 0 ? (properties.reduce((acc, curr) => acc + curr.score, 0) / properties.length).toFixed(1) : 0;

        res.json({ totalViews, totalListings, averageScore, properties });
    } catch(err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
