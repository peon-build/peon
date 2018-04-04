const promise = global.Promise;

const core = /** @type {PeonBuild.Peon}*/require('../../index')();
const bannerIgnorePattern = require('../banners/banner.ignore.pattern.js');

const defaultsIgnores = [
	"**/node_modules/**"
];


/**
 * Load from setting
 * @param {string} where
 * @param {PeonBuild.PeonSetting} setting
 * @return {Promise<PeonBuild.PeonRc.FromSettings>}
 */
function loadFromSettings(where, setting) {
	let wait = [],
		settings = /** @type {PeonBuild.PeonRc.FromSettings}*/{};

	//promise
	return new promise(function (fulfill, reject){
		//add
		wait.push(loadIgnorePattern(where, settings));
		//wait for all
		promise.all(wait)
			.then(() => {
				//add props
				settings.configFile = setting.configFile;
				//send
				fulfill(settings);
			})
			.catch((err) => {
				reject(err);
			});
	});
}

/**
 * Load ignore patterns
 * @param {string} where
 * @param {PeonBuild.PeonRc.FromSettings} settings
 * @return {Promise}
 */
function loadIgnorePattern(where, settings) {
	//promise
	return new promise(function (fulfill, reject){
		core.tools.ignores(where, {
			deep: true
		})
			.then((fls) => {
				//ignore pattern
				settings.ignorePattern = flattenIgnoreFiles(fls);
				//fulfill
				fulfill();
			})
			.catch((err) => {
				reject(err);
			});
	});
}

/**
 * Flatten ignore files
 * @param {Array.<PeonBuild.Peon.Tools.Ignore>} files
 * @return {Array.<string>}
 */
function flattenIgnoreFiles(files) {
	let array = [];

	//ignore
	files.forEach((file) => {
		//add to array
		array.push(...file.ignored);
	});
	//no files, use defaults
	if (files.length === 0) {
		array.push(...defaultsIgnores);
	}
	//banner ignore pattern
	bannerIgnorePattern(files, array);
	//array
	return array;
}

//export
module.exports = loadFromSettings;