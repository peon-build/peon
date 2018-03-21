const promise = global.Promise;
const path = require('path');

/**
 * Merge config
 * @param {string} configPath
 * @param {PeonBuild.PeonRc.Config} config
 * @param {PeonBuild.PeonRc.Config} currentConfig
 * @param {boolean} last
 */
function mergeConfig(configPath, config, currentConfig, last) {
	let name;

	//do only for last config
	if (last) {
		//name
		name = path.basename(path.dirname(configPath));
		//set name
		config.name = currentConfig.name || name;
	}
	//for each config
	config.output = currentConfig.output || config.output;
	config.vendors = currentConfig.vendors || config.vendors;
	config.src = currentConfig.src || config.src;
	config.tests = currentConfig.tests || config.tests;
	config.steps = currentConfig.steps || config.steps;
	config.stages = currentConfig.stages || config.stages;
}

/**
 * Merger
 * @param {string} where
 * @param {string} configPath
 * @param {Array.<PeonBuild.PeonRc.Config>} configs
 * @return {Promise<PeonBuild.PeonRc.Config>}
 */
function merger(where, configPath, configs) {
	return new promise(function (fulfill){
		let i,
			config;

		//init merged config
		config = /** @type {PeonBuild.PeonRc.Config}*/{};
		//iterate all configs
		for (i = 0; i < configs.length; i++) {
			//merge configs
			mergeConfig(configPath, config, configs[i], i === configs.length - 1);
		}
		//return result config
		fulfill(config);
	});
}

//export
module.exports = merger;