const { Sequelize, DataTypes } = require('sequelize');
const path = require('path');

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: path.join(__dirname, 'database.sqlite')
});

const Document = sequelize.define('Document', {
    agent: {
        type: DataTypes.STRING,
        allowNull: false
    },
    documentName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    filePath: {
        type: DataTypes.STRING,
        allowNull: false
    },
    uploadedAt: {
        type: DataTypes.DATE,
        defaultValue: Sequelize.NOW
    }    
});

module.exports = {
    sequelize,
    Document
};