const commandConfig = require('./config');
const commandRun = require('./run');


function commands() {
	//interface
	return {
		config: commandConfig,
		run: commandRun
	}
}
//export
module.exports = commands;