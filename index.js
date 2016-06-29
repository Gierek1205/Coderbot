var express = require('express');
var bodyParser = require('body-parser');
var request = require('request');
var fs = require('fs');

var app = express();

var cieszynInfo = "To jest test";
var miastaInfo = ["Warszawa", "Cieszyn", "Cisie", "Zambrów", "Białystok", "Gdańsk", "Gliwice", "Poznań"];
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

				sendMessage(event.sender.id, {
					text: "!miasta, !godziny, !info <miasto>, !edit <miasto> \n !ustaw <wartosc do zapisania> \n !pokaz" +
						"\n" + "Zapraszamy do odwiedzenia naszej strony internetowej www.coderdojo.org.pl"
				});

			} else if (event.message.text.split(" ")[0] === "!save") {

				var city = event.message.text.split('"')[1];
				var wiadomosc = event.message.text.split('"')[3];

				ZapiszPlik(city, wiadomosc);



			} else if (event.message.text.split(" ")[0] === "!ustaw") {

				//tutaj dodawanie do bazy danych!!!

				process.env.CIESZYN_INFO = event.message.text.split(" ")[1];

				sendMessage(event.sender.id, {
					text: "Udalo ci sie ustawic zmienna na: " + process.env.CIESZYN_INFO
				});

			} else if (event.message.text === "!pokaz") {
				sendMessage(event.sender.id, {
					text: "ID: \n" + "MACIEK_ID: " + process.env.MACIEK_ID + "\nFRANEK_ID: " + process.env.FRANEK_ID +
						"\nCIESZYN_INFO: " + process.env.CIESZYN_INFO
				});



			} else if (event.message.text.toLowerCase() === "miasta") {

				sendMessage(event.sender.id, {
					text: "Lista miast w których znajduje się CoderDojo: " + "\n" +
						"Warszawa" + "\n" + "Cieszyn" + "\n" + "Cisie" + "\n" + "Zambrów" + "\n" + "Białystok" + "\n" + "Gdańsk" + "\n" + "Gliwice" + "\n" + "Poznań"
				});

			} else if (event.message.text.split(" ")[0].toLowerCase() === "info") {
				var end = 0;
				for (var z = 0; z < cities.length; z++) {
					if (event.message.text.toLowerCase().split(" ")[1] == cities[z].toLowerCase()) {
						sendMessage(event.sender.id, {
							text: miastaInfo[z]
						});
						end++;
					}
				}

				if (end === 0) {
					sendMessage(event.sender.id, {
						text: "Błąd, wpisz: !info <miasto>"
					});
				}

			} else if (event.message.text === "!whoami") {

				sendMessage(event.sender.id, {
					text: event.sender.id
				});

			} else if (event.message.text === "!edit") {

				sendMessage(event.sender.id, {
					text: "Prawidłowe użycie: !edit \"<miasto>\" \"<tresc wiadomosci>\""
				});


			} else if (event.message.text.split(" ")[0] === "!edit") {
				for (var z = 0; z < cities.length; z++) {
					if (event.message.text.toLowerCase().split('"')[1] == cities[z].toLowerCase()) {

						sendMessage(event.sender.id, {
							text: cities[z] + ": \n" + miastaInfo[z] + "\n    zmienione na: \n" + event.message.text.split('"')[3]
						});

						miastaInfo[z] = event.message.text.split('"')[3];
					}
				}

			} else {
				sendMessage(event.sender.id, {
					text: "Jesli nie wiesz co zrobic wpisz !help.  " + event.message.text
				});
			}


			res.sendStatus(200);
		}
	}
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

function ZapiszPlik(miasto, message) {
	var request = require("request");

	request("http://www.coderbot.cba.pl/index.php?pass=coderbot123&miasto=" + miasto + "&tekst=" + message + "&t=0x01",
		function(error, response, body) {
			console.log(body);
		});
};
/*
function ReadFile(miasto) {
	var resp = http.get(text: "http://www.coderbot.cba.pl/index.php?pass=coderbot123&miasto=" + miasto + "&t=0x00")

};
*/