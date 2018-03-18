const inquirer = require('inquirer');

const log = /** @type {PeonBuild.Log}*/require('../log');
const core = /** @type {PeonBuild.Peon}*/require('../core')();

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
		choices: choices
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
 * Command start
 * @param {string} cwd
 * @param {PeonBuild.PeonSetting} setting
 */
function commandConfig(cwd, setting) {

	//set logger level
	log.level(setting.logLevel);
	//info
	log.title(`Config information`);
	log.timestamp(`Loading all config files`, `Loading from directory $1.`, [
		log.p.path(cwd)
	]);

	//load data from current working dir
	core.config.from(cwd)
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
//export
module.exports = commandConfig;