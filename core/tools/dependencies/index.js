const promise = global.Promise;
const semver = require("semver");

const errors = require('../../info/errors.js');
const tips = require('../../info/tips.js');

const versionsAll = "*";

/**
 * Create dependency info
 * @param {string} name
 * @return {PeonBuild.Peon.Tools.DependencyInfo}
 */
function createDependencyInfo(name) {
	let info = /** @type {PeonBuild.Peon.Tools.DependencyInfo}*/{};

	info.name = name;
	info.versions = [];
	info.externals = [];
	info.internals = [];

	return info;
}

/**
 * Create dependency error
 * @param {Error} error
 * @param {Array.<string>} args
 * @param {Array.<string>=} tips
 */
function createDependencyError(error, args, tips) {
	let depError = /** @type {PeonBuild.Peon.Tools.DependencyError}*/{};

	depError.error = error;
	depError.args = args;
	depError.tips = tips || [];

	return depError;
}


//Collect data

/**
 * Collect local modules
 * @param {Object.<string, PeonBuild.PeonRc.ConfigResult>} configs
 * @param {PeonBuild.Peon.Tools.DependenciesGraph} graph
 */
function collectLocalModules(configs, graph) {
	Object.keys(configs).forEach((configPath) => {
		let info,
			config = /** @type {PeonBuild.PeonRc.Config}*/configs[configPath].config;

		//dependency info
		info = graph.modules[config.name] || createDependencyInfo(config.name);
		//version
		info.versions.push(config.version);
		info.versions = [...new Set(info.versions)];
		//config
		info.config = config;
		info.configPath = configPath;
		//save
		graph.modules[config.name] = info;
	});
}

/**
 * Collect external modules
 * @param {Object.<string, PeonBuild.PeonRc.ConfigResult>} configs
 * @param {PeonBuild.Peon.Tools.DependenciesGraph} graph
 */
function collectExternalModules(configs, graph) {
	Object.keys(configs).forEach((configPath) => {
		let info,
			config = /** @type {PeonBuild.PeonRc.Config}*/configs[configPath].config;

		config.dependencies.forEach((dependency) => {
			//dependency info
			info = graph.modules[dependency.module] || createDependencyInfo(dependency.module);
			//version
			info.versions.push(dependency.version);
			info.versions = [...new Set(info.versions)];
			//save
			graph.modules[dependency.module] = info;
		});
	});
}

/**
 * Collect dependencies
 * @param {Object.<string, PeonBuild.PeonRc.ConfigResult>} configs
 * @param {PeonBuild.Peon.Tools.DependenciesGraph} graph
 */
function collectDependencies(configs, graph) {
	Object.keys(configs).forEach((configPath) => {
		let dependencyInfo,
			currentDependencyInfo,
			config = /** @type {PeonBuild.PeonRc.Config}*/configs[configPath].config;

		currentDependencyInfo = /** @type {PeonBuild.Peon.Tools.DependencyInfo}*/graph.modules[config.name];

		config.dependencies.forEach((dependency) => {
			//load info
			dependencyInfo = /** @type {PeonBuild.Peon.Tools.DependencyInfo}*/graph.modules[dependency.module];

			//add into external or internal
			if (dependencyInfo.config) {
				currentDependencyInfo.internals.push(dependencyInfo);
			} else {
				currentDependencyInfo.externals.push(dependencyInfo);
			}
		});
	});
}

//calculate list

/**
 * Calculate dependencies
 * @param {PeonBuild.Peon.Tools.DependenciesGraph} graph
 */
function calculateDependenciesList(graph) {
	let maximum,
		internals = [],
		sorted = [];

	//collect internal only
	Object.keys(graph.modules).forEach((module) => {
		let dependency = graph.modules[module];

		if (dependency.config) {
			internals.push(dependency);
		}
	});
	//set max
	maximum = internals.length + 1;
	//iterate and check all build
	while (internals.length) {
		//get ready to build
		internals = retrieveReadyToBuild(internals, sorted);
		//dec
		maximum--;
		//break, there must be circular references between modules
		if (maximum === 0) {
			break;
		}
	}

	//errors!
	internals.forEach((module) => {
		graph.errors.push(createDependencyError(
			new Error(errors.POSSIBLE_CIRCULAR_REFERENCE), [module.name]
		));
	});

	//set
	graph.sorted = sorted;
}

/**
 * Calculate versions
 * @param {PeonBuild.Peon.Tools.DependenciesGraph} graph
 */
function calculateVersions(graph) {
	//collect internal only
	Object.keys(graph.modules).forEach((module) => {
		let versions,
			intersects = [],
			nonintersects = [],
			dependency = graph.modules[module];

		//filter unwanted
		versions = dependency.versions.filter((item) => {
			return item !== versionsAll; //all
		});

		//check intersects for all versions
		versions.forEach((version) => {
			let valid = versions.every((ver) => {
				return semver.intersects(version, ver);
			});

			//check if its intersect or not
			if (valid) {
				intersects.push(version);
			} else {
				nonintersects.push(version);
			}
		});

		//set versions
		dependency.versions = intersects;

		//error incompatible versions
		if (nonintersects.length) {
			//add error
			graph.errors.push(createDependencyError(
				new Error(errors.MULTIPLE_VERSIONS_FOUND),
				[nonintersects, module],
				tips.MULTIPLE_VERSIONS_FOUND
			));
		}
		//no version determined
		if (intersects.length === 0) {
			//add error
			graph.errors.push(createDependencyError(
				new Error(errors.NO_VERSION_CALCULATED),
				[module],
				tips.NO_VERSION_CALCULATED
			));
		}

	});

}

/**
 * Retrieve ready to build
 * @param {Array.<PeonBuild.Peon.Tools.DependencyInfo>} modules
 * @param {Array.<string>} sorted
 * @return {Array.<PeonBuild.Peon.Tools.DependencyInfo>}
 */
function retrieveReadyToBuild(modules, sorted) {
	let rest = [];

	modules.forEach((module) => {
		let allBuild = module.internals.every((internal) => {
			return sorted.indexOf(internal.name) >= 0;
		});

		if (allBuild) {
			sorted.push(module.name);
		} else {
			rest.push(module);
		}
	});

	return rest;
}

/**
 * Dependencies resolve
 * @param {string} cwd
 * @param {Object.<string, PeonBuild.PeonRc.ConfigResult>} configs
 * @return {Promise<PeonBuild.Peon.Tools.DependenciesGraph>}
 */
function dependencies(cwd, configs) {
	//promise
	return new promise(function (fulfill){
		let graph = /** @type {PeonBuild.Peon.Tools.DependenciesGraph}*/{};

		//fill data
		graph.modules = {};
		graph.errors = [];
		graph.sorted = [];

		//collect local modules
		collectLocalModules(configs, graph);
		//collect external modules
		collectExternalModules(configs, graph);

		//collect dependencies from config file
		collectDependencies(configs, graph);

		//calculate dependencies list
		calculateDependenciesList(graph);
		//calculate versions
		calculateVersions(graph);

		fulfill(graph);
	});
}
//export
module.exports = dependencies;