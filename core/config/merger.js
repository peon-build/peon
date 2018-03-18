const path = require('path');

/**
 * Merger
 * @param {string} configPath
 * @param {Array.<PeonBuild.PeonRc.Config>} configs
 */
function merger(configPath, configs) {
	let i,
		name,
		isLast,
		config,
		currentConfig;

	//init merged config
	config = /** @type {PeonBuild.PeonRc.Config}*/{};
	//name
	name = path.basename(path.dirname(configPath));

	for (i = 0; i < configs.length; i++) {
		currentConfig = configs[i];
		isLast = i === configs.length - 1;

		//do only for last config
		if (isLast) {
			config.name = currentConfig.name || name;
		}

		config.output = currentConfig.output || config.output;
		config.vendors = currentConfig.vendors || config.vendors;
		config.src = currentConfig.src || config.src;
		config.tests = currentConfig.tests || config.tests;
		config.steps = currentConfig.steps || config.steps;
		config.stages = currentConfig.stages || config.stages;
	}

	//return result config
	return config;
}

//export
module.exports = merger;