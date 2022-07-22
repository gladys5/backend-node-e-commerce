const { DataTypes } = require('sequelize')
const { db } = require('../utils/db')

const Order = db.define('order', {
    id: {
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
        type: DataTypes.INTEGER,
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    cartId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    totalPrice: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    status: {
        type: DataTypes.STRING,
        defaultValue: 'active',
    },
})

module.exports = { Order }
