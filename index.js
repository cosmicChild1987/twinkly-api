const Twinkly = require('./twinkly-api.js');
const twinkly = new Twinkly('192.168.50.6');


const pattern = require('./samples/randomFill.js').generateJSON(twinkly);

twinkly.newMovieUpload({
	frames: pattern,
	delay: 250
});