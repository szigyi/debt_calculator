var numeral = require('numeral');
var express = require('express');
var moment = require('moment');
var swig  = require('swig');
var app = express();


// This is where all the magic happens!
app.engine('html', swig.renderFile);

app.set('view engine', 'html');
app.set('views', __dirname + '/');

numeral.defaultFormat('0,0 HUF');

var response = {};
response.initialDebt = 2000000;
response.initialDays = 730;
response.endDate = new Date(2016, 11, 01, 01, 01, 01, 1);
response.endDateMillis = +new Date(response.endDate);

response.endDateFormatted = new moment(response.endDate).format("MMM Do YYYY");

app.get('/', function (req, res) {
	response.actualDate = new Date();
	response.actualDateMillis = +new Date(response.actualDate);
	var sub = response.endDateMillis - response.actualDateMillis;
	var diff = new moment.duration(sub);
	response.daysLeft = diff.asDays();
	response.debtForADay = response.initialDebt / response.initialDays;
	response.debtLeft = response.debtForADay * response.daysLeft;

	response.actualDateFormatted = new moment(response.actualDate).format("MMM Do YYYY");
	response.debtForADayFormatted = numeral(response.debtForADay).format();
	response.debtLeftFormatted = numeral(response.debtLeft).format();
	response.daysLeftFormatted = Math.floor(response.daysLeft);

	res.render('index', response);
});

app.listen(3000, function () {
	console.log('http://localhost:3000');
});