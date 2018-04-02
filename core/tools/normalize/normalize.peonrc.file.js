const toolFile = require('./as.file.tool.js');
const fileError = require('./as.file.error.js');

const errors = require('../../info/errors.js');

/**
 * Unify array
 * @param {Array.<PeonBuild.PeonRc.File>} items
 * @return {Array.<PeonBuild.Peon.Tools.Files>}
 */
function unifyArray(items) {
	let i,
		unified = [];

	for (i = 0; i < items.length; i++) {
		unified.push(...unify(items[i]));
	}

	return unified;
}

/**
 * Unify object
 * @param {PeonBuild.PeonRc.FileDef} object
 * @return {Array.<PeonBuild.Peon.Tools.Files>}
 */
function unifyObject(object) {
	let files,
		src = unifyProperty(object.src),
		dest = unifyProperty(object.dest),
		ignorePattern = unifyProperty(object.ignorePattern);

	//create files
	files = toolFile(dest || [], src || []);

	//set ignore
	files.ignorePattern = ignorePattern;
	//error state
	if (src === null || dest === null) {
		files.error = fileError(
			new Error(errors.INVALID_PATTERN_OR_FORMAT),
			/** @type {PeonBuild.PeonRc.File}*/object
		)
	}

	return [files];
}

/**
 * Unify object
 * @param {string} path
 * @return {Array.<PeonBuild.Peon.Tools.Files>}
 */
function unifyString(path) {
	return [toolFile([], [path])];
}

/**
 * Unify object
 * @param {Array|string} prop
 * @return {Array.<string>|null}
 */
function unifyProperty(prop) {
	//0: not defined
	if (prop === undefined) {
		return [];
	}
	//1: array
	if (prop instanceof Array) {
		return prop;

	//2: object
	} else if (typeof prop === "string") {
		return [prop];
	}

	//error state
	return null;
}

/**
 * Unify
 * @param {PeonBuild.PeonRc.File} items
 * @return {Array.<PeonBuild.Peon.Tools.Files>}
 */
function unify(items) {
	let files,
		unified = [],
		obj = /** @type {PeonBuild.PeonRc.FileDef}*/items;

	//1: Array
	if (items instanceof Array) {
		unified.push(...unifyArray(/** @type {Array.<PeonBuild.PeonRc.File>}*/items));

		//2: object
	} else if (obj instanceof Object && (obj.src || obj.dest)) {
		unified.push(...unifyObject(obj));

		//3: string
	} else if (typeof items === "string") {
		unified.push(...unifyString(/** @type {string}*/items));

		//4: error
	} else {
		files = toolFile([], []);
		files.error = fileError(
			new Error(errors.INVALID_PATTERN_OR_FORMAT),
			/** @type {PeonBuild.PeonRc.File}*/obj
		);
		unified.push(files);
	}

	return unified;
}
//export
module.exports = unify;