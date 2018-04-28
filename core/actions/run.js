const promise = global.Promise;

const enums = require('../config/enum.js');

/**
 * Process dependencies
 * @param {string} cwd
 * @param {PeonBuild.PeonRc.Results.Prepare} prepare
 * @param {Array.<string>=} stages
 * @return {Promise<Array.<PeonBuild.PeonRc.Results.QueueItem>>}
 */
function processDependencies(cwd, prepare, stages) {
	let i,
		p = promise.resolve(),
		dependencies = prepare.dependencies,
		modules = dependencies.sorted.slice(0),
		queue = /** @type {Array.<PeonBuild.PeonRc.Results.QueueItem>}*/[];

	//promise
	return new promise(function (fulfill, reject){
		//create all
		for (i = 0; i < modules.length; i++) {
			p = p.then(() => processDependency(cwd, queue, prepare, stages, modules)).catch(reject);
		}
		//end
		p.then(() => {
			fulfill(queue);
		});
	});
}

/**
 * Process dependency
 * @param {string} cwd
 * @param {Array.<PeonBuild.PeonRc.Results.QueueItem>} queue
 * @param {PeonBuild.PeonRc.Results.Prepare} prepare
 * @param {Array.<string>=} stages
 * @param {Array.<string>} modules
 * @return {Promise}
 */
function processDependency(cwd, queue, prepare, stages, modules) {
	//promise
	return new promise(function (fulfill){
		let module = modules.shift(),
			dependencyInfo;

		//get dependency info
		dependencyInfo = /** @type {PeonBuild.Peon.Tools.DependencyInfo}*/prepare.dependencies.modules[module];
		//config exists
		if (dependencyInfo.config) {
			processStages(queue, prepare, dependencyInfo, stages);
		}
		//done
		fulfill();
	});
}

/**
 * Process stages
 * @param {Array.<PeonBuild.PeonRc.Results.QueueItem>} queue
 * @param {PeonBuild.PeonRc.Results.Prepare} prepare
 * @param {PeonBuild.Peon.Tools.DependencyInfo} dependencyInfo
 * @param {Array.<string>=} stages
 */
function processStages(queue, prepare, dependencyInfo, stages) {
	let queueItem,
		runtime = /** @type {PeonBuild.Peon.Tools.RuntimeGraph}*/prepare.runtime[dependencyInfo.configPath];

	//create queue item
	queueItem = createQueueItem(dependencyInfo.configPath, dependencyInfo);
	queue.push(queueItem);
	//no stages defined, run all
	if (stages && stages.length > 0) {
		stagesAddDefined(runtime, queueItem, stages);
		return;
	}
	//add all
	stagesAddAutomatics(runtime, queueItem);
}

/**
 * Stages add automatics
 * @param {PeonBuild.Peon.Tools.RuntimeGraph} runtime
 * @param {PeonBuild.PeonRc.Results.QueueItem} queueItem
 */
function stagesAddAutomatics(runtime, queueItem) {
	let stage;

	//load all stages
	runtime.sorted.forEach((stageName) => {
		//load stage
		stage = /** @type {PeonBuild.Peon.Tools.RuntimeStage}*/runtime.stages[stageName];
		//add only automatic stages
		switch (stage.stage.when) {
		case enums.WhenType.automatic:
			queueItem.stages.push(stage);
			break;
		default:
			break;
		}

	});
}

/**
 * Stages add defined
 * @param {PeonBuild.Peon.Tools.RuntimeGraph} runtime
 * @param {PeonBuild.PeonRc.Results.QueueItem} queueItem
 * @param {Array.<string>=} stages
 */
function stagesAddDefined(runtime, queueItem, stages) {
	let i,
		stage,
		index = -1;

	//find maximum index
	stages.forEach((stage) => {
		index = Math.max(runtime.sorted.indexOf(stage), index);
	});

	//iterate all stages
	for (i = 0; i <= index; i++) {
		//load stage
		stage = /** @type {PeonBuild.Peon.Tools.RuntimeStage}*/runtime.stages[runtime.sorted[i]];
		//add automatics and all defined manual
		switch (stage.stage.when) {
		case enums.WhenType.automatic:
			queueItem.stages.push(stage);
			break;
		case enums.WhenType.manual:
			//manual stage is defined, add it
			if (stages.indexOf(stage.name) >= 0) {
				queueItem.stages.push(stage);
			}
			break;
		default:
			break;
		}

	}
}

/**
 * Create queue item
 * @param {string} configPath
 * @param {PeonBuild.Peon.Tools.DependencyInfo} dependency
 * @return {PeonBuild.PeonRc.Results.QueueItem}
 */
function createQueueItem(configPath, dependency) {
	return /** @type {PeonBuild.PeonRc.Results.QueueItem}*/{
		configPath: configPath,
		dependency: dependency,
		stages: []
	};
}

/**
 * Run queue peon rc
 * @param {string} cwd
 * @param {PeonBuild.PeonRc.Results.Prepare} prepare
 * @param {Array.<string>=} stages
 * @return {Promise<Array.<PeonBuild.PeonRc.Results.QueueItem>>}
 */
function queuePeonRc(cwd, prepare, stages) {
	//promise
	return new promise(function (fulfill, reject){

		//process dependencies
		processDependencies(cwd, prepare, stages)
			.then(fulfill)
			.catch(reject);
	});
}

/**
 * Run module peon rc
 * @param {string} cwd
 * @param {Array.<PeonBuild.PeonRc.Results.QueueItem>} queue
 * @param {string} stage
 * @return {Promise<?>} //todo
 */
function modulePeonRc(cwd, queue, stage) {
	//promise
	return new promise(function (fulfill, reject){
		//TODO: Module process + promise return
	});
}

/**
 * Run peon rc
 * @return {{queue: function, queue: function}}
 */
function runPeonRc() {
	//return
	return {
		queue: queuePeonRc,
		module: modulePeonRc
	};
}

//export
module.exports = runPeonRc();