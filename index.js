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

app.get('/', (req, res) => {
    db.User.find({}, (err, doc) => {
        if (err) return err;
        else {
            console.log(doc);
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
        level0: req.cookies.Level0 == 'true' ? true : false,
        level1: req.cookies.Level1 == 'true' ? true : false,
        level2: req.cookies.Level2 == 'true' ? true : false,
        level3: req.cookies.Level3 == 'true' ? true : false,
        level4: req.cookies.Level4 == 'true' ? true : false,
        level5: req.cookies.Level5 == 'true' ? true : false
    }

    console.log("Data: ");
    console.log(data);

    console.log("Req.Cookies: ");
    console.log(req.cookies);

    console.log("Body.Username: ");
    console.log(req.body.username);

    db.User.findOneAndUpdate({ username: req.body.username }, data, (err, acc) => {
        if (err)
            db.User.create(data, (err, user) => {
                if (err) throw err;
                else res.redirect('/');
            });
        else
            res.redirect('/');
    });
}); 

app.listen(app.get('port'), function () {
    console.log('App runing -> http://localhost:' + app.get('port'));
});