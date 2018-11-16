const axios = require('axios');
const crypto = require('crypto');

const config = require('./config.json');

module.exports = class TwinklyLights {
	constructor(ipAddress) {
		if (!ipAddress) {
			throw new Error('Device address must be passed');
		}
		this.ip = ipAddress;
		this.crypto = crypto;
		this.axios = axios;
	}
	getBaseUrl () {
		return `http://${this.ip}:80/xled/v1/`;
	}
	generateToken () {
		const _this = this;
		return new Promise((resolve, reject) => {
			this.crypto.randomBytes(32, (err, buffer) => {
		  		const token = buffer.toString('base64');
				return this.axios.post(`${_this.getBaseUrl()}${config.endpoints.login}`, {challenge: token})
					.then(response => {
						this.credentials = response.data;
						this.credentialsExpiry = new Date().getTime() + ((_this.credentials.authentication_token_expires_in * 1000) - 5000)
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
		if (this.credentialsExpiry <= new Date().getTime()) {
			return false;
		}
		return true;
	}
	makeAuthenticatedRequest (path, method, data, type = 'application/json') {
	  		if (!this.areCredentialsValid()) {
	  			console.log('Login needed, making credentials request');
	  			return this.generateToken()
		  			.then(() => {
		  				return this.makeAuthenticatedRequest(path, method, data)
		  			});
	  		}
	  		const requestOptions = {
			    method: method.toUpperCase(),
			    url: `${this.getBaseUrl()}${path}`,
			    data,
			    headers: {
			        'X-Auth-Token': this.credentials.authentication_token,
			        'Content-Type': type
			    },
			    json: true
			  }
		  	return this.axios(requestOptions)
			  	.then((status) => {
			  		console.log(path, 'request done')
			  	});
	}
	setMode (mode) {
		return this.makeAuthenticatedRequest(config.endpoints.mode, 'post', {mode})
	}
	setDeviceName (name) {
		return this.makeAuthenticatedRequest(config.endpoints.deviceName, 'post', {name})
	}
	resetDevice () {
		return this.makeAuthenticatedRequest(config.endpoints.reset, 'post', {})
	}
	newMovieConfig (delay, leds, frames) {
		return this.makeAuthenticatedRequest(config.endpoints.movieConfig, 'post', {
			frame_delay: delay,
			leds_number: leds,
			frames_number: frames
		})
	}

	sendMovieToDevice (movie) {
		return this.makeAuthenticatedRequest(config.endpoints.movie, 'post', movie, 'application/octet-stream')
	}
	convertMovieFormat (movie) {
		const fullArray =[];
		const output = {
			bufferArray: undefined,
			frameCount: movie.frames.length,
			lightsCount: movie.frames[0].length
		}
		for (let x =0; x < movie.frames.length; x++) {
			if (movie.frames[x].length !== output.lightsCount) {
				throw new Error('Not all frames have the same number of lights!')
			}
			for (let y = 0; y < movie.frames[x].length; y++) {
				fullArray.push(movie.frames[x][y].r);
				fullArray.push(movie.frames[x][y].g);
				fullArray.push(movie.frames[x][y].b);
			}
		}
		output.bufferArray = new ArrayBuffer(fullArray.length);


		const longInt8View = new Uint8Array(output.bufferArray);

		for (let x =0; x < fullArray.length; x++) {
			longInt8View[x] = fullArray[x];
		}
		return output;

	}
	generateFullFrame (colour, lightCount) {
		const frame = []
		for (let x = 0; x < lightCount; x++) {
			frame.push({r: colour.r,g: colour.g,b: colour.b});
		}
		return frame;

	}
	newMovieUpload (movie) {
		const movieFormat = this.convertMovieFormat(movie);
		return this.setMode("off")
		.then (() => {
			return this.sendMovieToDevice(movieFormat.bufferArray)
		})
		.then(() => {
			return this.newMovieConfig(movie.delay, movieFormat.lightsCount, movieFormat.frameCount)
		})

		.then(() => {
			return this.setMode("movie")
		})
	}
}