/**
 * Tool step
 * @param {string} name
 * @param {string} stage
 * @return {PeonBuild.Peon.Tools.Step}
 */
function toolStep(name, stage) {
	let step = /** @type {PeonBuild.Peon.Tools.Step}*/{};

	//fill data
	step.name = name;
	step.stage = stage;
	step.error = null;

	return step;
}
//export
module.exports = toolStep;