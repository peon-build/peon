const promise = global.Promise;
const norm = require('../tools/normalize/index.js')();
const errors = require('../info/errors.js');
const tips = require('../info/tips.js');
const stringify = require('./stringify.js');

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
			errors = [];

		if (!config.vendors) {
			fulfill();
			return;
		}

		let files = normalizeFile(config.vendors);

		files.forEach((file) => {
			errors.push(addFileError(configResult, file, "vendors"));
		});

		promise.all(errors)
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
			errors = [];

		if (!config.src) {
			fulfill();
			return;
		}

		let files = normalizeFile(config.src);

		files.forEach((file) => {
			errors.push(addFileError(configResult, file, "src"));
		});

		promise.all(errors)
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
			errors = [];

		if (!config.package) {
			fulfill();
			return;
		}

		let files = normalizeFile(config.package);

		files.forEach((file) => {
			errors.push(addFileError(configResult, file, "package"));
		});

		promise.all(errors)
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
			errors = [];

		if (!config.entry) {
			fulfill();
			return;
		}

		let entries = normalizeEntry(config.entry);

		entries.forEach((file) => {
			errors.push(addEntryError(configResult, file, "entry"));
		});

		promise.all(errors)
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
 * Validate combination
 * @param {PeonBuild.PeonRc.ConfigResult} configResult
 * @return {Promise}
 */
function validateCombination(configResult) {
	return new promise(function (fulfill) {
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

		fulfill();
	});
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

		validators.push(validateCombination(configResult));

		//all validators
		promise.all(validators)
			.then(fulfill)
			.catch(reject);
	});
}

//export
module.exports = validator;