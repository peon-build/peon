const promise = global.Promise;
const glob = require('glob');
const path = require('path');

const tree = require('../tools/files.tree');
const merger = require('./merger');

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
			array.unshift(structure[name]);
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
	 * @return {Promise.<Map<string, PeonBuild.PeonRc.Config>>}
	 */
	function loadConfigs(where, array) {
		let map = {};

		return new Promise(function (fulfill, reject){
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
	 * @return {Promise}
	 */
	function loadConfig(map, where, array) {
		return new Promise(function (fulfill){
			let i,
				config,
				configPath,
				currentPath,
				configs = [];

			//load all configs
			for (i = array.length - 1; i >= 0; i--) {
				//get current path
				currentPath = path.join(where, array[i]);
				//load and add config and path
				configs.push(/** @type {PeonBuild.PeonRc.Config}*/require(currentPath));
			}
			//get config file path
			configPath = /** @type {string}*/array[0];
			//merge configs
			config = merger(/** @type {string}*/array[0], configs);
			//set config
			map[configPath] = config;
			//done
			fulfill();
		});
	}

	/**
	 * From
	 * @param {string} where
	 * @return {Promise.<Map<string, PeonBuild.PeonRc.Config>>}
	 */
	function from(where) {
		return new Promise(function (fulfill, reject){
			glob(path.join(where, pattern), function (err, files) {
				let structure,
					array;

				//no error
				if (!err) {
					//normalize path
					structure = tree(where, files.map((p) => normalizePath(p)));
					array = configOrder(structure);
					//load
					loadConfigs(where, array)
						.then(fulfill)
						.catch(reject);
					return;
				}
				//error
				reject(err);
			});
		});
	}

	return from;
}
//export
module.exports = loader;