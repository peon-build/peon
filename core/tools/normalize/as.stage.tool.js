/**
 * Tool stage
 * @param {string} name
 * @param {PeonBuild.PeonRc.WhenType} when
 * @return {PeonBuild.Peon.Tools.Stage}
 */
function toolStage(name, when) {
	let stage = /** @type {PeonBuild.Peon.Tools.Stage}*/{};

	//fill data
	stage.name = name;
	stage.when = when;
	stage.error = null;

	return stage;
}
//export
module.exports = toolStage;