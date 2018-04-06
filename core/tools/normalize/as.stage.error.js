/**
 * Stage error
 * @param {Error} rawError
 * @param {PeonBuild.PeonRc.Stage|*} original
 * @return {PeonBuild.Peon.Tools.StageError}
 */
function stageError(rawError, original) {
	let error = /** @type {PeonBuild.Peon.Tools.Stage}*/{};

	//fill data
	error.error = rawError;
	error.original = original;

	return error;
}
//export
module.exports = stageError;