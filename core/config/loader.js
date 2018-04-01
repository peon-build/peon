const promise = global.Promise;
const path = require('path');

const tools = /** @type {PeonBuild.Peon.PeonTools}*/require('../tools/tools.js')();
const merger = require('./merger.js');
const validator = require('./validator.js');

const errors = require('../info/errors.js');

/**
 * Loader of config
 * @param {string} name
 * @return {from}
 */
function loader(name) {
	const pattern = "**/" + name;

	/**
	 * Normalize path
	 * @param {string} p
	 * @return {string}
	 */
	function normalizePath(p) {
		return path.normalize(p);
	}

	/**
	 * Config order load
	 * @param {Object} structure
	 * @return {Array.<Array.<string>>}
	 */
	function configOrder(structure) {
		let all = [],
			array = [];

		//has config file?
		if (structure[name]) {
			//add structure name
			array.unshift(structure[name]);
			//add self
			all.unshift(array.slice(0));
		}
		//iterate paths
		Object.keys(structure).forEach(function(key) {
			let directory = structure[key],
				current;

			//go inside
			if (directory && typeof directory !== "string") {
				current = array.slice(0);
				all.push(current);
				//merge paths
				mergePaths(all, current, directory);
			}
		});

		return all;
	}

	/**
	 * Merge paths
	 * @param {Array.<Array.<string>>} all
	 * @param {Array.<string>} array
	 * @param {Object} structure
	 */
	function mergePaths(all, array, structure) {

		//has config file?
		if (structure[name]) {
			array.unshift(structure[name]);
		}

		Object.keys(structure).forEach(function(key) {
			let directory = structure[key],
				current;

			//go inside
			if (directory && typeof directory !== "string") {
				current = array.slice(0);
				all.push(current);
				//merge paths
				mergePaths(all, current, directory);
			}
		});

	}

	/**
	 * Load configs
	 * @param {string} where
	 * @param {Array.<Array.<string>>} array
	 * @return {Promise.<Map<string, PeonBuild.PeonRc.ConfigResult>>}
	 */
	function loadConfigs(where, array) {
		let map = {};

		return new promise(function (fulfill, reject){
			let i,
				all = [];

			//iterate all folders
			for (i = 0; i < array.length; i++) {
				all.push(loadConfig(map, where, array[i]));
			}

			promise.all(all)
				.then(() => {
					fulfill(map);
				})
				.catch(reject);
		});
	}

	/**
	 * Load config
	 * @param {Map<string, PeonBuild.PeonRc.Config>} map
	 * @param {string} where
	 * @param {Array.<Array.<string>>} array
	 * @return {Promise<PeonBuild.PeonRc.ConfigResult>}
	 */
	function loadConfig(map, where, array) {
		return new promise(function (fulfill, reject){
			let configPath,
				mergerPromise,
				validatorPromise;

			//get config file path
			configPath = /** @type {string}*/array[0];
			//merge configs
			mergerPromise = /** @type {Promise}*/merger(where, configPath, collectConfigs(where, array));
			mergerPromise
				.then((configResult) => {
					//config validator
					validatorPromise = /** @type {Promise}*/validator(where, configPath, configResult);
					validatorPromise
						.then(() => {
							//set config
							map[configPath] = /** @type {PeonBuild.PeonRc.ConfigResult}*/configResult;
							//done
							fulfill();
						})
						.catch(reject);
				})
				.catch(reject);
		});
	}

	/**
	 * Collect configs
	 * @param {string} where
	 * @param {Array.<Array.<string>>} array
	 * @return {Array.<PeonBuild.PeonRc.Config>}
	 */
	function collectConfigs(where, array) {
		let i,
			currentPath,
			configs = [];

		//load all configs
		for (i = array.length - 1; i >= 0; i--) {
			//get current path
			currentPath = path.join(where, array[i]);
			//load and add config and path
			configs.push(/** @type {PeonBuild.PeonRc.Config}*/require(currentPath));
		}
		//collected configs
		return configs;
	}

	/**
	 * From
	 * @param {string} where
	 * @param {PeonBuild.PeonRc.FromSettings} settings
	 * @return {Promise.<Map<string, PeonBuild.PeonRc.ConfigResult>>}
	 */
	function from(where, settings) {
		return new promise(function (fulfill, reject){
			let pr = /** @type {Promise}*/tools.files(where, /** @type {PeonBuild.PeonRc.File}*/{
				src: settings.configFile || pattern,
				ignorePattern: settings.ignorePattern
			});

			//fulfill or catch error
			pr.then((toolFiles) => {
				let file = /** @type {PeonBuild.Peon.Tools.Files}*/toolFiles[0],
					structure,
					array;

				//no files, possible error
				if (toolFiles.length === 0) {
					// noinspection JSCheckFunctionSignatures
					reject(new Error(errors["CANNOT_LOAD_CONFIG_FILES"], "CANNOT_LOAD_CONFIG_FILES"));
					return;
				}
				//another file error
				if (file.error) {
					reject(file.error);
					return;
				}

				//normalize path
				structure = tools.asTree(where, file.source.map((p) => normalizePath(p)));
				array = configOrder(structure);
				//load
				loadConfigs(where, array)
					.then(fulfill)
					.catch(reject);
			});
			pr.catch((err) => {
				//error
				reject(err);
			});
		});
	}

	return from;
}
//export
module.exports = loader;