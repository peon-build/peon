const tools = require('./tools/tools.js');
const config = require('./config/config.js');

function peon() {
	//interface
	return {

		//tools
		tools: tools(),
		//config manipulator
		config: config()

	}
}
//export
module.exports = peon;