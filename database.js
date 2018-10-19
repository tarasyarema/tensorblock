var mongoose = require('mongoose');
let mongo_url = process.env.MONGOLAB_URI;

console.log("Connected to: " + mongo_url);
mongoose.connect(mongo_url, { useNewUrlParser: true });

var user = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    level: {
        type: Number
    },
    time: {
        type: Number
    }
});

var User = mongoose.model('User', user);
module.exports = { User };