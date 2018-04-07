const promise = global.Promise;
const norm = require('../tools/normalize/index.js')();
const errors = require('../info/errors.js');
const tips = require('../info/tips.js');
const stringify = require('./stringify.js');

const enums = require('./enum.js');

/**
 * Normalize file
 * @param {PeonBuild.PeonRc.File} file
 * @return {Array<PeonBuild.Peon.Tools.Files>}
 */
function normalizeFile(file) {
	return  /** @type {Array.<PeonBuild.Peon.Tools.Files>}*/norm.normalizePeonRcFile(file);
}

/**
 * Normalize entry
 * @param {PeonBuild.PeonRc.Entry} entry
 * @return {Array<PeonBuild.Peon.Tools.Entry>}
 */
function normalizeEntry(entry) {
	return  /** @type {Array.<PeonBuild.Peon.Tools.Entry>}*/norm.normalizePeonRcEntry(entry);
}

/**
 * Normalize steps
 * @param {Array<PeonBuild.PeonRc.Step>} steps
 * @return {Array<PeonBuild.Peon.Tools.Step>}
 */
function normalizeSteps(steps) {
	return  /** @type {Array.<PeonBuild.Peon.Tools.Step>}*/norm.normalizePeonRcSteps(steps);
}

/**
 * Normalize stages
 * @param {Array<PeonBuild.PeonRc.Stage>} stages
 * @return {Array<PeonBuild.Peon.Tools.Stage>}
 */
function normalizeStages(stages) {
	return  /** @type {Array.<PeonBuild.Peon.Tools.Stage>}*/norm.normalizePeonRcStages(stages);
}

/**
 * Create config error
 * @param {Error} err
 * @param {Array.<*>=} args
 * @param {Array.<string>=} tips
 * @return {PeonBuild.PeonRc.ConfigError}
 */
function createConfigError(err, args, tips) {
	let configError = /** @type {PeonBuild.PeonRc.ConfigError}*/ {};

	configError.error = err;
	configError.tips = tips || [];
	configError.args = args || [];

	return configError
}

/**
 * Add file error
 * @param {PeonBuild.PeonRc.ConfigResult} configResult
 * @param {PeonBuild.Peon.Tools.Files} file
 * @param {string} prop
 * @return {Promise}
 */
function addFileError(configResult, file, prop) {
	return new promise(function (fulfill, reject) {
		let stringifyPromise,
			error = /** @type {PeonBuild.Peon.Tools.FilesError}*/file.error;

		//add file error
		if (error) {
			stringifyPromise = /** @type {Promise}*/stringify(error.original);
			stringifyPromise
				.then((lines) => {
					addConfigError(configResult, error.error, prop, lines);
					fulfill();
				})
				.catch(reject);
			return;
		}
		//ok
		fulfill();
	});
}

/**
 * Add entry error
 * @param {PeonBuild.PeonRc.ConfigResult} configResult
 * @param {PeonBuild.Peon.Tools.Entry} entry
 * @param {string} prop
 * @return {Promise}
 */
function addEntryError(configResult, entry, prop) {
	return new promise(function (fulfill, reject) {
		let stringifyPromise,
			error = /** @type {PeonBuild.Peon.Tools.EntryError}*/entry.error;

		//add entry error
		if (error) {
			stringifyPromise = /** @type {Promise}*/stringify(error.original);
			stringifyPromise
				.then((lines) => {
					addConfigError(configResult, error.error, prop, lines);
					fulfill();
				})
				.catch(reject);
			return;
		}
		//ok
		fulfill();
	});
}

/**
 * Add step error
 * @param {PeonBuild.PeonRc.ConfigResult} configResult
 * @param {PeonBuild.Peon.Tools.Step} step
 * @param {string} prop
 * @return {Promise}
 */
function addStepError(configResult, step, prop) {
	return new promise(function (fulfill, reject) {
		let stringifyPromise,
			error = /** @type {PeonBuild.Peon.Tools.StepError}*/step.error;

		//add entry error
		if (error) {
			stringifyPromise = /** @type {Promise}*/stringify(error.original);
			stringifyPromise
				.then((lines) => {
					addConfigError(configResult, error.error, prop, lines);
					fulfill();
				})
				.catch(reject);
			return;
		}
		//add step if is valid
		configResult.steps.push(step);
		//ok
		fulfill();
	});
}

/**
 * Add stage error
 * @param {PeonBuild.PeonRc.ConfigResult} configResult
 * @param {PeonBuild.Peon.Tools.Stage} stage
 * @param {string} prop
 * @return {Promise}
 */
