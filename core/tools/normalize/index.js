const asGlob = require('./as.glob.js');
const normalizePeonRcFile = require('./normalize.peonrc.file.js');
const toolFile = require('./as.file.tool.js');
const fileError = require('./as.file.error.js');

function normalize() {
	//interface
	return {
		//as glob
		asGlob: asGlob,
		//as tool file
		asToolFile: toolFile,
		//as file error
		asFileError: fileError,
		//normalizePeonRcFile
		normalizePeonRcFile: normalizePeonRcFile
	}
}
//export
module.exports = normalize;