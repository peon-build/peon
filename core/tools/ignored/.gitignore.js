const funcs = /** @type {PeonBuild.Peon.Tools.IgnoredFuncs} */require('./func')();
const norm = /** @type {PeonBuild.Peon.Tools.Normalize} */require('../normalize/index.js')();

const promise = global.Promise;
const glob = require('glob');
const path = require('path');
const fs = require('fs');

const gitignore = ".gitignore";
const gitignoreGlob = "/**/.gitignore";
const gitfolder = ".git";

const warnings = {
	"VCS_ROOT_NOT_EXISTS": `There is existing ${gitignore} file but there are no ${gitfolder} folder.`
};
const info = {
	"VCS_ROOT_AS_MODULE": `There is ${gitfolder} file. Your git project is loaded as submodule.`
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
 * @return {Promise<fs.Stats>}
 */
function existsVcs(file) {
	let directory = path.join(path.dirname(file), gitfolder);

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
 * @param {Array.<string>} lines
 */
function processLines(lines) {
	//filter unwanted
	lines = funcs.normalizeLines(lines);
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
			.then((stats) => {
				//load files
				loadFile(file)
					.then((lines) => {
						let ignoredFile = ignoredFileDef(file, processLines(lines));

						//vcs not exists, event file even dir
						if (!stats) {
							ignoredFile.warning = new Error(warnings.VCS_ROOT_NOT_EXISTS);
						}
						//vcs as module
						if (stats && stats.isFile()) {
							ignoredFile.info.push(new Error(info.VCS_ROOT_AS_MODULE));
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
	obj.type = gitfolder;
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
		loadFiles(where, opt.deep ? gitignoreGlob : gitignore)
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