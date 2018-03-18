const commandConfig = require('./config');


function commands() {
	//interface
	return {
		config: commandConfig
	}
}
//export
module.exports = commands;