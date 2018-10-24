const axios = require('axios');
const crypto = require('crypto');

const config = require('./config.json');

module.exports = class TwinklyLights {
	constructor(ipAddress) {
		this.ip = ipAddress;
	}
	getBaseUrl () {
		return `http://${this.ip}:80/xled/v1/`;
	}
	generateToken () {
		const _this = this;
		return new Promise((resolve, reject) => {
			crypto.randomBytes(32, function(err, buffer) {
		  		const token = buffer.toString('base64');
				return axios.post(`${config.base}${config.endpoints.login}`, {challenge: token})
					.then(response => {
						_this.credentials = response.data;
					})
					.then(() => {
						return _this.makeAuthenticatedRequest('verify', 'post');
					})	
					.then(resolve)
					.catch(error => {
						reject(error);
					});
			})

		})
	}
	areCredentialsValid () {
		if (!this.credentials || !this.credentials.authentication_token) {
		  	return false;
		}
		 return true;
	}
	makeAuthenticatedRequest (path, method, data) {
	  		if (!this.areCredentialsValid()) {
	  			console.log('Login needed, making credentials request');
	  			return this.generateToken()
		  			.then(() => {
		  				return this.makeAuthenticatedRequest(path, method, data)
		  			});
	  		}
	  		console.log(`Making ${path} request`)
	  		const requestOptions = {
			    method: method.toUpperCase(),
			    url: `${this.getBaseUrl()}${path}`,
			    data,
			    headers: {
			        'X-Auth-Token': this.credentials.authentication_token
			    },
			    json: true
			  }
		  	return axios(requestOptions)
			  	.then((status) => {
			  		console.log(path, 'request done')
			  	});
	}
	setMode (mode) {
		return this.makeAuthenticatedRequest('led/mode', 'post', {mode})
	}
}