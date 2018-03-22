const promise = global.Promise;
const glob = require('glob');
const path = require('path');
const minimatch = require('minimatch');

const errors = {
	"INVALID_PATTERN_OR_FORMAT": `Invalid file format or pattern. You use pattern that is not compatible with blob or minimatch format.`
};

/**
 * Load files
 * @param {string} where
 * @param {string} pattern
 * @return {Promise}
 */
function loadFiles(where, pattern){
	return new Promise(function (fulfill, reject){
		glob(path.join(where, pattern), function (err, files) {
			//files provided
			if (!err) {
				fulfill(files);
				return;
			}
			//error
			reject(err);
		});
	});
}

/**
 * Filter ignored files
 * @param {Array.<string>} files
 * @param {Array.<string>} ignorePattern
 * @return {Array.<string>}
 */
function filterIgnore(files, ignorePattern) {
	let i,
		filter;

	//no ignores set
	if (ignorePattern.length === 0) {
		return files;
	}

	//filter all ignored files
	for (i = 0; i < ignorePattern.length; i++) {
		filter = ignorePatternFilter.bind(files, ignorePattern[i]);
		files = files.filter(filter);
	}

	return files;
}

/**
 * Ignore pattern filter
 * @param {string} pattern
 * @param {string} file
 * @return {boolean}
 */
function ignorePatternFilter(pattern, file) {
	return !minimatch(file, pattern, {dot: true});
}

/**
 * Normalize path
 * @param {string} p
 * @return {string}
 */
function normalizePath(p) {
	return path.normalize(p);
}

/**
 * Normalize
 * @param {string} where
 * @param {Array.<PeonBuild.Peon.Tools.Files>} files
 * @param {Array.<PeonBuild.Peon.Tools.Files>} collected
 * @return {Promise<Array.<PeonBuild.Peon.Tools.Files>>}
 */
function normalize(where, files, collected) {
	let waits = [],
		file,
		i;

	for (i = 0; i < files.length; i++) {
		file = files[i];

		//error file, do nothing
		if (file.error) {
			collected.push(file);

		//valid file for load
		} else {

			waits.push(normalizeFile(where, file, collected))

		}
	}



	//return promises
	return promise.all(waits);
}

/**
 * Normalize file
 * @param {string} where
 * @param {PeonBuild.Peon.Tools.Files} file
 * @param {Array.<PeonBuild.Peon.Tools.Files>} collected
 * @return {Promise<Array.<PeonBuild.Peon.Tools.Files>>}
 */
function normalizeFile(where, file, collected) {
	//promise
	return new promise(function (fulfill){
		let i,
			waits = [],
			source = [],
			destination = [];

		//sources
		for (i = 0; i < file.source.length; i++) {
			waits.push(normalizePattern(where, file.source[i], source));
		}
		//sources
		for (i = 0; i < file.destination.length; i++) {
			waits.push(normalizePattern(where, file.destination[i], destination));
		}

		promise.all(waits)
			//ok
			.then(() => {
				file.source = filterIgnore(source, file.ignorePattern).map((p) => normalizePath(p));
				file.destination = destination.map((p) => normalizePath(p));
				//add
				collected.push(file);
				//ok
				fulfill();
			})
			//error
			.catch((err) => {
				let {source, destination} = file;

				//set error
				file.error = filesError(err, /** @type {PeonBuild.PeonRc.File}*/{src: source, dest: destination});
				//add
				collected.push(file);
				//ok
				fulfill();
			});
	});
}

/**
 * Normalize pattern
 * @param {string} where
 * @param {string} pattern
 * @param {Array.<string>} collected
 * @return {Promise}
 */
function normalizePattern(where, pattern, collected) {
	//promise
	return new promise(function (fulfill, reject){
		loadFiles(where, pattern)
			//ok
			.then((files) => {
				collected.push(...files);
				fulfill();
			})
			//catch
			.catch((err) => {
				reject(err);
			})
	});
}

/**
 * Tool files
 * @param {Array.<string>} dest
 * @param {Array.<string>} src
 * @return {PeonBuild.Peon.Tools.Files}
 */
function toolFiles(dest, src) {
	let files = /** @type {PeonBuild.Peon.Tools.Files}*/{};

	//fill data
	files.ignorePattern = [];
	files.destination = dest;
	files.source = src;
	files.error = null;

	return files;
}

/**
 * Files error
 * @param {Error} rawError
 * @param {PeonBuild.PeonRc.File} original
 * @return {PeonBuild.Peon.Tools.FilesError}
 */
function filesError(rawError, original) {
	let error = /** @type {PeonBuild.Peon.Tools.FilesError}*/{};

	//fill data
	error.error = rawError;
	error.original = original;

	return error;
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
		files = toolFiles([], []);
		files.error = filesError(
			new Error(errors.INVALID_PATTERN_OR_FORMAT, "INVALID_PATTERN_OR_FORMAT"),
			/** @type {PeonBuild.PeonRc.File}*/object
		);
		unified.push(files);
	}

	return unified;
}

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
	files = toolFiles(dest || [], src || []);

	//set ignore
	files.ignorePattern = ignorePattern;
	//error state
	if (src === null || dest === null) {
		files.error = filesError(
			new Error(errors.INVALID_PATTERN_OR_FORMAT, "INVALID_PATTERN_OR_FORMAT"),
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
	return [toolFiles([], [path])];
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
 * @param {string} where
 * @param {PeonBuild.PeonRc.File} items
 * @return {Promise<Array.<PeonBuild.Peon.Tools.Files>>}
 */
function files(where, items) {
	let collected = [],
		files = unify(items);

	//promise
	return new promise(function (fulfill){
		normalize(where, files, collected).then(() => {
			fulfill(collected);
		});
	});
}
//export
module.exports = files;