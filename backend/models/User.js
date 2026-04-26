const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const User = sequelize.define('User', {
    name: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    password: { type: DataTypes.STRING, allowNull: false },
    role: { type: DataTypes.STRING, defaultValue: 'investor' },
    status: { type: DataTypes.STRING, defaultValue: 'active' },
    isVerified: { type: DataTypes.BOOLEAN, defaultValue: false },
    otp: { type: DataTypes.STRING },
    otpExpires: { type: DataTypes.DATE },
    favorites: {
        type: DataTypes.TEXT,
        get() {
            const rawValue = this.getDataValue('favorites');
            return rawValue ? JSON.parse(rawValue) : [];
        },
        set(value) {
            this.setDataValue('favorites', JSON.stringify(value));
        }
    },
    investments: {
        type: DataTypes.TEXT,
        get() {
            const rawValue = this.getDataValue('investments');
            return rawValue ? JSON.parse(rawValue) : [];
        },
        set(value) {
            this.setDataValue('investments', JSON.stringify(value));
        }
    }
}, { timestamps: true });

module.exports = User;
