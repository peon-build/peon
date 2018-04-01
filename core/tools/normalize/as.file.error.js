/**
 * Files error
 * @param {Error} rawError
 * @param {PeonBuild.PeonRc.File} original
 * @return {PeonBuild.Peon.Tools.FilesError}
 */
function filesError(rawError, original) {
	let error = /** @type {PeonBuild.Peon.Tools.FilesError}*/{};

	//fill data
	error.error = rawError;
	error.original = original;

	return error;
}
//export
module.exports = filesError;