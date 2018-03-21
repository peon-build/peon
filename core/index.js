const files = require('./tools/files.js');
const config = require('./config/config.js');
const tree = require('./tools/files.tree.js');
const ignored = require('./tools/files.ignore.js');


function peon() {
	//interface
	return {

		//files manipulator
		files: files,
		ignored: ignored,
		//tree file manipulator
		tree: tree,
		//config manipulator
		config: config()

	}
}
//export
module.exports = peon;