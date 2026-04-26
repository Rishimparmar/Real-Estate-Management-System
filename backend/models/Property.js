const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Property = sequelize.define('Property', {
    title: { type: DataTypes.STRING, allowNull: false },
    price: { type: DataTypes.FLOAT, allowNull: false },
    location: { type: DataTypes.STRING, allowNull: false },
    type: { type: DataTypes.STRING, allowNull: false },
    amenities: {
        type: DataTypes.TEXT,
        get() {
            const val = this.getDataValue('amenities');
            return val ? JSON.parse(val) : [];
        },
        set(val) {
            this.setDataValue('amenities', JSON.stringify(val));
        }
    },
    images: {
        type: DataTypes.TEXT,
        get() {
            const val = this.getDataValue('images');
            return val ? JSON.parse(val) : [];
        },
        set(val) {
            this.setDataValue('images', JSON.stringify(val));
        }
    },
    owner: { type: DataTypes.INTEGER, allowNull: false },
    
    // Smart features
    roi: { type: DataTypes.FLOAT, defaultValue: 0 },
    riskLevel: { type: DataTypes.STRING, defaultValue: 'Medium' },
    score: { type: DataTypes.FLOAT, defaultValue: 0 },
    status: { type: DataTypes.STRING, defaultValue: 'approved' },

    // Analytics
    views: { type: DataTypes.INTEGER, defaultValue: 0 }
}, { timestamps: true });

module.exports = Property;
