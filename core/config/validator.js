const promise = global.Promise;
const norm = require('../tools/normalize/index.js')();
const errors = require('../info/errors.js');
const tips = require('../info/tips.js');
const stringify = require('./stringify.js');

/**
 * Normalize
 * @param {PeonBuild.PeonRc.File} file
 * @return {Array<PeonBuild.Peon.Tools.Files>}
 */
function normalize(file) {
	return  /** @type {Array.<PeonBuild.Peon.Tools.Files>}*/norm.normalizePeonRcFile(file);
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
 * Add result error
 * @param {PeonBuild.PeonRc.ConfigResult} configResult
 * @param {PeonBuild.Peon.Tools.Files} file
 * @param {string} prop
 * @return {Promise}
 */
function addResultError(configResult, file, prop) {
	return new promise(function (fulfill, reject) {
		let stringifyPromise,
			error = /** @type {PeonBuild.Peon.Tools.FilesError}*/file.error;

		//add file error
		if (error) {
			stringifyPromise = /** @type {Promise}*/stringify(error.original);
			stringifyPromise
				.then((lines) => {
					//push error
					configResult.errors.push(createConfigError(
						error.error,
						[],
						[
							`Pattern that is invalid in '${prop}': ${lines.join(" ")}`
						]
					));
					//ok
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

		let files = normalize(config.vendors);

		files.forEach((file) => {
			errors.push(addResultError(configResult, file, "vendors"));
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

		let files = normalize(config.src);

		files.forEach((file) => {
			errors.push(addResultError(configResult, file, "src"));
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

		let files = normalize(config.package);

		files.forEach((file) => {
			errors.push(addResultError(configResult, file, "package"));
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

		let files = normalize(config.output);

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
		addResultError(configResult, files[0], "output")
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
		let config = configResult.config;

		if (config.src && config.entry) {
			configResult.errors.push(createConfigError(
				new Error(errors.SOURCES_CLASH),
				[],
				tips.SOURCES_CLASH
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
		validators.push(validateSrc(configResult));
		validators.push(validatePackage(configResult));

		validators.push(validateCombination(configResult));

		//all validators
		promise.all(validators)
			.then(fulfill)
			.catch(reject);
	});
}

//export
module.exports = validator;