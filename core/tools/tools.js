const files = require('./files/files.search.js');
const tree = require('./files/files.tree.js');
const ignore = require('./files/files.ignore.js');


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