const db = require('./../database.js');

db.User.find({}, function(err, docs) {
    if (err) throw err;
    else {
        console.log(JSON.stringify(docs, null, 2));
        process.exit();
    }
});

db.Promise.find({}, function(err, docs) {
    if (err) throw err;
    else {
        console.log(JSON.stringify(docs, null, 2));
        process.exit();
    }
});