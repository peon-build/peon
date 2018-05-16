const toolPackage = require('./as.package.tool.js');
const packageError = require('./as.package.error.js');

const normalizeFiles = require('./normalize.peonrc.file.js');

const errors = require('../../info/errors.js');

/**
 * Unify type
 * @param {Array.<PeonBuild.PeonRc.PackageType>|PeonBuild.PeonRc.PackageType} type
 * @eturn {Array.<PeonBuild.PeonRc.PackageType>}
 */
function unifyType(type) {
	//array
	if (type instanceof Array) {
		return type;
	}
	//exists
	if (type) {
		return [type];
	}
	//not set, null, undefined, ""
	return type;
}

/**
 * Unify array
 * @param {Array.<PeonBuild.PeonRc.Package>} entries
 * @return {Array.<PeonBuild.Peon.Tools.Package>}
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
 * @param {PeonBuild.PeonRc.PackageDef} object
 * @return {Array.<PeonBuild.Peon.Tools.Package>}
 */
function unifyObject(object) {
	let pckg,
		type = object.type,
		files = object.files;

	//create package
	pckg = toolPackage(unifyType(type));
	pckg.files = normalizeFiles(files);
	//error state
	if (type === null || files === null) {
		pckg.error = packageError(
			new Error(errors.INVALID_PATTERN_OR_FORMAT),
			/** @type {PeonBuild.PeonRc.Package}*/object
		)
	}

	return [pckg];
}

/**
 * Unify
 * @param {PeonBuild.PeonRc.Package} packages
 * @return {Array.<PeonBuild.Peon.Tools.Package>}
 */
function unify(packages) {
	let pckg,
		unified = [],
		obj = /** @type {PeonBuild.PeonRc.EntryDef}*/packages;

	//1: Array
	if (packages instanceof Array) {
		unified.push(...unifyArray(/** @type {Array.<PeonBuild.PeonRc.PackageDef>}*/packages));

	//2: object
	} else if (obj instanceof Object && obj.type && obj.files) {
		unified.push(...unifyObject(obj));

	//3: error
	} else {
		pckg = toolPackage([]);
		pckg.error = packageError(
			new Error(errors.INVALID_PATTERN_OR_FORMAT),
			/** @type {PeonBuild.PeonRc.Package}*/obj
		);
		unified.push(pckg);
	}

	return unified;
}
//export
module.exports = unify;