const promise = global.Promise;

const log = /** @type {PeonBuild.Log}*/require('../log');
const core = /** @type {PeonBuild.Peon}*/require('../index')();
const loadFromSettings = require('./utils/setting.from.js');

const bannerConfigResult = require('./banners/banner.config.result.js');
const bannerConfigInfo = require('./banners/banner.config.info.js');

const path = require("path");

/**
 * Get config
 * @param {PeonBuild.PeonSetting} setting
 * @return {string|null}
 */
function getConfig(setting) {
	//module is set
	if (setting.module) {
		return path.join(setting.module, core.config.name)
	}
	//root config
	return null;
}

/**
 * Load configs and validate
 * @param {Object.<string, PeonBuild.PeonRc.ConfigResult>} configResults
 * @return {Array.<PeonBuild.PeonRc.ConfigResult>}
 */
function loadConfigsAndValidate(configResults) {
	let configs = [];

	//as array
	Object.keys(configResults).forEach(function(key) {
		configs.push(configResults[key]);
		bannerConfigInfo(key);
		bannerConfigResult(key, configResults[key]);
	});

	return configs;
}

/**
 * Load configuration file
 * @param {string} cwd
 * @param {string} config
 * @param {PeonBuild.PeonRc.FromSettings} fromSettings
 */
function loadConfigFile(cwd, config, fromSettings) {
	//load config
	core.config.one(cwd, config, fromSettings)
		.then((configResults) => {
			let configs = loadConfigsAndValidate(configResults);

			//TODO: Build
		})
		.catch((err) => {
			//log error
			log.error(`An [ERROR] occurred when loading configuration file. Message from error is '${err.message}'.`);
			log.stacktrace(err);
		});
}

/**
 * Load configuration files
 * @param {string} cwd
 * @param {PeonBuild.PeonRc.FromSettings} fromSettings
 */
function loadConfigFiles(cwd, fromSettings) {
	//load config
	core.config.all(cwd, fromSettings)
		.then((configResults) => {
			let configs = loadConfigsAndValidate(configResults);

			//TODO: Build
		})
		.catch((err) => {
			//log error
			log.error(`An [ERROR] occurred when loading configuration files. Message from error is '${err.message}'.`);
			log.stacktrace(err);
		});
}

//#: Banners

//#: Command

/**
 * Command build
 * @param {string} cwd
 * @param {PeonBuild.PeonSetting} setting
 */
function commandBuild(cwd, setting) {
	let fromSettingsPromise,
		config = getConfig(setting);

	//load settings
	fromSettingsPromise = /** @type {Promise<PeonBuild.PeonRc.FromSettings>}*/loadFromSettings(cwd, setting);
	fromSettingsPromise
		.then((fromSettings) => {
			//process all modules and files
			if (!config) {
				//process all
				loadConfigFiles(cwd, fromSettings);
				return;
			}
			//process only specific file
			loadConfigFile(cwd, config, fromSettings);
		})
		.catch((err) => {
			//log error
			log.error(`An [ERROR] occurred when creating settings for load configuration file. Message from error is '${err.message}'.`);
			log.stacktrace(err);
		});

}
//export
module.exports = commandBuild;