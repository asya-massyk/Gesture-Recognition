const { Sequelize } = require('sequelize');

// Параметри підключення до бази даних
const sequelize = new Sequelize('image_processing', 'postgres', '73V1n8kh', {
    host: 'localhost',
    dialect: 'postgres', // Тип бази даних
});

// Перевірка підключення
const testConnection = async () => {
    try {
        await sequelize.authenticate();
        console.log('Connection to the database has been established successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
};

testConnection();

module.exports = sequelize;
