const { DataTypes } = require("sequelize");
const { sequelize } = require(".");

module.exports = (sequelize, DataTypes) => {
    const UserRegister = sequelize.define('userregisters', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true // Fixed the spelling
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        emailId: {
            type: DataTypes.STRING, // Use STRING instead of EMAIL
            allowNull: false,
            validate: {
                isEmail: true // Added validation for email format
            }
        },
        contact: {
            type: DataTypes.STRING, // Changed from INTEGER to STRING
            allowNull: false
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false
        },
        token: {
            type: DataTypes.STRING
        } 
    });

    return UserRegister;
};
