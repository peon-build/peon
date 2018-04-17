const files = require('./files/files.search.js');
const tree = require('./files/files.tree.js');
const ignore = require('./files/files.ignore.js');
const dependencies = require('./dependencies/index.js');
const runtime = require('./runtime/index.js');
const normalize = require('./normalize/index.js')();


function peonTools() {
	//interface
	return {

		//files manipulator
		files: files,
		ignores: ignore,
		//tree file manipulator
		asTree: tree,
		//normalize
		normalize: normalize,
		//dependencies
		dependencies: dependencies,
		//runtime
		runtime: runtime
	}
}
//export
module.exports = peonTools;