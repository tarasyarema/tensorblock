const db = require('../database.js');

db.User.remove({}, function(err) { 
    console.log('Collection removed.');
    process.exit(); 
 });