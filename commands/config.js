const promise = global.Promise;
const inquirer = require('inquirer');

const log = /** @type {PeonBuild.Log}*/require('../log');
const core = /** @type {PeonBuild.Peon}*/require('../core')();

const cancel = "Cancel";
const defaultsIgnores = [
	"**/node_modules/**"
];

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
			bannerConfigResult(result);
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
 * Banner options
 * @param {Array.<PeonBuild.Peon.Tools.Ignore>} files
 * @param {Array.<string>} ignorePattern
 */
function bannerIgnorePattern(files, ignorePattern) {
	//report options
	log.setting("ignorePattern", "Using this ignore pattern with $1 patterns.", [
		log.p.number(ignorePattern.length.toString())
	]);

	//report
	files.forEach((file) => {
		//log filename
		log.filename(`Loading patterns from $1 where found $2 patterns.`, [
			log.p.path(file.file),
			log.p.number(file.ignored.length.toString())
		]);

		//warning
		if (file.warning) {
			log.warning(`There is [WARNING] from $1 file: '${file.warning.message}'.`, [
				log.p.path(file.file)
			]);
		}
		//err
		if (file.error) {
			//log error
			log.error(`An [ERROR] occurred when in .ignore file. Message from error is '${file.error.message}'.`);
			log.stacktrace(file.error);
		}
	});
}

/**
 * Banner config info
 * @param {string} config
 */
function bannerConfigInfo(config) {
	log.space();
	log.title(`Configuration file '$1'.`, [
		log.p.path(config)
	]);
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

/**
 * Banner config result
 * @param {PeonBuild.PeonRc.ConfigResult} result
 */
function bannerConfigResult(result) {

	//warnings
	if (result.messages && result.messages.length) {
		log.debug("Same debug info from config file:");
		result.messages.forEach((err, i) => {
			log.debug(` ${i + 1}. ${err.error.message}`, err.args.map((arg) => {
				return log.p.underline(arg)
			}));
			bannerTips(err.tips);
		});
		log.setting("sources", `$1`, [
			log.p.path(result.sources)
		]);
	}
	//warnings
	if (result.warnings && result.warnings.length) {
		log.warning("There are some [WARNINGS] for configuration file:");
		result.errors.forEach((err) => {
			log.error(`There is [WARNING] from configuration file. Message from warning is '${err.error.message}'.`, err.args.map((arg) => {
				return log.p.underline(arg)
			}));
			bannerTips(err.tips);
		});
		log.setting("sources", `$1`, [
			log.p.path(result.sources)
		]);
	}
	//errors
	if (result.errors && result.errors.length) {
		log.error("There are some [ERRORS] for configuration file:");
		result.errors.forEach((err) => {
			log.error(`An [ERROR] occurred in config file. Message from error is '${err.error.message}'.`, err.args.map((arg) => {
				return log.p.underline(arg)
			}));
			log.stacktrace(err);
			bannerTips(err.tips);
		});
		log.setting("sources", `$1`, [
			log.p.path(result.sources)
		]);
	}
}

/**
 * Banner tips
 * @param {Array.<string>} tips
 */
function bannerTips(tips) {
	tips.forEach((tip) => {
		log.tip(tip);
	});
}

/**
 * Command start
 * @param {string} cwd
 * @param {PeonBuild.PeonSetting} setting
 */
function commandConfig(cwd, setting) {
	//banner
	banner(cwd, setting);
	//load settings
	loadFromSettings(cwd, setting)
		.then((fromSettings) => {
			//config get
			configGet(cwd, fromSettings);
		})
		.catch((err) => {
			//log error
			log.error(`An [ERROR] occurred when loading ignored files. Message from error is '${err.message}'.`);
			log.stacktrace(err);
		});
}
//export
module.exports = commandConfig;