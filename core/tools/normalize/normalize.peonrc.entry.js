const toolEntry = require('./as.entry.tool.js');
const entryError = require('./as.entry.error.js');

const errors = require('../../info/errors.js');

/**
 * Unify array
 * @param {Array.<PeonBuild.PeonRc.Entry>} entries
 * @return {Array.<PeonBuild.Peon.Tools.Entry>}
 */
function unifyArray(entries) {
	let i,
		unified = [];

	for (i = 0; i < entries.length; i++) {
		unified.push(...unify(entries[i]));
	}

	return unified;
}

/**
 * Unify object
 * @param {PeonBuild.PeonRc.EntryDef} object
 * @return {Array.<PeonBuild.Peon.Tools.Entry>}
 */
function unifyObject(object) {
	let entry,
		file = object.file;

	//create entry
	entry = toolEntry(file);
	//error state
	if (file === null) {
		entry.error = entryError(
			new Error(errors.INVALID_PATTERN_OR_FORMAT),
			/** @type {PeonBuild.PeonRc.Entry}*/object
		)
	}

	return [entry];
}

/**
 * Unify object
 * @param {string} path
 * @return {Array.<PeonBuild.Peon.Tools.Files>}
 */
function unifyString(path) {
	return [toolEntry(path)];
}

/**
 * Unify
 * @param {PeonBuild.PeonRc.Entry} entries
 * @return {Array.<PeonBuild.Peon.Tools.Entry>}
 */
function unify(entries) {
	let entry,
		unified = [],
		obj = /** @type {PeonBuild.PeonRc.EntryDef}*/entries;

	//1: Array
	if (entries instanceof Array) {
		unified.push(...unifyArray(/** @type {Array.<PeonBuild.PeonRc.EntryDef>}*/entries));

	//2: object
	} else if (obj instanceof Object && obj.file) {
		unified.push(...unifyObject(obj));

	//3: string
	} else if (typeof entries === "string") {
		unified.push(...unifyString(/** @type {string}*/entries));

	//4: error
	} else {
		entry = toolEntry("");
		entry.error = entryError(
			new Error(errors.INVALID_PATTERN_OR_FORMAT),
			/** @type {PeonBuild.PeonRc.Entry}*/obj
		);
		unified.push(entry);
	}

	return unified;
}
//export
module.exports = unify;