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
    password:{
        type: String,
        required: true
    },
    public_key: String,
    private_key: String,
    promises: 0
});

var promise = new mongoose.Schema({
    //timestamp: Number,
    date: Date,
    emiter: {
        type: String,
        required: true
    },
    destination: {
        type: String,
        required: true
    },
    promise: {
        type: String,
        required: true
    },
    emiter_sign: {
        type: String,
        required: true
    },
    destination_sign: String,
    valid: Boolean
});

var User = mongoose.model('User', user);
var Promise = mongoose.model('Promise', promise);

module.exports = {User, Promise};
