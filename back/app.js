// in sublime
const express = require('express');
const port = process.env.PORT || 3000;
const cors = require('cors');
const axios = require('axios');
const app = express();
const token = 'RGAPI-5ee7193c-070f-4fed-b4d1-05fc5f2b18bc';

app.use(cors());

app.get('/profile', cors(), function (req, res, next) {
	const region = req.query.region;
	const query = req.query.query;
	const url = 'https://' + region + '.api.riotgames.com' + query;
	const headers = {
		"X-Riot-Token": token,
	};
	axios.get(url, { headers })
		.then((resp) => {
			return res.status(200).send(resp.data);
		})
		.catch((err) => {
			console.warn(err);
			return res.status(500).send();
		});
});

app.get('/profileinfos', cors(), function (req, res, next) {
	const region = req.query.region;
	const query = req.query.query;
	const url = 'https://' + region + '.api.riotgames.com' + query;
	const headers = {
		"X-Riot-Token": token,
	};
	axios.get(url, { headers })
		.then((resp) => {
			return res.status(200).send(resp.data);
		})
		.catch((err) => {
			console.warn(err);
			return res.status(500).send();
		});
});
app.get('/products/', cors(), function (req, res, next) {
  res.json({msg: 'This is CORS-enabled for a Single Route'})
})

app.listen(port, function () {
 console.log('Example app listening on port ' + port + '!');
});
