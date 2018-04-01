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
	"VCS_ROOT_NOT_EXISTS": `There is existing ${hgignore} file but there are no ${hgfolder} folder.`
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
 * @return {Promise<boolean>}
 */
function existsVcs(file) {
	let directory = path.join(path.dirname(file), hgfolder);

	//promise
	return new promise(function (fulfill){
		fs.stat(directory, (err, stats) => {
			fulfill(!err && stats && stats.isDirectory());
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
 * @param {Array.<string>} lines
 */
function processLines(lines) {
	//filter unwanted
	lines = funcs.normalizeLines(lines);

	//TODO: HG has 'syntax: glob' and 'syntax: regexp' - implement this and try to load globs, convert regex on globs?

	//create ignores files
	return funcs.normalizePatterns(lines);
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
			.then((exists) => {
				//load files
				loadFile(file)
					.then((lines) => {
						let ignoredFile = ignoredFileDef(file, processLines(lines));

						//vcs not exists
						if (!exists) {
							// noinspection JSCheckFunctionSignatures
							ignoredFile.warning = new Error(warnings["VCS_ROOT_NOT_EXISTS"], "VCS_ROOT_NOT_EXISTS");
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
 * @param {Array.<string>} files
 * @return {PeonBuild.Peon.Tools.Ignore}
 */
function ignoredFileDef(file, files) {
	let obj = /** @type {PeonBuild.Peon.Tools.Ignore}*/{};

	obj.file = file;
	obj.ignored = files;
	obj.type = hgfolder;

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