// config.js
require('dotenv').config(); 
const env = process.env.NODE_ENV;

const dev = {
 app: {
   port: parseInt(process.env.DEV_APP_PORT) || 3000
 },
 db: {
   url: process.env.DEV_DB_URI,
   user: process.env.DEV_DB_USER,
   pass: process.env.DEV_DB_PASS,
   host: process.env.DEV_DB_HOST || 'localhost',
   port: parseInt(process.env.DEV_DB_PORT) || 27017,
   name: process.env.DEV_DB_NAME || 'db'
 }
};
const test = {
 app: {
   port: parseInt(process.env.TEST_APP_PORT) || 3000
 },
 db: {
   host: process.env.TEST_DB_HOST || 'localhost',
   port: parseInt(process.env.TEST_DB_PORT) || 27017,
   name: process.env.TEST_DB_NAME || 'test'
 }
};

const config = {
 dev,
 test
};

module.exports = config[env];
