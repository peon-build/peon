const files = require('./tools/files');
const config = require('./config/config');
const tree = require('./tools/files.tree');

const commandConfig = require('./commands/config');


function peon() {
	//interface
	return {

		//files manipulator
		files: files,
		//tree manipulator
		tree: tree,
		//config manipulator
		config: config(),


		//commands
		commands: {
			config: commandConfig
		}

	}
}
//export
module.exports = peon;