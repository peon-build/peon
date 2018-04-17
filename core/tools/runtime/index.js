const promise = global.Promise;

const norm = require('../normalize/index.js')();

/**
 * Create runtime graph
 * @return {PeonBuild.Peon.Tools.RuntimeGraph}
 */
function createRuntimeGraph() {
	let graph = /** @type {PeonBuild.Peon.Tools.RuntimeGraph}*/{};

	//fill data
	graph.stages = {};
	graph.errors = [];
	graph.sorted = [];

	return graph;
}

/**
 * Create runtime stage
 * @param {string} name
 * @param {PeonBuild.Peon.Tools.Stage} stage
 * @return {PeonBuild.Peon.Tools.RuntimeStage}
 */
function createRuntimeStage(name, stage) {
	let runtimeStage = /** @type {PeonBuild.Peon.Tools.RuntimeStage}*/{};

	//fill data
	runtimeStage.name = name;
	runtimeStage.stage = stage;
	runtimeStage.steps = [];

	return runtimeStage;
}

/**
 * Collect stages
 * @param {Object.<string, PeonBuild.PeonRc.ConfigResult>} configs
 * @param {Map<PeonBuild.Peon.Tools.RuntimeGraph>} map
 */
function collectStages(configs, map) {
	Object.keys(configs).forEach((configPath) => {
		let steps,
			graph = createRuntimeGraph(),
			config = /** @type {PeonBuild.PeonRc.Config}*/configs[configPath].config;

		steps = norm.normalizePeonRcSteps(config.steps || []);
		graph.stages = mapStages(config.stages, steps);
		graph.sorted = sortStages(config.stages);

		map[configPath] = graph;
	});
}

/**
 * Map stages
 * @param {Array.<PeonBuild.PeonRc.Stage>} stages
 * @param {Array.<PeonBuild.Peon.Tools.Step>} steps
 * @return {Object.<string, PeonBuild.Peon.Tools.Stage>}
 */
function mapStages(stages, steps) {
	let stageMap = /** @type {Object.<string, PeonBuild.Peon.Tools.Stage>}*/{},
		stagesDef = /** @type {Array.<PeonBuild.Peon.Tools.Stage>} */norm.normalizePeonRcStages(stages || []);

	stagesDef.forEach((stageDef) => {
		let runtimeStage = createRuntimeStage(stageDef.name, stageDef);

		runtimeStage.steps = collectSteps(stageDef.name, steps);

		stageMap[runtimeStage.name] = runtimeStage;
	});

	return stageMap;
}

/**
 * Sort stages
 * @param {Array.<PeonBuild.PeonRc.Stage>} stages
 * @return {Array.<string>}
 */
function sortStages(stages) {
	let stagesDef = /** @type {Array.<PeonBuild.Peon.Tools.Stage>} */norm.normalizePeonRcStages(stages || []);

	return stagesDef.map((stageDef) => {
		return stageDef.name;
	});
}

/**
 * Collect steps
 * @param {string} stage
 * @param {Array.<PeonBuild.Peon.Tools.Step>} steps
 * @return {Object.<string, PeonBuild.Peon.Tools.Stage>}
 */
function collectSteps(stage, steps) {
	return steps.filter((step) => {
		return step.stage === stage;
	});

}

/**
 * Runtime resolve
 * @param {string} cwd
 * @param {Object.<string, PeonBuild.PeonRc.ConfigResult>} configs
 * @return {Promise<Map<string, PeonBuild.Peon.Tools.RuntimeGraph>>}
 */
function runtime(cwd, configs) {
	//promise
	return new promise(function (fulfill){
		let map = /** @type {Map<string, PeonBuild.Peon.Tools.RuntimeGraph>}*/{};

		//collect stages
		collectStages(configs, map);

		fulfill(map);
	});
}
//export
module.exports = runtime;