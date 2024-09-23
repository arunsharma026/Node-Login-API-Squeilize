const { Sequelize, DataTypes } = require("sequelize");
const dbConfig = require('../config/dbConfig.js');


const sequelize = new Sequelize(
    dbConfig.DB,
    dbConfig.USER,
    dbConfig.PASSWORD,
    {
        host:dbConfig.HOST,
        dialect:dbConfig.dialect,
        operatorsAliases:false,
        pool: {
            max: dbConfig.pool.max,
            min: dbConfig.pool.min,
            acquire: dbConfig.pool.acquire,
            idle: dbConfig.pool.idle,
        },
        logging: true, // Disable logging or use a logging function if needed
    }
);

// Test database connection
sequelize.authenticate()
    .then(() => {
        console.log('Database connection established successfully.');
    })
    .catch(err => {
        console.error('Unable to connect to the database:', err);
    });


    // Initialize models
const db = {};

// Attach Sequelize and sequelize instances to db object
db.Sequelize = Sequelize;
db.sequelize = sequelize;
 
// db.users = require('./userLoginModel--.js')(sequelize,DataTypes);
db.userregisters = require('./userRegistrationModel.js')(sequelize, DataTypes);

db.sequelize.sync({ force: false })
    .then(() => {
        console.log('Database sync complete.');
    })
    .catch(err => {
        console.error('Error syncing database:', err);
    });

module.exports = db;