const inquirer = require('inquirer');

const log = /** @type {PeonBuild.Log}*/require('../log');
const core = /** @type {PeonBuild.Peon}*/require('../index')();
const loadFromSettings = require('./utils/setting.from.js');

const bannerConfigResult = require('./banners/banner.config.result.js');
const bannerConfigInfo = require('./banners/banner.config.info.js');

const cancel = "Cancel";

/**
 * Prompt raw list
 * @param {string} name
 * @param {string} message
 * @param {Array.<string>} choices
 * @return {*}
 */
function promptRawList(name, message, choices) {
	return {
		type: 'rawlist',
		name: name,
		message: message,
		choices: choices,
		pageSize: 100
	};
}

/**
 * Config details
 * @param {string} cwd
 * @param {Object.<string, PeonBuild.PeonRc.ConfigResult>} configMap
 */
function configDetails(cwd, configMap) {
	let keys = Object.keys(configMap);

	//no config files found
	if (keys.length === 0) {
		//no files
		log.warning(`There are no configuration files in folder '$1'.`, [
			log.p.path(cwd)
		]);
		log.tip(`Do you have valid folder?`);
		log.tip(`Or you can try use '$1' for create new one.`, [
			log.p.underline("peon init")
		]);
		return;
	}

	//check if only one, load it
	if (keys.length === 1) {
		//view current config
		configView(configMap, {
			config: keys[0]
		});
		return;
	}

	//prompt
	inquirer
		.prompt([
			promptRawList("config", `What config file do you want too see.`,
				keys.concat([new inquirer.Separator(), cancel])
			)
		])
		.then((answers) => {
			//exit
			if (answers.config === cancel) {
				log.space();
				log.log(`Cancel is select. Leaving config info and exiting.`);
				return;
			}
			//view config
			configView(configMap, answers);
		});
}

/**
 * Config view
 * @param {Object.<string, PeonBuild.PeonRc.ConfigResult>} configMap
 * @param {Object} answers
 */
function configView(configMap, answers) {
	let result = configMap[answers.config];

	//stringify
	core.config.stringify(result.config)
		.then((lines) => {
			//config info
			bannerConfigInfo(answers.config);
			//config content
			bannerConfigContent(lines);
			//config result
			bannerConfigResult(answers.config, result);
		})
		.catch((err) => {
			//log error
			log.space();
			log.error(`An [ERROR] occurred when trying to show config file. Message from error is '${err.message}'.`);
			log.stacktrace(err);
		});
}

/**
 * Config get
 * @param {string} cwd
 * @param {PeonBuild.PeonRc.FromSettings} fromSettings
 */
function configGet(cwd, fromSettings) {
	//load data from current working dir
	core.config.all(cwd, fromSettings)
		.then((configMap) => {
			//load results
			log.timestamp(`Loading all config files`, `Loading is done.`);
			log.quote(true, `Found $1 files.`, [
				log.p.number(Object.keys(configMap).length.toString())
			]);
			log.space();
			//show config options
			configDetails(cwd, configMap);

		})
		.catch((err) => {
			//log error
			log.error(`An [ERROR] occurred when loading configuration files. Message from error is '${err.message}'.`);
			log.stacktrace(err);
		});
}

//#: Banners

/**
 * Banner
 * @param {string} cwd
 * @param {PeonBuild.PeonSetting} setting
 */
function banner(cwd, setting) {
	//set logger level
	log.level(setting.logLevel);
	//info
	log.title(`Config information`);
	log.timestamp(`Loading all config files`, `Loading from directory $1.`, [
		log.p.path(cwd)
	]);

	log.setting("current working directory", "$1", [
		log.p.path(cwd)
	]);
	//report options
	if (setting.configFile) {
		log.setting("configFile", "Loading $1 configuration file if exists.", [
			log.p.path(setting.configFile)
		]);
	}
}

/**
 * Banner config info
 * @param {Array.<string>} lines
 */
function bannerConfigContent(lines) {
	let i;

	log.quote(true, `Configuration file content below:`);
	log.space();
	//log whole config
	for (i = 0; i < lines.length; i++) {
		log.code(lines[i]);
	}
	log.space();
}

//#: Command

/**
 * Command start
 * @param {string} cwd
 * @param {PeonBuild.PeonSetting} setting
 */
function commandConfig(cwd, setting) {
	let fromSettingsPromise;

	//banner
	banner(cwd, setting);
	//load settings
	fromSettingsPromise = /** @type {Promise<PeonBuild.PeonRc.FromSettings>}*/loadFromSettings(cwd, setting);
	fromSettingsPromise
		.then((fromSettings) => {
			//config get
			configGet(cwd, fromSettings);
		})
		.catch((err) => {
			//log error
			log.error(`An [ERROR] occurred when creating settings for load configuration file. Message from error is '${err.message}'.`);
			log.stacktrace(err);
		});
}
//export
module.exports = commandConfig;