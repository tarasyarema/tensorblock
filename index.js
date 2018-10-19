// import tensorflow										;
// import blockchain										;

var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var dotenv = require('dotenv');

var app = express();

dotenv.load();
app.use(cookieParser());
app.set('port', process.env.PORT || 3000);
app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'views'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(logger('dev'));

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/views/index.html');
});

app.get('/game', function (req, res) {
    res.sendFile(__dirname + '/views/game.html');
});

app.listen(3000, function () {
	console.log('Listening on http://localhost:3000');
});
