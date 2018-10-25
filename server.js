const express = require('express');
const https = require('https')
const request = require('request')
const cors = require('cors')
const AmoCRM = require('amocrm-api');
const amo = new AmoCRM('https://fgpstepanov.amocrm.ru');
const app = express();

app.use(cors())

const port = process.env.PORT || 8000

app.use(function(req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	next();
});

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
	console.log(req.query.from, req.query.to)

	request.get(`https://fgpstepanov.amocrm.ru/api/v2/leads?USER_LOGIN=fgp.stepanov@yandex.ru&USER_HASH=b59844aaa7ed1e42c43b5ff1e2a8747ee827a8c2&responsible_user_id=2502274&status[0]=20972836&status[1]=22210315&status[2]=20184184&status[3]=22210318&filter[date_create][from]=${req.query.from}&filter[date_create][to]=${req.query.to}`, function(err, httpResponse, body) {
		console.log(JSON.parse(body), 'don')
		res.send(JSON.parse(body))
	})

	// const post_data = JSON.stringify({
	// 	USER_LOGIN: "fgp.stepanov@yandex.ru",
	// 	USER_HASH: "b59844aaa7ed1e42c43b5ff1e2a8747ee827a8c2"
	// })
	//
	// var post_options = {
	// 	method: 'POST',
	// 	host: 'fgpstepanov.amocrm.ru',
	// 	path: '/private/api/auth.php',
	// 	port: 443,
	// 	headers: {
	// 		'Content-Type': 'application/json',
	// 		'Content-Length': Buffer.byteLength(post_data)
	// 	}
	// };
	// console.log('wher')
	// var post_req = https.request(post_options, function(res) {
	// 	res.setEncoding('utf8');
	// 	// response.send(res);
	// 	console.log(res.statusCode)
	// 	console.log("headers: ", post_req);
	// 	res.on('data', function (chunk) {
	// 			process.stdout.write(chunk)
	// 			console.log('Response: ' + chunk);
	// 	});
	// });
	// console.log(post_data)
	// post_req.write(post_data);
	// post_req.end();
	// post_req.on('error', function(e) {
	// 	console.error(e);
	// });
	// https.request(post_options, () => {
	// 	console.log('done')
	// }).then(() => {
	// 	https.get('https://fgpstepanov.amocrm.ru/api/v2/leads?responsible_user_id=2502274&status[0]=20972836&status[1]=22210315&status[2]=20184184&status[3]=22210318', (resp) => {
	// 		let data = '';
	//
	// 		// A chunk of data has been recieved.
	// 		resp.on('data', (chunk) => {
	// 			data += chunk;
	// 		});
	//
	// 		// The whole response has been received. Print out the result.
	// 		resp.on('end', () => {
	// 			console.log(JSON.parse(data));
	// 		});
	//
	// 	}).on("error", (err) => {
	// 		console.log("Error: " + err.message);
	// 	});
	//
	// 	// amo.getLeads({
	// 	// 	responsible_user_id: '2502274',
	// 	// 	// date_create: '1535534232',
	// 	// 	status: '20972836',
	// 	// }).then((data) => {
	// 	// 	console.log(req)
	// 	// 	res.send(JSON.stringify(data));
	// 	// }).catch(err => console.log(err))
	// 	// // https://fgpstepanov.amocrm.ru/api/v2/leads?responsible_user_id=2502274&status[0]=20972836&status[1]=22210315&status[2]=20184184&status[3]=22210318
	// });
});


app.listen(port, function () {
	console.log('Example app listening on port' + port);
});
