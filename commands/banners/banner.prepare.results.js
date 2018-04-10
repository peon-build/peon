const log = /** @type {PeonBuild.Log}*/require('../../log');

const bannerTips = require('./banner.tips');

/**
 * Banner prepare results
 * @param {PeonBuild.PeonRc.Results.RunPrepare} prepareResults
 */
function bannerPrepareResults(prepareResults) {
	//modules order
	log.log(`Modules build order based on dependencies is $1.`, [
		log.p.underline(prepareResults.dependencies.sorted)
	]);
	//report errors
	prepareResults.dependencies.errors.forEach((error) => {
		//log error
		log.error(`An [ERROR] occurred when preparing dependencies. Message from error is '${error.error.message}'.`, error.args.map((arg) => {
			return log.p.underline(arg)
		}));
		log.stacktrace(error.error);
		//tips
		bannerTips(error.tips);
	});
}

//export
module.exports = bannerPrepareResults;