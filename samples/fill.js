module.exports = {
	generateJSON: (twinkly) => {
		const frames = [];

		for (let x =0; x < 175; x++) {
			frames.push(twinkly.generateFullFrame({r: 0, g:244, b: 0}, 175));
			for (let y = 0; y <= x ; y++) {
				frames[x][y].r = 244;
				frames[x][y].g = 0;
			}
		}

		for (let x =0; x < 175; x++) {
			frames.push(twinkly.generateFullFrame({r: 244, g:0, b: 0}, 175));
			for (let y = 0; y <= x ; y++) {
				frames[x + 175][y].r = 0;
				frames[x + 175][y].g = 244;
			}
		}
		return frames;
	}
}