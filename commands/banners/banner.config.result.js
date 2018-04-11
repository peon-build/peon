const log = /** @type {PeonBuild.Log}*/require('../../log');

const bannerTips = require('./banner.tips.js');

/**
 * Banner config result
 * @param {string} config
 * @param {PeonBuild.PeonRc.ConfigResult} result
 */
function bannerConfigResult(config, result) {
	let valid = true;

	//messages
	if (result.messages && result.messages.length) {
		log.debug("Same debug info from config file:");
		result.messages.forEach((err, i) => {
			log.debug(` ${i + 1}. ${err.error.message}`, err.args.map((arg) => {
				return log.p.underline(arg)
			}));
			err.tips.forEach((tip) => {
				log.debug(`  - ${tip}`);
			});
		});
		log.setting("sources", `$1`, [
			log.p.path(result.sources)
		]);
	}
	//warnings
	if (result.warnings && result.warnings.length) {
		log.warning("There are some [WARNINGS] for configuration file:");
		result.warnings.forEach((err) => {
			log.warning(`There is [WARNING] from configuration file. Message from warning is '${err.error.message}'.`, err.args.map((arg) => {
				return log.p.underline(arg)
			}));
			bannerTips(err.tips);
		});
		log.setting("sources", `$1`, [
			log.p.path(result.sources)
		]);
	}
	//errors
	if (result.errors && result.errors.length) {
		log.error("There are some [ERRORS] for configuration file:");
		result.errors.forEach((err) => {
			log.error(`An [ERROR] occurred in config file. Message from error is '${err.error.message}'.`, err.args.map((arg) => {
				return log.p.underline(arg)
			}));
			log.stacktrace(err.error);
			bannerTips(err.tips);
		});
		log.setting("sources", `$1`, [
			log.p.path(result.sources)
		]);
		//invalidate
		valid = false;
	}

	//info
	log.assert(valid, "Config file $1 is valid and ready for build!", [
		log.p.path(config)
	]);
}

//export
module.exports = bannerConfigResult;