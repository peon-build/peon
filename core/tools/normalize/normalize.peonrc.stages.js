const toolStage = require('./as.stage.tool.js');
const stageError = require('./as.stage.error.js');

const errors = require('../../info/errors.js');

const enums = require('../../config/enum.js');

/**
 * Unify array
 * @param {Array.<PeonBuild.PeonRc.Stage>} stages
 * @return {Array.<PeonBuild.Peon.Tools.Stage>}
 */
function unifyArray(stages) {
	let i,
		unified = [];

	for (i = 0; i < stages.length; i++) {
		unified.push(unifyStage(stages[i]));
	}

	return unified;
}

/**
 * Unify stage
 * @param {PeonBuild.PeonRc.Stage} object
 * @return {PeonBuild.Peon.Tools.Stage}
 */
function unifyStage(object) {
	let stage,
		obj = /** @type {PeonBuild.PeonRc.Stage}*/object;

	//1: object
	if (obj instanceof Object) {
		return unifyObject(obj);

	//2: string
	} else if (typeof object === "string") {
		return unifyString(/** @type {string}*/object);
	}

	//3: error
	stage = toolStage("", enums.WhenType.automatic);
	stage.error = stageError(
		new Error(errors.INVALID_STAGE_FORMAT),
		/** @type {PeonBuild.PeonRc.File}*/obj
	);
	//stage
	return stage;
}

/**
 * Unify object
 * @param {PeonBuild.PeonRc.StageDef} object
 * @return {PeonBuild.Peon.Tools.Stage}
 */
function unifyObject(object) {
	let stage;

	//create stage
	stage = /** @type {PeonBuild.Peon.Tools.Stage}*/toolStage(object.name, object.when || enums.WhenType.automatic);

	//error state
	if (!stage.name) {
		stage.error = stageError(
			new Error(errors.STAGE_HAS_NO_NAME),
			/** @type {PeonBuild.PeonRc.Stage}*/object
		)
	}

	return stage;
}

/**
 * Unify string
 * @param {string} name
 * @return {PeonBuild.Peon.Tools.Stage}
 */
function unifyString(name) {
	return toolStage(name, enums.WhenType.automatic);
}

/**
 * Unify
 * @param {Array.<PeonBuild.PeonRc.Stage>|*} stages
 * @return {Array.<PeonBuild.Peon.Tools.Stage>}
 */
function unify(stages) {
	let stage,
		unified = [];

	//1: Array
	if (stages instanceof Array) {
		unified.push(...unifyArray(/** @type {Array.<PeonBuild.PeonRc.Stage>}*/stages));

	//2: whatever
	} else {
		stage = toolStage("", enums.WhenType.automatic);
		stage.error = stageError(
			new Error(errors.INVALID_STAGE_DEFINITION),
			stages
		);
		unified.push(stage);
	}

	return unified;
}
//export
module.exports = unify;