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

function SMSDeliveryReportReceiver(callback) {
	this.SUCCESS_MESSAGE = JSON.stringify({
		'statusCode': 'S1000',
		'statusDetail': 'Success.'
	});
	this.REQUEST_DATA_CALLBACK_FUNCTION = callback;
}

function validateSMSJSON(JSONObject){
	//Implement validatior here
	return true;
}

SMSDeliveryReportReceiver.prototype.handleReceipt = function(request, response) {
	if(validateSMSJSON(request.body)){
		this.REQUEST_DATA_CALLBACK_FUNCTION(request.body);
		response.type('application/json');
		response.status(200).end(this.SUCCESS_MESSAGE);
	}
	else {
		response.status(500).end();
	}
};

exports.SMSDeliveryReportReceiver = SMSDeliveryReportReceiver;