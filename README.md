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