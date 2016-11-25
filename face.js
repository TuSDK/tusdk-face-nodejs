var crypto = require('crypto');
var fs = require('fs');
var request = require('request');

const API_URL = 'https://srv.tusdk.com/srv/face/';

function tuface(keys) {

	this.pid = keys.pid;
	this.key = keys.key;

	this.request = function(method, params, callback) {
		if (this.pid == undefined || this.key == undefined) {
			throw "pid and key are required";
		}

		var _params = {};

		if (params.url !== undefined ) {
			_params.url = params.url	
		} else if (params.file !== undefined) {					
			_params.pic = fs.createReadStream(params.file);
		} else {
			throw "parameter missing : url or file ";
		}

		delete params.url;
		delete params.file;

		for (var k in params) {
			_params[k] = params[k];
		}	

		_params.pid = this.pid;
		_params.t = Math.floor(Date.now() / 1000)
		_params.sign = sign(_params, this.key);

		request.post({url:API_URL+method, formData: _params}, function optionalCallback(err, httpResponse, body) {
			if (err) {
				throw err
			}
			if (typeof(callback) == 'function') {
				callback(JSON.parse(body))
			}
		});	
	}

}

function sign(params, key) {
	keys = [];
	for (var k in params) {
		keys.push(k);
	}
	keys.sort();
	var signstr = '';
	for (var i in keys) {
		signstr += keys[i].toLowerCase() + params[keys[i]]
	}
	signstr += key
	return crypto.createHash('md5').update(signstr).digest('hex');
}

module.exports = tuface;