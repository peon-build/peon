const commandConfig = require('./config');
const commandBuild = require('./build');


function commands() {
	//interface
	return {
		config: commandConfig,
		build: commandBuild
	}
}
//export
module.exports = commands;