function addStageError(configResult, stage, prop) {
	return new promise(function (fulfill, reject) {
		let stringifyPromise,
			error = /** @type {PeonBuild.Peon.Tools.StageError}*/stage.error;

		//add entry error
		if (error) {
			stringifyPromise = /** @type {Promise}*/stringify(error.original);
			stringifyPromise
				.then((lines) => {
					addConfigError(configResult, error.error, prop, lines);
					fulfill();
				})
				.catch(reject);
			return;
		}
		//add step if is valid
		configResult.stages.push(stage);
		//ok
		fulfill();
	});
}

/**
 * Add config error
 * @param {PeonBuild.PeonRc.ConfigResult} configResult
 * @param {Error} error
 * @param {string} prop
 * @param {Array.<string>} lines
 */
function addConfigError(configResult, error, prop, lines) {
	//push error
	configResult.errors.push(createConfigError(
		error,
		[],
		[
			`Pattern that is invalid in '${prop}': ${lines.join(" ")}`
		]
	));
}

/**
 * Validate vendors
 * @param {PeonBuild.PeonRc.ConfigResult} configResult
 * @return {Promise}
 */
function validateVendors(configResult) {
	return new promise(function (fulfill, reject) {
		let config = configResult.config,
			errorsList = [];

		if (!config.vendors) {
			fulfill();
			return;
		}

		let files = normalizeFile(config.vendors);

		files.forEach((file) => {
			errorsList.push(addFileError(configResult, file, "vendors"));
		});

		promise.all(errorsList)
			.then(fulfill)
			.catch(reject);
	});
}

/**
 * Validate src
 * @param {PeonBuild.PeonRc.ConfigResult} configResult
 * @return {Promise}
 */
function validateSrc(configResult) {
	return new promise(function (fulfill, reject) {
		let config = configResult.config,
			errorsList = [];

		if (!config.src) {
			fulfill();
			return;
		}

		if (!config.src.files) {
			configResult.errors.push(createConfigError(
				new Error(errors.SOURCE_EXISTS_BUT_NO_FILES_PROVIDED)
			));
			fulfill();
			return;
		}

		let files = normalizeFile(config.src.files);

		files.forEach((file) => {
			errorsList.push(addFileError(configResult, file, "src"));
		});

		promise.all(errorsList)
			.then(fulfill)
			.catch(reject);
	});
}

/**
 * Validate package
 * @param {PeonBuild.PeonRc.ConfigResult} configResult
 * @return {Promise}
 */
function validatePackage(configResult) {
	return new promise(function (fulfill, reject) {
		let config = configResult.config,
			errorsList = [];

		if (!config.package) {
			fulfill();
			return;
		}

		let files = normalizeFile(config.package);

		files.forEach((file) => {
			errorsList.push(addFileError(configResult, file, "package"));
		});

		promise.all(errorsList)
			.then(fulfill)
			.catch(reject);
	});
}

/**
 * Validate output
 * @param {PeonBuild.PeonRc.ConfigResult} configResult
 * @return {Promise}
 */
function validateOutput(configResult) {
	return new promise(function (fulfill, reject) {
		let config = configResult.config;

		if (!config.output) {
			configResult.errors.push(createConfigError(
				new Error(errors.NO_OUTPUT_SPECIFIED)
			));
			fulfill();
			return;
		}

		let files = normalizeFile(config.output);

		if (files.length === 0) {
			configResult.errors.push(createConfigError(
				new Error(errors.NO_OUTPUT_SPECIFIED)
			));
			fulfill();
			return;
		}

		if (files.length > 1) {
			configResult.errors.push(createConfigError(
				new Error(errors.MULTIPLE_OUTPUT_FILES_SPECIFIED)
			));
			fulfill();
			return;
		}

		//add file error
		addFileError(configResult, files[0], "output")
			.then(fulfill)
			.catch(reject);
	});
}

/**
 * Validate entry
 * @param {PeonBuild.PeonRc.ConfigResult} configResult
 * @return {Promise}
 */
function validateEntry(configResult) {
	return new promise(function (fulfill, reject) {
		let config = configResult.config,
			errorsList = [];

		if (!config.entry) {
			fulfill();
			return;
		}

		let entries = normalizeEntry(config.entry);

		entries.forEach((file) => {
			errorsList.push(addEntryError(configResult, file, "entry"));
		});

		promise.all(errorsList)
			.then(fulfill)
			.catch(reject);
	});
}

/**
 * Validate dependencies
 * @param {PeonBuild.PeonRc.ConfigResult} configResult
 * @return {Promise}
 */
