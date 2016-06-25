var express = require('express');
var bodyParser = require('body-parser');
var request = require('request');
var app = express();
var franekId = 983172028462771,
	maciekId = 1407458155946819,
	cieszynInfo = "To jest test";
// newsletter var cieszynEdit = [];

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
	var cities = ["Warszawa", "Cieszyn", "Cisie", "Zambrów", "Białystok", "Gdańsk", "Gliwice", "Poznań"];
	for (i = 0; i < events.length; i++) {
		var event = events[i];
		if (event.message && event.message.text) {

			if (event.message.text === "!help") {
				app.push(event.message.text);
				sendMessage(event.sender.id, {
					text: "!miasta, \n!godziny, \n!info <miasto>, \n!edit <miasto>" + "\n" + "Zapraszamy do odwiedzenia naszej strony internetowej www.coderdojo.org.pl"
				});
			} else if (event.message.text === "!miasta") {

				sendMessage(event.sender.id, {
					text: "Lista miast w których znajduje się CoderDojo:"
				});
				setTimeout(function() {}, 3000);
				for (var i = 0; i < cities.length; i++) {
					sendMessage(event.sender.id, {
						text: cities[i]
					});
				};

			} else if (event.message.text.split(" ")[0] === "!info") {

				for (var z = 0; z < cities.length; z++) {
					if (event.message.text.split(" ")[1].toLowerCase() == cities[z].toLowerCase()) {
						sendMessage(event.sender.id, {
							text: cieszynInfo
						});

					}
				}

			} else if (event.message.text === "!whoami") {

				sendMessage(event.sender.id, {
					text: event.sender.id + "\nprosimy nie używać .NOT"
				});

			} else if (event.message.text.split('"')[0] === "!edit ") {



				if (event.sender.id == franekId || event.sender.id == maciekId) {

					var cieszynInfoCopy = cieszynInfo;

					cieszynInfo = event.message.text.split('"')[1];

					sendMessage(event.sender.id, {
						text: "Aktualna wartość zmiennej: " + cieszynInfoCopy + "\n" + "Zmieniono na: " + cieszynInfo
					});

				}

				sendMessage(event.sender.id, {
					text: event.sender.id + " prosimy nie używać .NOT"
				});

			} else {
				sendMessage(event.sender.id, {
					text: "Jesli nie wiesz co zrobic wpisz !help."
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