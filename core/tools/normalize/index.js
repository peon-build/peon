const asGlob = require('./as.glob.js');
const normalizePeonRcFile = require('./normalize.peonrc.file.js');
const normalizePeonRcEntry = require('./normalize.peonrc.entry.js');
const normalizePeonRcStages = require('./normalize.peonrc.stages.js');
const normalizePeonRcSteps = require('./normalize.peonrc.steps.js');
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
		normalizePeonRcFile: normalizePeonRcFile,
		//normalizePeonRcFile
		normalizePeonRcEntry: normalizePeonRcEntry,
		//normalizePeonRcStages
		normalizePeonRcStages: normalizePeonRcStages,
		//normalizePeonRcSteps
		normalizePeonRcSteps: normalizePeonRcSteps
	}
}
//export
module.exports = normalize;