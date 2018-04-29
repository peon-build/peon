const promise = global.Promise;

const log = /** @type {PeonBuild.Log}*/require('../log');
const core = /** @type {PeonBuild.Peon}*/require('../index')();
const loadFromSettings = require('./utils/setting.from.js');

const bannerConfigResult = require('./banners/banner.config.result.js');
const bannerConfigInfo = require('./banners/banner.config.info.js');
const bannerPrepareResults = require('./banners/banner.prepare.results.js');
const bannerQueueList = require('./banners/banner.queue.list.js');

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
 * Run
 * @param {PeonBuild.PeonSetting} setting
 * @param {string} cwd
 * @param {Object.<string, PeonBuild.PeonRc.ConfigResult>} configResults
 */
function run(setting, cwd, configResults) {
	let configs = loadConfigsAndValidate(configResults);

	//prepare
	runPrepare(setting, cwd, configs);
}

/**
 * Run prepare
 * @param {PeonBuild.PeonSetting} setting
 * @param {string} cwd
 * @param {Map.<string, PeonBuild.PeonRc.ConfigResult>} configs
 */
function runPrepare(setting, cwd, configs) {
	let preparePromise;

	//banner
	bannerPrepare();
	//start
	preparePromise = core.prepare(cwd, configs);
	preparePromise
		.then((prepareResults) => {
			//results
			bannerPrepareResults(configs, prepareResults);
			//done
			bannerPrepareDone();
			//run queue
			runQueue(setting, cwd, prepareResults);
		})
		.catch((err) => {
			//log error
			log.error(`An [ERROR] occurred when running run command in peon. Message from error is '${err.message}'.`);
			log.stacktrace(err);
		});
}

/**
 * Run queue
 * @param {PeonBuild.PeonSetting} setting
 * @param {string} cwd
 * @param {PeonBuild.PeonRc.Results.Prepare} prepareResults
 */
function runQueue(setting, cwd, prepareResults) {
	let runPromise;

	//banner
	bannerQueue();
	//start
	runPromise = core.run.queue(cwd, prepareResults, setting.stages);
	runPromise
		.then((queue) => {
			//banner queue info
			bannerQueueList(queue);
			//done
			bannerQueueDone();
			//run build
			runBuild(setting, cwd, prepareResults, queue);
		})
		.catch((err) => {
			//log error
			log.error(`An [ERROR] occurred when running $1 command in peon. Message from error is '${err.message}'.`, [
				log.p.underline("run.queue")
			]);
			log.stacktrace(err);
		});
}

/**
 * Run build
 * @param {PeonBuild.PeonSetting} setting
 * @param {string} cwd
 * @param {PeonBuild.PeonRc.Results.Prepare} prepareResults
 * @param {Array.<PeonBuild.PeonRc.Results.QueueItem>} queue
 */
function runBuild(setting, cwd, prepareResults, queue) {
	let p = promise.resolve();

	/**
	 * Error from module build
	 * @param {Error} err
	 */
	function error(err) {
		//log error
		log.error(`An [ERROR] occurred when running $1 command in peon. Message from error is '${err.message}'.`, [
			log.p.underline("run.module")
		]);
		log.stacktrace(err);
	}

	//create all
	queue.forEach((queueItem) => {
		p = p.then(() => runBuildModule(setting, cwd, prepareResults, queueItem)).catch(error);
	});
	//after done
	p.then(() => {
		//TODO: Continue
		bannerDone();
	});
}

/**
 * Run build for module
 * @param {PeonBuild.PeonSetting} setting
 * @param {string} cwd
 * @param {PeonBuild.PeonRc.Results.Prepare} prepareResults
 * @param {PeonBuild.PeonRc.Results.QueueItem} queueItem
 * @return {Promise}
 */
function runBuildModule(setting, cwd, prepareResults, queueItem) {
	let stages = queueItem.stages,
		p = promise.resolve();

	//promise
	return new promise(function (fulfill, reject){
		//create all
		stages.forEach((stage) => {
			p = p.then(() => {
				//TODO: Report previous
				return core.run.module(cwd, queueItem, stage.name)
			}).catch(reject);
		});
		//end
		p.then(() => {
			//TODO: Report previous
			fulfill();
		});
	});
}

