/**
 * Tool files
 * @param {Array.<string>} dest
 * @param {Array.<string>} src
 * @return {PeonBuild.Peon.Tools.Files}
 */
function toolFiles(dest, src) {
	let files = /** @type {PeonBuild.Peon.Tools.Files}*/{};

	//fill data
	files.ignorePattern = [];
	files.destination = dest;
	files.source = src;
	files.error = null;

	return files;
}
//export
module.exports = toolFiles;