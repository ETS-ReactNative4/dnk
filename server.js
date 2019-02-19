const express = require('express');
const https = require('https')
const request = require('request')
const cors = require('cors')
const AmoCRM = require('amocrm-api');
const amo = new AmoCRM('https://fgpstepanov.amocrm.ru');
const app = express();

app.use(cors())

const port = process.env.PORT || 3000

app.use(function(req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	next();
});

app.get('/', function (req, res) {
	console.log(req, res)
	res.send('Connected', req, res)
	// request.get(`http://fgpstepanov.amocrm.ru/api/v2/leads?USER_LOGIN=fgp.stepanov@yandex.ru&USER_HASH=b59844aaa7ed1e42c43b5ff1e2a8747ee827a8c2&responsible_user_id=2502274&status[0]=20972836&status[1]=22210315&status[2]=20184184&status[3]=22210318&filter[date_create][from]=${req.query.from}&filter[date_create][to]=${req.query.to}`, function(err, httpResponse, body) {
	// 	console.log(JSON.parse(body), 'don')
	// 	res.send(JSON.parse(body))
	// })

	// console.log(res.statusCode)
	// if (res.statusCode === 503) {
	//   console.error('RETRY', url);
	//   response = await fetch(url, fetchOptions).catch(catchError);
	//   statusCode = response.status;
	// }
});

app.get('/amo', function (req, res) {
	console.log('amo')
	// res.send('heelo word', req.query.from, req.query.to)
	request.get(`http://fgpstepanov.amocrm.ru/api/v2/leads?USER_LOGIN=fgp.stepanov@yandex.ru&USER_HASH=b59844aaa7ed1e42c43b5ff1e2a8747ee827a8c2&responsible_user_id=2502274&status[0]=20972836&status[1]=22210315&status[2]=20184184&status[3]=22210318&filter[date_create][from]=${req.query.from}&filter[date_create][to]=${req.query.to}`, function(err, httpResponse, body) {
		res.send(JSON.parse(body))
	})

	// console.log(res.statusCode)
	// if (res.statusCode === 503) {
	//   console.error('RETRY', url);
	//   response = await fetch(url, fetchOptions).catch(catchError);
	//   statusCode = response.status;
	// }
});


app.listen(port, function () {
	console.log('Example app listening on port ' + port);
});
