/**
 * Entry error
 * @param {Error} rawError
 * @param {PeonBuild.PeonRc.Entry} original
 * @return {PeonBuild.Peon.Tools.FilesError}
 */
function entryError(rawError, original) {
	let error = /** @type {PeonBuild.Peon.Tools.EntryError}*/{};

	//fill data
	error.error = rawError;
	error.original = original;

	return error;
}
//export
module.exports = entryError;