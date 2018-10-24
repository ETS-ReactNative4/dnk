const express = require('express');
const https = require('https')
const cors = require('cors')
const axios = require('axios');
const AmoCRM = require('amocrm-api');
const amo = new AmoCRM('https://fgpstepanov.amocrm.ru');
const app = express();

app.use(cors())

const port = process.env.PORT || 8000

app.get('/', function (req, res) {
	// const data = JSON.stringify({
	// 	USER_LOGIN: 'fgp.stepanov@yandex.ru',
	// 	USER_HASH: 'b59844aaa7ed1e42c43b5ff1e2a8747ee827a8c2'
	// })
	//
	// const options = {
	// 	hostname: 'fgpstepanov.amocrm.ru',
	// 	method: 'GET',
	// 	path: '/private/api/auth.php',
	// 	headers: {
	// 		'Content-Type': 'application/json',
	// 		'Access-Control-Allow-Origin': '*',
	// 		'Access-Control-Allow-Methods': 'GET, POST, PUT',
	// 		'Access-Control-Allow-Headers': 'Version, Authorization, Content-Type',
	// 		'Access-Control-Allow-Credentials': true,
	// 	},
	// }
	//
	// const req = https.request(options, (res) => {
	// 	console.log(`statusCode: ${res.statusCode}`)
	//
	// 	res.on('data', (d) => {
	// 		process.stdout.write(d)
	// 	})
	// })
	//
	// req.on('error', (error) => {
	// 	console.error(error)
	// })
	//
	// req.write(data)
	// req.end()

	amo.auth({
		USER_LOGIN: 'fgp.stepanov@yandex.ru',
		USER_HASH: 'b59844aaa7ed1e42c43b5ff1e2a8747ee827a8c2'
	}).then(function createSomeTasks () {
		axios({
			method: 'get',
			url: 'https://cors-anywhere.herokuapp.com/fgpstepanov.amocrm.ru/api/v2/leads?responsible_user_id=2502274',
		}).then((data) => {
			console.log(req.query.manager_id)
			res.send(JSON.stringify(data));
		})
		.catch(err => console.log(err, req))

		// amo.getLeads({
		// 	responsible_user_id: '2502274',
		// 	// date_create: '1535534232',
		// 	filter.date_create.from: '1535534232',
		//
		// 	// status: ['20972836', '22210315'],
		// }).then((data) => {
		// 	console.log(req.query.manager_id)
		// 	res.send(JSON.stringify(data));
		// })
		// .catch(err => console.log(err, req))
		// https://fgpstepanov.amocrm.ru/api/v2/leads?responsible_user_id=2502274&status[0]=20972836&status[1]=22210315&status[2]=20184184&status[3]=22210318
	});
});


app.listen(port, function () {
	console.log('Example app listening on port' + port);
});
