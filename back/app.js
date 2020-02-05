// RGAPI-ccdb30eb-5b24-477e-a8d1-d28f8a61c4ff

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
		"X-Riot-Token": "RGAPI-ccdb30eb-5b24-477e-a8d1-d28f8a61c4ff",
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
