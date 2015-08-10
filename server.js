var express = require('express');
var bodyParser = require('body-parser');
var indexController = require('./controllers/index.js');
var mongoose = require('mongoose')



var app = express();
app.set('view engine', 'jade');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/client'));
app.use(bodyParser.urlencoded({extended: false}));

app.get('/', indexController.index);

app.get('/login', indexController.login);









var server = app.listen(5361, function() {
	console.log('Express server listening on port ' + server.address().port);
});
