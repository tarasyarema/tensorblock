// import tensorflow										;
// import blockchain										;
var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var logger = require('morgan');
var cookieParser = require('cookie-parser');

var app = express();

require('dotenv').config();
const db = require('./database.js');

app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

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
    console.log("Current cookies are:");
    console.log(req.cookies);
    if (req.cookies.level == undefined)
        res.redirect('/level')
    else
        res.render('game_node');
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

    console.log("Data to POST: ");
    console.log(data);

    db.User.findOne({ username: req.body.username }, (err, doc) => {
        if (err) return err;
        if (doc != null) {
            console.log(doc);
            
            doc.level0 = data.level0;
            doc.level1 = data.level1;
            doc.level2 = data.level2;
            doc.level3 = data.level3;
            doc.level4 = data.level4;
            doc.level5 = data.level5;

            doc.save((err, raw) => {
                if (err) return err;
                console.log("Updated: ");
                res.redirect('/');
            });
        } else {
            db.User.create(data, (err, raw) => {
                if (err) return err;
                console.log("Created: ");
                console.log(raw);
                res.redirect('/');
            });
        }
    });
});

app.listen(app.get('port'), function () {
    console.log('App runing -> http://localhost:' + app.get('port'));
});