// in sublime
const express = require('express');
const port = process.env.PORT || 3000;
const cors = require('cors');
const axios = require('axios');
const app = express();
const token = 'RGAPI-856ad02b-68ba-4aaa-8b2f-010c8ada7a0d';

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
app.get('/matches', cors(), function (req, res, next) {
	const region = req.query.region;
	const encryptedId = req.query.encryptedId;
	const params = req.query.params;
	const url = 'https://' + region + '.api.riotgames.com/lol/match/v4/matchlists/by-account/'  + encryptedId + params;
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

app.get('/profileByName', cors(), function (req, res, next) {
	const region = req.query.region;
	const name = req.query.name;
	const url = 'https://' + region + '.api.riotgames.com/lol/summoner/v4/summoners/by-name/' + encodeURIComponent(name);
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

app.get('/profileByEncryptedSummonerName', cors(), function (req, res, next) {
	const region = req.query.region;
	const encryptedSummonerName = req.query.encryptedSummonerName;
	const url = 'https://' + region + '.api.riotgames.com/lol/league/v4/entries/by-summoner/' + encodeURIComponent(encryptedSummonerName);
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
