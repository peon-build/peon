const funcs = /** @type {PeonBuild.Peon.Tools.IgnoredFuncs} */require('./func')();
const norm = /** @type {PeonBuild.Peon.Tools.Normalize} */require('../normalize/index.js')();

const promise = global.Promise;
const glob = require('glob');
const path = require('path');
const fs = require('fs');

const hgignore = ".hgignore";
const hgignoreGlob = "/**/.hgignore";
const hgfolder = ".hg";

const warnings = {
	"VCS_ROOT_NOT_EXISTS": `There is existing ${hgignore} file but there are no ${hgfolder} folder.`,
	"UNSUPPORTED_SYNTAX": `There is unsupported syntax group. Currently we support only 'glob' syntax type.`
};

/**
 * Is syntax
 * @param {string} line
 * @return {boolean}
 */
function isSyntax(line) {
	return line.toLowerCase().indexOf("syntax:") >= 0;
}

/**
 * Is type
 * @param {string} line
 * @param {string} type
 * @return {boolean}
 */
function isType(line, type) {
	return isSyntax(line) && line.toLowerCase().indexOf(type) > 0;
}

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
 * Load file
 * @param {string} file
 * @return {Promise<Array.<string>>}
 */
function loadFile(file) {
	//promise
	return new promise(function (fulfill, reject){
		fs.readFile(file, (err, data) => {
			//ok
			if (!err) {
				fulfill(funcs.retrieveLines(data));
				return;
			}
			//error
			reject(err);
		});
	});
}

/**
 * Exists vcs
 * @param {string} file
 * @return {Promise<fs.Stats>}
 */
function existsVcs(file) {
	let directory = path.join(path.dirname(file), hgfolder);

	//promise
	return new promise(function (fulfill){
		fs.stat(directory, (err, stats) => {
			fulfill(!err && stats ? stats : null);
		});
	});
}

/**
 * Load settings
 * @param {PeonBuild.Peon.Tools.IgnoreSettings=} settings
 * @return {PeonBuild.Peon.Tools.IgnoreSettings}
 */
function loadSettings(settings) {
	let s = settings || {},
		opt = /** @type {PeonBuild.Peon.Tools.IgnoreSettings}*/{};

	opt.deep = s.deep === undefined ? true : s.deep;

	return opt;
}

/**
 * Process lines
 * @param {PeonBuild.Peon.Tools.Ignore} ignoredFile
 * @param {Array.<string>} lines
 */
function processLines(ignoredFile, lines) {
	let filtered = [],
		unsupported = [],
		supported = true;

	//filter unwanted
	lines = funcs.normalizeLines(lines);

	//iterate all lines
	lines.forEach((line) => {
		let syntaxLine = isSyntax(line);

		//get syntax line
		if (syntaxLine) {
			//check if is glob
			supported = isType(line, "glob");
			//add to unsupported
			if (!supported && unsupported.indexOf(line) === -1) {
				unsupported.push(line);
			}
			return;
		}

		//normal line
		if (supported) {
			filtered.push(line);
		}
	});

	//unsupported syntax
	if (unsupported.length) {
		// noinspection JSCheckFunctionSignatures
		ignoredFile.warning = new Error(warnings.UNSUPPORTED_SYNTAX);
	}

	//create ignores files
	return funcs.normalizePatterns(filtered);
}

/**
 * Load ignore
 * @param {string} file
 * @param {Array.<PeonBuild.Peon.Tools.Ignore>} ignored
 * @return {Promise}
 */
function loadIgnored(file, ignored) {
	//promise
	return new promise(function (fulfill, reject) {
		existsVcs(file)
			.then((stats) => {
				//load files
				loadFile(file)
					.then((lines) => {
						let ignoredFile = ignoredFileDef(file);

						//process lines
						processLines(ignoredFile, lines);
						//vcs not exists
						if (!stats || !stats.isDirectory()) {
							// noinspection JSCheckFunctionSignatures
							ignoredFile.warning = new Error(warnings.VCS_ROOT_NOT_EXISTS);
						}
						//add ignore file def
						ignored.push(ignoredFile);
						//done
						fulfill();
					})
					.catch((err) => {
						reject(err);
					});
			});
	});
}

/**
 * Ignore file def
 * @param {string} file
 * @return {PeonBuild.Peon.Tools.Ignore}
 */
function ignoredFileDef(file) {
	let obj = /** @type {PeonBuild.Peon.Tools.Ignore}*/{};

	obj.file = file;
	obj.ignored = [];
	obj.type = hgfolder;
	obj.info = [];

	return obj;
}

/**
 * @param {string} where
 * @param {PeonBuild.Peon.Tools.IgnoreSettings=} settings
 * @return {Promise<Array.<PeonBuild.Peon.Tools.Ignore>>}
 */
function ignored(where, settings) {
	let ignored = [];
	let opt = loadSettings(settings);

	//normalize for patterns
	where = /** @type {string} */norm.asGlob(where);
	//promise
	return new promise(function (fulfill, reject){
		loadFiles(where, opt.deep ? hgignoreGlob : hgignore)
			.then((files) => {
				let all = [];

				files.forEach((file) => {
					all.push(loadIgnored(file, ignored));
				});

				promise.all(all)
					.then(() => {
						fulfill(ignored);
					})
					.catch((err) => {
						reject(err);
					});
			})
			.catch((err) => {
				reject(err);
			});
	});
}
//export
module.exports = ignored;