/**
 * Package error
 * @param {Error} rawError
 * @param {PeonBuild.PeonRc.Package} original
 * @return {PeonBuild.Peon.Tools.FilesError}
 */
function packageError(rawError, original) {
	let error = /** @type {PeonBuild.Peon.Tools.PackageError}*/{};

	//fill data
	error.error = rawError;
	error.original = original;

	return error;
}
//export
module.exports = packageError;