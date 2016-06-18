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
	var events = req.body.entry[0].messaging;
	var czas = new Date();
	for (i = 0; i < events.length; i++) {
		var event = events[i];
		if (event.message && event.message.text) {

			if (event.message.text === "!help") {
				sendMessage(event.sender.id, {
					text: "!pogoda, !time, itp.. itd..."
				});
			} else if (event.message.text === "!time") {
				if (czas.getMinutes() < 10) {
					"0" + czas.getMinutes();
				}
				sendMessage(event.sender.id, {
					text: "Jest godzina " + (czas.getHours() + 2) + ":" + czas.getMinutes()
				});

			} else {
				sendMessage(event.sender.id, {
					text: "Maciek: " + event.message.text
				});
				sendMessage(event.sender.id, {
					text: "Jesli nie wiesz co zrobic wpisz !help"
				});
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