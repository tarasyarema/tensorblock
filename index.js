var express = require('express');
var app = express();

app.get('/', function (req, res) {
	res.sendFile(__dirname + '/static/index.html');
});

app.listen(3000, function () {
	console.log('Listening on http://localhost:3000');
});
