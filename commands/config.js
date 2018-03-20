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
 * @param {Object.<string, PeonBuild.PeonRc.Config>} configMap
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
			configView(cwd, configMap, answers);
		});
}

/**
 * Config view
 * @param {string} cwd
 * @param {Object.<string, PeonBuild.PeonRc.Config>} configMap
 * @param {Object} answers
 */
function configView(cwd, configMap, answers) {
	//stringify
	core.config.stringify(configMap[answers.config])
		.then((lines) => {
			let i;

			log.space();
			log.title(`Configuration file '$1'.`, [
				log.p.path(answers.config)
			]);
			log.setting("current working directory", "$1", [
				log.p.path(cwd)
			]);
			log.space();
			//log whole config
			for (i = 0; i < lines.length; i++) {
				log.code(lines[i]);
			}
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
	core.config.from(cwd, fromSettings)
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
 * @return {Promise<PeonBuild.PeonRc.FromSettings>}
 */
function loadFromSettings(where) {
	let wait = [],
		settings = /** @type {PeonBuild.PeonRc.FromSettings}*/{};

	//promise
	return new promise(function (fulfill, reject){
		//add
		wait.push(loadIgnorePattern(where, settings));
		//wait for all
		promise.all(wait)
			.then(() => {
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
		core.ignored(where, {
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
 * Command start
 * @param {string} cwd
 * @param {PeonBuild.PeonSetting} setting
 */
function commandConfig(cwd, setting) {
	//banner
	banner(cwd, setting);
	//load settings
	loadFromSettings(cwd)
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