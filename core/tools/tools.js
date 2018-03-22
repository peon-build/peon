const files = require('./files.search.js');
const tree = require('./files.tree.js');
const ignore = require('./files.ignore.js');


function peonTools() {
	//interface
	return {

		//files manipulator
		files: files,
		ignores: ignore,
		//tree file manipulator
		asTree: tree
	}
}
//export
module.exports = peonTools;