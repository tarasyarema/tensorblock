// import tensorflow										;
// import blockchain										;

var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var dotenv = require('dotenv');
var logger = require('morgan');

var app = express();
const db = require('./database.js');

app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

dotenv.load();
app.set('port', process.env.PORT || 3000);
app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'views'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(logger('dev'));

app.get('/', function (req, res) {
    db.User.find({}, (err, doc) => {
        if (err) return err;
        else {
            res.render('index', {
                ranking: doc
            });
        }
    });
});

app.get('/game', function (req, res) {
    res.sendFile(__dirname + '/views/game.html');
});

app.listen(3000, function () {
	console.log('Listening on http://localhost:3000');
});
