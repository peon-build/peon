const files = require('./tools/files');
const config = require('./config/config');
const tree = require('./tools/files.tree');


function peon() {
	//interface
	return {

		//files manipulator
		files: files,
		//tree manipulator
		tree: tree,
		//config manipulator
		config: config()

	}
}
//export
module.exports = peon;