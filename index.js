const Twinkly = require('./twinkly-api.js');
const twinkly = new Twinkly('192.168.50.6');


var frames = [
	twinkly.generateFullFrame({r: 244, g:0, b: 0}, 3),
]

twinkly.newMovieUpload({
	frames: frames,
	delay: 1000
});