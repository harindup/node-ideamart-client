/*
	Copyright (c) 2014 - 2015 R. A. Harindu Perera

	Permission is hereby granted, free of charge, to any person obtaining a copy
	of this software and associated documentation files (the "Software"), to deal
	in the Software without restriction, including without limitation the rights
	to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
	copies of the Software, and to permit persons to whom the Software is
	furnished to do so, subject to the following conditions:

	The above copyright notice and this permission notice shall be included in
	all copies or substantial portions of the Software.

	THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
	IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
	FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
	AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
	LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
	OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
	THE SOFTWARE.
*/

var https = require('https');
var url = require('url');

function USSDSender(options) {
	this.APPLICATION_ID = options.applicationId;
	this.SEND_ENDPOINT_URL = options.sendEndpointURL;
	this.API_VERSION = options.apiVersion;
	this.PASSWORD = options.password;
	return this;
}

USSDSender.prototype.sendMessage = function(messageObject, callback) {
	messageObject['applicationId'] = this.APPLICATION_ID;
	messageObject['password'] = this.PASSWORD;
	messageObject['version'] = this.API_VERSION;
	var data = JSON.stringify(messageObject);
	var httpOptions = url.parse(this.SEND_ENDPOINT_URL);
	httpOptions['method'] = 'POST';
	httpOptions['headers'] = {"Content-Type": "application/json"};
	var apiResponse = "";
	this.request = https.request(httpOptions, function(response){
		response.setEncoding('ascii');
		response.on('data', function(chunk){
			apiResponse+=chunk;
		})
		response.on('end', function(){
			if (apiResponse == "") {
				callback(true, null);
			}
			else {
				try {
					var parsedJSON = JSON.parse(apiResponse);
					callback(false, parsedJSON);
				}
				catch(e) {
					callback(true, apiResponse);
				}
			}
		});
	});
	this.request.write(data);
	this.request.end();
}

USSDSender.prototype.sendUSSDTextMessageInit = function(message, phoneNumber, callback) {
	this.sendMessage({
		'message': message,
		'ussdOperation': 'mt-init',
		'destinationAddress': 'tel:'+phoneNumber.toString()
	}, callback);
};

USSDSender.prototype.sendUSSDTextMessageCont = function(message, phoneNumber, sessionId, callback) {
	this.sendMessage({
		'message': message,
		'ussdOperation': 'mt-cont',
		'destinationAddress': 'tel:'+phoneNumber.toString(),
		'sessionId': sessionId
	}, callback);
};

USSDSender.prototype.sendUSSDTextMessageFinal = function(message, phoneNumber, sessionId, callback) {
	this.sendMessage({
		'message': message,
		'ussdOperation': 'mt-fin',
		'destinationAddress': 'tel:'+phoneNumber.toString(),
		'sessionId': sessionId
	}, callback);
};

USSDSender.prototype.sendUSSDMenu = function(menuObject, phoneNumber, sessionId, ussdOperation, callback) {
	var messageString = "";
	for(var number in menuObject) {
		messageString+=number.toString()+". "+menuObject[number]+"\n";
	}
	if (ussdOperation == 'mt-init') {
		this.sendUSSDTextMessageInit(messageString, phoneNumber, callback);
	}
	else {
	this.sendUSSDTextMessageCont(messageString, phoneNumber, sessionId, callback);	
	}
};

USSDSender.prototype.sendUSSDMenuInit = function(menuObject, phoneNumber, callback) {
	this.sendUSSDMenu(menuObject, phoneNumber, null, 'mt-init', callback);
};

USSDSender.prototype.sendUSSDMenuCont = function(menuObject, phoneNumber, sessionId, callback) {
	this.sendUSSDMenu(menuObject, phoneNumber, sessionId, 'mt-cont', callback);
};

USSDSender.prototype.sendUSSDMenuFinal = function(menuObject, phoneNumber, sessionId, callback) {
	this.sendUSSDMenu(menuObject, phoneNumber, sessionId, 'mt-fin', callback);
};


exports.USSDSender = USSDSender;