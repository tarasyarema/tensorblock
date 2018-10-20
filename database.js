var mongoose = require('mongoose');
let mongo_url = process.env.MONGOLAB_URI || 'mongodb://localhost:27017/hack';

console.log("Connected to: " + mongo_url);
mongoose.connect(mongo_url, { useNewUrlParser: true });

var user = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    levels: {
        type: Array
    }
});

var User = mongoose.model('User', user);
module.exports = { User };