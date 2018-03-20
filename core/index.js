const files = require('./tools/files');
const config = require('./config/config');
const tree = require('./tools/files.tree');
const ignored = require('./tools/files.ignore');


function peon() {
	//interface
	return {

		//files manipulator
		files: files,
		ignored: ignored,
		//tree manipulator
		tree: tree,
		//config manipulator
		config: config()

	}
}
//export
module.exports = peon;