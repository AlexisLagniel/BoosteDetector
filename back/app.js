// in sublime
const express = require('express');
const port = process.env.PORT || 3000;
const cors = require('cors');
const axios = require('axios');
const app = express();

app.use(cors());

app.get('/profile', cors(), function (req, res, next) {
	const region = req.query.region;
	const query = req.query.query;
	const url = 'https://' + region + '.api.riotgames.com' + query;
	const headers = {
		"X-Riot-Token": "RGAPI-8d2a0dbc-1c48-4ea1-aa3d-36ee739800c3",
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
		"X-Riot-Token": "RGAPI-8d2a0dbc-1c48-4ea1-aa3d-36ee739800c3",
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

app.listen(port, function () {
 console.log('Example app listening on port ' + port + '!');
});
