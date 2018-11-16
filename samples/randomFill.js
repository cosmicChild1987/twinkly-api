module.exports = {
	generateJSON: (twinkly) => {
		const lights = 175;
		const frames = [];
		const col1 = {r: 0, g:0, b: 255};
		const col2 = {r: 255, g:255, b: 255};

		frames.push(twinkly.generateFullFrame(col1, lights));

		const upIndex = [];
		const downIndex = [];

		for (let x =0; x < lights; x++) {
			upIndex[x] = x;
			downIndex[x] = x;
		}

		let previous = twinkly.generateFullFrame(col1, lights)
		for (let x = 1; x < lights + 1; x++) {
			let indexToPick = Math.floor((Math.random() * upIndex.length));
			const nextIndex = upIndex[indexToPick];
			upIndex.splice(indexToPick, 1)
			previous[nextIndex] = col2
			frames.push(Object.assign([], previous));
		}

		frames.push(twinkly.generateFullFrame(col2, 175));
		frames.push(twinkly.generateFullFrame(col2, 175));
		frames.push(twinkly.generateFullFrame(col2, 175));

		for (let x = 1; x < lights + 1; x++) {
			let indexToPick = Math.floor((Math.random() * downIndex.length));
			const nextIndex = downIndex[indexToPick];
			downIndex.splice(indexToPick, 1)
			previous[nextIndex] = col1;
			frames.push(Object.assign([], previous));
		}
		return frames;
	}
}