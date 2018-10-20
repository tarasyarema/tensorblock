const db = require('./../database.js');

let data = { 
    username: String(Math.random()),
    level: Math.floor(Math.random()),
    time: Math.floor(new Date() / 1000)
};

db.User.create(data, (err, raw) => {
    if (err) return err;
    else {
        console.log(raw);
        process.exit();
    }
});