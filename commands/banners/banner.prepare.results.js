const log = /** @type {PeonBuild.Log}*/require('../../log');

const bannerTips = require('./banner.tips');

/**
 * Banner prepared dependencies
 * @param {Map.<string, PeonBuild.PeonRc.ConfigResult>} configs
 * @param {PeonBuild.Peon.Tools.DependenciesGraph} dependencies
 */
function bannerPreparedDependencies(configs, dependencies) {
	//modules order
	log.log(`Modules build order based on dependencies is $1.`, [
		log.p.underline(dependencies.sorted)
	]);
	//report errors
	dependencies.errors.forEach((error) => {
		//log error
		log.error(`An [ERROR] occurred when preparing dependencies. Message from error is '${error.error.message}'.`, error.args.map((arg) => {
			return log.p.underline(arg)
		}));
		log.stacktrace(error.error);
		//tips
		bannerTips(error.tips);
	});
}

/**
 * Banner prepared dependencies
 * @param {Map.<string, PeonBuild.PeonRc.ConfigResult>} configs
 * @param {PeonBuild.Peon.Tools.DependenciesGraph} dependencies
 * @param {Object.<string, PeonBuild.Peon.Tools.RuntimeGraph>} runtime
 */
function bannerPreparedRuntime(configs, dependencies, runtime) {
	dependencies.sorted.forEach((moduleName, index) => {
		let dependency = /** @type {PeonBuild.Peon.Tools.DependencyInfo}*/dependencies.modules[moduleName],
			graph = /** @type {PeonBuild.Peon.Tools.RuntimeGraph}*/runtime[dependency.configPath],
			config = dependency.config;

		//modules order
		log.log(` $1. Stages in module $2 ($3) are run in this order: $4.`, [
			log.p.number(index + 1),
			log.p.underline(config.name),
			log.p.path(dependency.configPath),
			log.p.underline(graph.sorted)
		]);
		//report errors
		graph.errors.forEach((error) => {
			//log error
			log.error(`An [ERROR] occurred when preparing runtime. Message from error is '${error.error.message}'.`, error.args.map((arg) => {
				return log.p.underline(arg)
			}));
			log.stacktrace(error.error);
			//tips
			bannerTips(error.tips);
		});
	});
}

/**
 * Banner prepare results
 * @param {Map.<string, PeonBuild.PeonRc.ConfigResult>} configs
 * @param {PeonBuild.PeonRc.Results.Prepare} prepareResults
 */
function bannerPrepareResults(configs, prepareResults) {
	//dependencies
	bannerPreparedDependencies(configs, prepareResults.dependencies);
	//runtime
	bannerPreparedRuntime(configs, prepareResults.dependencies, prepareResults.runtime);
}

//export
module.exports = bannerPrepareResults;