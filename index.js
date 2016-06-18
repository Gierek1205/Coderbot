var express = require('express');
var bodyParser = require('body-parser');
var request = require('request');
var app = express();

app.use(bodyParser.urlencoded({
	extended: false
}));
app.use(bodyParser.json());
app.listen((process.env.PORT || 3000));

// Server frontpage
app.get('/', function(req, res) {
	res.send('This is TestBot Server');
});

// Facebook Webhook
app.get('/webhook', function(req, res) {
	if (req.query['hub.verify_token'] === 'testbot_verify_token') {
		res.send(req.query['hub.challenge']);
	} else {
		res.send('Invalid verify token');
	}
});

// handler receiving messages---------------------------------------------------------------------------------------------------------
app.post('/webhook', function(req, res) {

	// our variables

	var cities = ["warszawa", "cieszyn", "cisie", "zambrow", "bialystok"];

	var events = req.body.entry[0].messaging;
	for (i = 0; i < events.length; i++) {
		var event = events[i];
		if (event.message && event.message.text) {

			if (event.message.text.toLowerCase() === "miasta") {
				sendMessage(event.sender.id, {
					text: "Wpisz (w nastepnej wiadomosci) nazwe dowolego miasta, w ktorym jest Coderdojo."
				});
			}

			for (var i = 0; i < cities.length; i++) {
				if (event.message.text.toLowerCase() === cities[i]) {
					sendMessage(event.sender.id, {
						text: "Wybrano miasto: " + cities[i] + ", strona internetowa tego Coderdojo to: " + cities[i] +
							".coderdojo.org.pl"
					});
				}
			}
		}
	}
	res.sendStatus(200);
});

// generic function sending messagesp-------------------------------------------------------------------------------------------------------
function sendMessage(recipientId, message) {
	request({
		url: 'https://graph.facebook.com/v2.6/me/messages',
		qs: {
			access_token: process.env.PAGE_ACCESS_TOKEN
		},
		method: 'POST',
		json: {
			recipient: {
				id: recipientId
			},
			message: message,
		}
	}, function(error, response, body) {
		if (error) {
			console.log('Error sending message: ', error);
		} else if (response.body.error) {
			console.log('Error: ', response.body.error);
		}
	});
};