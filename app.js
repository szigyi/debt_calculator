var numeral = require('numeral');
var express = require('express');
var moment = require('moment');
var swig  = require('swig');
var bodyParser = require('body-parser');
var app = express();

var port = process.env.PORT || 8080;

// This is where all the magic happens!
app.engine('html', swig.renderFile);

app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));

app.set('view engine', 'html');
app.set('views', __dirname + '/');

numeral.defaultFormat('0,0 HUF');

function debtCalculator(initialDebt, initialDays, endDate, actualDate) {
	var response = {};
	response.initialDebt = initialDebt;
	response.initialDays = initialDays;
	response.endDate = endDate;
	response.endDateMillis = +new Date(response.endDate);

	response.endDateFormatted = new moment(response.endDate).format("MMM Do YYYY");

	response.actualDate = actualDate;
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

	return response;
}

app.get('/', function (req, res) {
	var response = debtCalculator(2000000, 730, new Date(2016, 11, 01, 01, 01, 01, 1), new Date());
	res.render('index', response);
});

app.post('/', function (req, res) {
	var initialDebt = req.body.initial_debt;
	var initialDays = req.body.initial_days;
	var endDate = req.body.end_date;
	var actualDate = req.body.actual_date;
	var response = debtCalculator(initialDebt, initialDays, new Date(endDate), new Date(actualDate));
	console.log(response);
	res.render('index', response);
});

app.listen(port, function () {
	console.log('http://localhost:' + port);
});