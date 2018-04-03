/**
 * Tool entry
 * @param {string} file
 * @return {PeonBuild.Peon.Tools.Files}
 */
function toolEntry(file) {
	let entry = /** @type {PeonBuild.Peon.Tools.Entry}*/{};

	//fill data
	entry.file = file;

	return entry;
}
//export
module.exports = toolEntry;