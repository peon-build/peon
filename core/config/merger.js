const promise = global.Promise;
const path = require('path');

const packageJson = require('./processors/package.json.js');

const errors = require('../info/errors.js');
const tips =  require('../info/tips.js');

/**
 * For files
 * @param {Object.<string, PeonBuild.PeonRc.ExternalFile>} files
 * @param {function(string: name, PeonBuild.PeonRc.ExternalFile)} handler
 */
function forFiles(files, handler) {
	let i,
		paths = Object.keys(files);

	for (i = 0; i < paths.length; i++) {
		handler(paths[i], files[paths[i]]);
	}
}

/**
 * Create config error
 * @param {Error} err
 * @param {Array.<*>=} args
 * @param {Array.<string>=} tips
 * @return {PeonBuild.PeonRc.ConfigError}
 */
function createConfigError(err, args, tips) {
	let configError = /** @type {PeonBuild.PeonRc.ConfigError}*/ {};

	configError.error = err;
	configError.tips = tips || [];
	configError.args = args || [];

	return configError
}

/**
 * Evaluate name
 * @param {string} configPath
 * @param {PeonBuild.PeonRc.ConfigResult} configResult
 * @param {Object.<string, PeonBuild.PeonRc.ExternalFile>} files
 * @return {string}
 */
function evName(configPath, configResult, files) {
	let name,
		names = [];

	//name
	name = path.basename(path.dirname(configPath));
	//iterate all names
	forFiles(files, (name, externalFile) => {
		if (externalFile.name) {
			names.push(externalFile.name);
		}
	});
	//filter uniques :)
	names = [...new Set(names)];

	//info about more names
	if (names.length > 1) {
		//add message
		configResult.messages.push(createConfigError(
			new Error(errors["MULTIPLE_NAMES_POSSIBLE_FOUND"], "MULTIPLE_NAMES_POSSIBLE_FOUND"), [names],
			tips["MULTIPLE_NAMES_POSSIBLE_FOUND"]
		));
	}
	//add from folder name
	if (names.length === 0) {
		//add name
		names.push(name);
	}
	//use first name
	return names[0];
}

/**
 * Fill data
 * @param {PeonBuild.PeonRc.ExternalFile} externalFile
 * @param {PeonBuild.PeonRc.ConfigResult} configResult
 */
function fillData(externalFile, configResult) {
	let err = externalFile.error;

	//no error
	if (!err) {
		return;
	}
	//fill data
	switch(err.code || err.errno) {
	case "ENOENT":
		//add message
		configResult.messages.push(createConfigError(
			new Error(errors["SOURCE_FILE_NOT_EXISTS"], "SOURCE_FILE_NOT_EXISTS"), [externalFile.file]
		));
		break;
	default:
		//add error
		configResult.errors.push(createConfigError(err));
		break;
	}

}

/**
 * Merge config
 * @param {string} configPath
 * @param {Object.<string, PeonBuild.PeonRc.ExternalFile>} files
 * @param {PeonBuild.PeonRc.ConfigResult} configResult
 * @param {PeonBuild.PeonRc.Config} currentConfig
 * @param {boolean} last
 */
function mergeConfig(configPath, files, configResult, currentConfig, last) {
	let config = configResult.config;

	//do only for last config
	if (last) {
		//set name
		config.name = currentConfig.name || evName(configPath, configResult, files);
	}
	//for each config
	config.output = currentConfig.output || config.output;
	config.vendors = currentConfig.vendors || config.vendors;
	config.src = currentConfig.src || config.src;
	config.tests = currentConfig.tests || config.tests;
	config.steps = currentConfig.steps || config.steps;
	config.stages = currentConfig.stages || config.stages;
	config.entry = currentConfig.entry || config.entry;
}

/**
 * Merge configs
 * @param {Object.<string, PeonBuild.PeonRc.ExternalFile>} files
 * @param {string} configPath
 * @param {Array.<PeonBuild.PeonRc.Config>} configs
 * @return {Promise<PeonBuild.PeonRc.ConfigResult>}
 */
function mergeConfigs(files, configPath, configs) {
	return new promise(function (fulfill){
		let i,
			configResult;

		//init merged config
		configResult = /** @type {PeonBuild.PeonRc.ConfigResult}*/{
			config: /** @type {PeonBuild.PeonRc.Config}*/{},
			sources: [],
			error: [],
			warnings: [],
			messages: []
		};
		//iterate all configs
		for (i = 0; i < configs.length; i++) {
			//merge configs
			mergeConfig(configPath, files, configResult, configs[i], i === configs.length - 1);
		}
		//fill data from files
		forFiles(files, (name, externalFile) => {
			//add processor name
			configResult.sources.push(name);
			fillData(externalFile, configResult);
		});
		//return result config
		fulfill(configResult);
	});
}

/**
 * Merger
 * @param {string} where
 * @param {string} configPath
 * @param {Array.<PeonBuild.PeonRc.Config>} configs
 * @return {Promise<PeonBuild.PeonRc.ConfigResult>}
 */
function merger(where, configPath, configs) {
	return new promise(function (fulfill, reject){
		let processors = [],
			files = /** @type {Object.<string, PeonBuild.PeonRc.ExternalFile>}*/{};

		//add processors
		processors.push(packageJson(path.join(where, configPath), files));
		//promise all processors
		promise.all(processors)
			.then(() => {
				//merge configs
				mergeConfigs(files, configPath, configs)
					.then(fulfill)
					.catch(reject);
			})
			.catch(reject);
	});
}

//export
module.exports = merger;