function validateDependencies(configResult) {
	return new promise(function (fulfill) {
		let config = configResult.config,
			map = {};

		if (!config.dependencies) {
			fulfill();
			return;
		}

		config.dependencies.forEach((dependency) => {
			let versions = map[dependency.module] || [];

			if (versions.indexOf(dependency.version) === -1) {
				versions.push(dependency.version);
			}
			map[dependency.module] = versions;
		});

		Object.keys(map).forEach((key) => {
			if (map[key].length > 1) {
				configResult.errors.push(createConfigError(
					new Error(errors.MORE_VERSIONS_OF_LIBRARY),
					[
						key,
						map[key]
					],
					tips.MORE_VERSIONS_OF_LIBRARY
				));
			}
		});

		fulfill();
	});
}

/**
 * Validate steps
 * @param {PeonBuild.PeonRc.ConfigResult} configResult
 * @return {Promise}
 */
function validateSteps(configResult) {
	return new promise(function (fulfill, reject) {
		let config = configResult.config,
			errorsList = [];

		if (!config.steps) {
			fulfill();
			return;
		}

		let steps = normalizeSteps(config.steps);

		steps.forEach((step) => {
			errorsList.push(addStepError(configResult, step, "steps"));
		});

		promise.all(errorsList)
			.then(fulfill)
			.catch(reject);
	});
}

/**
 * Validate stages
 * @param {PeonBuild.PeonRc.ConfigResult} configResult
 * @return {Promise}
 */
function validateStages(configResult) {
	return new promise(function (fulfill, reject) {
		let config = configResult.config,
			errorsList = [];

		if (!config.stages || config.stages.length === 0) {
			configResult.errors.push(createConfigError(
				new Error(errors.NO_STAGES),
				[],
				tips.NO_STAGES
			));
			fulfill();
			return;
		}

		let stages = normalizeStages(config.stages);

		stages.forEach((stage) => {
			errorsList.push(addStageError(configResult, stage, "stages"));
		});

		promise.all(errorsList)
			.then(fulfill)
			.catch(reject);
	});
}


/**
 * Validate combination
 * @param {PeonBuild.PeonRc.ConfigResult} configResult
 * @return {Promise}
 */
function validateCombination(configResult) {
	return new promise(function (fulfill) {
		//src and entry
		validateSrcAndEntry(configResult);
		//stages and steps
		validateStepsAndStages(configResult);

		fulfill();
	});
}

/**
 * Validate src and entry
 * @param {PeonBuild.PeonRc.ConfigResult} configResult
 */
function validateStepsAndStages(configResult) {
	let stagesSteps,
		stagesNames;

	//map data
	stagesNames = configResult.stages.map(stage => stage.name);
	stagesSteps = configResult.steps.map(step => step.stage);

	//steps
	configResult.steps.forEach((step) => {
		//non existing state
		if (stagesNames.indexOf(step.stage) === -1) {
			//push error
			configResult.errors.push(createConfigError(
				new Error(errors.NON_EXISTING_STAGE),
				[step.stage],
				tips.NON_EXISTING_STAGE
			));
		}
	});

	//stages
	configResult.stages.forEach((stage) => {
		//no used stage
		if (stagesSteps.indexOf(stage.name) === -1 && !enums.PredefinedStages[stage.name]) {
			//push error
			configResult.warnings.push(createConfigError(
				new Error(errors.UNUSED_STAGE),
				[stage.name],
				tips.UNUSED_STAGE
			));
		}
	});

}

/**
 * Validate src and entry
 * @param {PeonBuild.PeonRc.ConfigResult} configResult
 */
function validateSrcAndEntry(configResult) {
	let config = configResult.config;

	//both specified, invalid state
	if (config.src && config.entry) {
		configResult.errors.push(createConfigError(
			new Error(errors.SOURCES_CLASH),
			[],
			tips.SOURCES_CLASH
		));
	}

	//nothing specified, invalid state
	if (!config.src && !config.entry) {
		configResult.errors.push(createConfigError(
			new Error(errors.NO_SOURCES_SPECIFIED),
			[],
			tips.NO_SOURCES_SPECIFIED
		));
	}
}

/**
 * Validator
 * @param {string} where
 * @param {string} configPath
 * @param {PeonBuild.PeonRc.ConfigResult} configResult
 * @return {Promise}
 */
function validator(where, configPath, configResult) {
	return new promise(function (fulfill, reject) {
		let validators = [];

		validators.push(validateVendors(configResult));
		validators.push(validateOutput(configResult));
		validators.push(validateEntry(configResult));
		validators.push(validateSrc(configResult));
		validators.push(validatePackage(configResult));
		validators.push(validateDependencies(configResult));
		validators.push(validateSteps(configResult));
		validators.push(validateStages(configResult));

		validators.push(validateCombination(configResult));

		//all validators
		promise.all(validators)
			.then(fulfill)
			.catch(reject);
	});
}

//export
module.exports = validator;