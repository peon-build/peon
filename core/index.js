const tools = require('./tools/tools.js');
const config = require('./config/config.js');
const build = require('./build/build.js');
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
		//build manipulator
		build: build()
	}
}
//export
module.exports = peon;