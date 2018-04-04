const tools = require('./tools/tools.js');
const config = require('./config/config.js');
const run = require('./run/run.js');
const errors = require('./info/errors.js');
const tips = require('./info/tips.js');

function peon() {
	//interface
	return {

		//info data
		info: {
			errors: errors,
			tips: tips
		},

		//tools
		tools: tools(),
		//config manipulator
		config: config(),
		//run manipulator
		run: run()
	}
}
//export
module.exports = peon;