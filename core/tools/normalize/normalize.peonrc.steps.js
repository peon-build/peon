const toolStep = require('./as.step.tool.js');
const stepError = require('./as.step.error.js');

const errors = require('../../info/errors.js');

/**
 * Unify array
 * @param {Array.<PeonBuild.PeonRc.Step>} steps
 * @return {Array.<PeonBuild.Peon.Tools.Step>}
 */
function unifyArray(steps) {
	let i,
		unified = [];

	for (i = 0; i < steps.length; i++) {
		unified.push(unifyStep(steps[i]));
	}

	return unified;
}

/**
 * Unify step
 * @param {PeonBuild.PeonRc.Step} object
 * @return {PeonBuild.Peon.Tools.Step}
 */
function unifyStep(object) {
	let step,
		stage = object.stage,
		name = object.name;

	//create step
	step = /** @type {PeonBuild.Peon.Tools.Step} */toolStep(name, stage);
	step.handler = object.handler;
	//no stage
	if (!step.stage){
		step.error = stepError(
			new Error(errors.STEP_HAS_NO_STAGE),
			/** @type {PeonBuild.PeonRc.Step}*/object
		);
	}
	//no name
	if (!step.name){
		step.error = stepError(
			new Error(errors.STEP_HAS_NO_NAME),
			/** @type {PeonBuild.PeonRc.Step}*/object
		);
	}

	return step;
}

/**
 * Unify
 * @param {Array.<PeonBuild.PeonRc.Step>|*} steps
 * @return {Array.<PeonBuild.Peon.Tools.Step>}
 */
function unify(steps) {
	let step,
		unified = [];

	//1: Array
	if (steps instanceof Array) {
		unified.push(...unifyArray(/** @type {Array.<PeonBuild.PeonRc.Step>}*/steps));

	//2: whatever
	} else {
		step = toolStep("", "");
		step.error = stepError(
			new Error(errors.INVALID_STEPS_DEFINITION),
			steps
		);
		unified.push(step);
	}

	return unified;
}
//export
module.exports = unify;