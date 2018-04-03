const promise = global.Promise;

const log = /** @type {PeonBuild.Log}*/require('../log');
const core = /** @type {PeonBuild.Peon}*/require('../index')();
const loadFromSettings = require('./utils/setting.from.js');

const path = require("path");

/**
 * Get config
 * @param {PeonBuild.PeonSetting} setting
 * @return {string}
 */
function getConfig(setting) {
	//module is set
	if (setting.module) {
		return path.join(setting.module, core.config.name)
	}
	//root config
	return core.config.name;
}

//#: Banners

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

			//TODO: Build
			//core.config.one(cwd, config, fromSettings);


		})
		.catch((err) => {
			//log error
			log.error(`An [ERROR] occurred when creating settings for load configuration file. Message from error is '${err.message}'.`);
			log.stacktrace(err);
		});

}
//export
module.exports = commandBuild;