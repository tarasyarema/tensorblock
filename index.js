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
app.use(express.static(path.join(__dirname, 'static')));
app.set('views', path.join(__dirname, 'views'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(logger('dev'));

app.get('/', (req, res) => {
    db.User.find({}, (err, doc) => {
        if (err) return err;
        else {
            res.render('index', {
                ranking: doc
            });
        }
    });
});

app.get('/game', (req, res) => {
    res.render('game_node');
});

app.get('/register', (req, res) => {
    res.render('register');
});

app.post('/register', (req, res) => {
    let data = {
        username: req.body.username,
        level: Math.floor(Math.random()),
        time: 0
    }

	db.User.create(data, (err, user) => {
		if (err) throw err;
		else {	
            console.log(user._id);
			res.redirect('/');
        }
    });
});

app.get('/pingu_test', function (req, res) {
    res.sendFile(__dirname + '/views/pingu_test.html');
});

app.listen(3000, function () {
	console.log('Listening on http://localhost:3000');
});
