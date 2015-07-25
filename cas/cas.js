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

function CASClient(options) {
	this.APPLICATION_ID = options.applicationId;
	this.CAS_BALANCE_ENDPOINT_URL = options.balanceEndpointURL;
	this.CAS_DEBIT_ENDPOINT_URL = options.debitEndpointURL;
	this.PASSWORD = options.password;
	this.PAYMENT_INSTRUMENT_NAME = options.paymentInstrumentName;
	this.CURRENCY = options.currency;
}

CASClient.prototype.casQuery = function(casObject, endpoint_url, callback) {
	casObject['applicationId'] = this.APPLICATION_ID;
	casObject['password'] = this.PASSWORD;
	//casObject['paymentInstrumentName'] = this.PAYMENT_INSTRUMENT_NAME;
	//casObject['currency'] = this.CURRENCY;
	var data = JSON.stringify(casObject);
	var httpOptions = url.parse(endpoint_url);
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

CASClient.prototype.queryBalance = function(subscriber_no, callback) {
	var casObject = {};
	casObject['subscriberId'] = "tel:"+subscriber_no;
	this.casQuery(casObject, this.CAS_BALANCE_ENDPOINT_URL, callback);
};

CASClient.prototype.directDebit = function(subscriber_no, amount, transaction_id, callback) {
	var casObject = {};
	casObject['subscriberId'] = "tel:"+subscriber_no;
	casObject['amount'] = amount;
	casObject['externalTrxId'] = transaction_id;
	//casObject['paymentInstrumentName'] = this.PAYMENT_INSTRUMENT_NAME;
	this.casQuery(casObject, this.CAS_DEBIT_ENDPOINT_URL, callback);
};

exports.CASClient = CASClient;