//Load config files

/**
 * Load configs and validate
 * @param {Object.<string, PeonBuild.PeonRc.ConfigResult>} configResults
 * @return {Map.<string, PeonBuild.PeonRc.ConfigResult>}
 */
function loadConfigsAndValidate(configResults) {
	let configs = {};

	//as array
	Object.keys(configResults).forEach(function(key) {
		let configResult = configResults[key];

		//add valid config into list
		if (configResult.errors.length === 0) {
			configs[key] = configResult;
		}
		//banner configs
		bannerConfigInfo(key);
		bannerConfigResult(key, configResult);
	});

	return configs;
}

/**
 * Load configuration file
 * @param {string} cwd
 * @param {string} config
 * @param {PeonBuild.PeonSetting} setting
 * @param {PeonBuild.PeonRc.FromSettings} fromSettings
 */
function loadConfigFile(cwd, config, setting, fromSettings) {
	//load config
	core.config.one(cwd, config, fromSettings)
		.then((configResults) => {
			//run start
			run(setting, cwd, configResults);
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
 * @param {PeonBuild.PeonSetting} setting
 * @param {PeonBuild.PeonRc.FromSettings} fromSettings
 */
function loadConfigFiles(cwd, setting, fromSettings) {
	//load config
	core.config.all(cwd, fromSettings)
		.then((configResults) => {
			//run start
			run(setting, cwd, configResults);
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
 * @param {string|null} config
 */
function banner(cwd, setting, config) {
	//set logger level
	log.level(setting.logLevel);
	//info
	log.title(`Run information`);

	//check config
	if (config) {
		log.timestamp(`Run runtime`, `Running runtime for $1 module with configuration file $2 in $3.`, [
			log.p.underline(setting.module),
			log.p.path(config),
			log.p.path(cwd)
		]);
	} else {
		log.timestamp(`Run runtime`, `Running runtime for all modules in $1.`, [
			log.p.path(cwd)
		]);
	}

	log.setting("current working directory", "$1", [
		log.p.path(cwd)
	]);
	//report options
	if (setting.module) {
		log.setting("module", "$1", [
			log.p.underline(setting.module)
		]);
	}
	if (setting.stages) {
		log.setting("stages", "$1", [
			log.p.underline(setting.stages)
		]);
	}
}

/**
 * Banner done
 */
function bannerDone() {
	//time report
	log.timestamp(`Run runtime`, `Running runtime is done.`);
}

/**
 * Banner prepare
 */
function bannerPrepare() {
	//info
	log.space();
	log.title(`Run information: Faze $1 ...`, [
		log.p.underline('prepare')
	]);
	log.timestamp(`Faze prepare`, `Collecting dependencies, runtime.`);
}

/**
 * Banner prepare done
 */
function bannerPrepareDone() {
	//time report
	log.timestamp(`Faze prepare`, `Prepare is done.`);
}

/**
 * Banner queue
 */
function bannerQueue() {
	//info
	log.space();
	log.title(`Run information: Faze $1 ...`, [
		log.p.underline('queue collect')
	]);
	log.timestamp(`Faze queue collect`, `Building queue of stages for modules.`);
}

/**
 * Banner queue done
 */
function bannerQueueDone() {
	//time report
	log.timestamp(`Faze queue collect`, `Building queue is done.`);
}

//#: Command

/**
 * Command run
 * @param {string} cwd
 * @param {PeonBuild.PeonSetting} setting
 */
function commandRun(cwd, setting) {
	let fromSettingsPromise,
		config = getConfig(setting);

	//banner
	banner(cwd, setting, config);
	//load settings
	fromSettingsPromise = /** @type {Promise<PeonBuild.PeonRc.FromSettings>}*/loadFromSettings(cwd, setting);
	fromSettingsPromise
		.then((fromSettings) => {
			//process all modules and files
			if (!config) {
				//process all
				loadConfigFiles(cwd, setting, fromSettings);
				return;
			}
			//process only specific file
			loadConfigFile(cwd, config, setting, fromSettings);
		})
		.catch((err) => {
			//log error
			log.error(`An [ERROR] occurred when creating settings for load configuration file. Message from error is '${err.message}'.`);
			log.stacktrace(err);
		});

}
//export
module.exports = commandRun;