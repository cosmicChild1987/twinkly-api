# Twinkly API
## Description
This is a simple client helper to enable simple interactions with Twinkly smart lights <https://www.twinkly.com/>.

## Getting Started
```
const Twinkly = require('./twinkly-api.js');
const twinkly = new Twinkly('192.168.0.xxx');
twinkly.setMode('off');

```

## Methods

Currently this client is very limited, please feel free to contribute to expand it.

### setMode
Set the current mode of the LED lights

##### Parameters
* Mode (String), this can be one of the following options
	* off - turns off lights
	* demo - starts predefined sequence of effects that are changed after few seconds
	* movie - plays predefined or uploaded effect
	* rt - receive effect in real time

##### Response
	Returns a promise, with no data
	
#### setDeviceName
Changes the name of the current device

##### Parameters
* Name (String), Desired device name. At most 32 characters.

##### Response
	Returns a promise, with no data

#### resetDevice
Restart the current animation

##### Parameters
* none.

##### Response
Returns a promise, with no data
	
#### generateFullFrame
Generate a full frame of a solid colour

##### Parameters
* colour - object containing r,g,b parameters you wish to set between 0-244
* lightCount - the total number of lights you wish to generate the frame for

##### Response
	Returns an array containing the details of a single frame
	
#### newMovieUpload
Sends a new 'movie' to the device, and displays it

##### Parameters
* movie - js object containing the configurate
	* delay - the number of milliseconds to wait between each frame
	* frames - array of frames
		* light - `{r: 0-244, g: 0-244, b: 0-244}`

Example: Alternate between all lights set to white, and each light being a different colour, with a pause of 1 second between each change

```
	var frames = [
		twinkly.generateFullFrame({r: 244, g:244, b: 244}, 3),
		[
			[{r: 244, g:0, b: 0}],
			[{r: 0, g:244, b: 0}],
			[{r: 0, g:0, b: 244}],
		]
	]
	
	twinkly.newMovieUpload({
		frames: frames,
		delay: 1000
	});
```

##### Response
Returns a promise, with no data
		