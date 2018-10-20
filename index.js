// import tensorflow										;
// import blockchain										;

var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var dotenv = require('dotenv');
var logger = require('morgan');
var cookieParser = require('cookie-parser');

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
app.use(cookieParser());

app.get('*', (req, res, next) => {
    console.log('Cookies: ', req.cookies);
    next();
});

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
    console.log(req.cookies);
    if (req.cookies.level == undefined)
        res.redirect('/level')
    else
        res.render('game_node', {
            level: req.cookies.level
        });
});

app.get('/level', (req, res) => {
    res.render('level')
});

app.get('/game/:lvl', (req, res) => {
    res.cookie('level', req.params.lvl);
    res.redirect('/game');
});

app.get('/register', (req, res) => {
    res.render('register');
});

app.post('/register', (req, res) => {
    let data = {
        username: req.body.username,
        level: [
            req.cookies.level0,
            req.cookies.level1,
            req.cookies.level2,
            req.cookies.level3 ]
    }

	db.User.create(data, (err, user) => {
		if (err) throw err;
		else {
            console.log(user._id);
			res.redirect('/game');
        }
    });
});

app.listen(3000, function () {
	console.log('Listening on http://localhost:3000');
});
