const promise = global.Promise;
const glob = require('glob');
const path = require('path');
const minimatch = require('minimatch');

const norm = /** @type {PeonBuild.Peon.Tools.Normalize} */require('./normalize/index.js')();

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
				file.error = norm.asFileError(err, /** @type {PeonBuild.PeonRc.File}*/{src: source, dest: destination});
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
 * @param {string} where
 * @param {PeonBuild.PeonRc.File} items
 * @return {Promise<Array.<PeonBuild.Peon.Tools.Files>>}
 */
function files(where, items) {
	let collected = [],
		files = norm.normalizePeonRcFile(items);

	//promise
	return new promise(function (fulfill){
		normalize(where, files, collected).then(() => {
			fulfill(collected);
		});
	});
}
//export
module.exports = files;