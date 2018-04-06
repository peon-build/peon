/**
 * Step error
 * @param {Error} rawError
 * @param {PeonBuild.PeonRc.Step|*} original
 * @return {PeonBuild.Peon.Tools.StepError}
 */
function stepError(rawError, original) {
	let error = /** @type {PeonBuild.Peon.Tools.StepError}*/{};

	//fill data
	error.error = rawError;
	error.original = original;

	return error;
}
//export
module.exports = stepError;