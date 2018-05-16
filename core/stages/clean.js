const promise = global.Promise;

const norm = /** @type {PeonBuild.Peon.Tools.Normalize}*/require('../tools/normalize/index.js');

/**
 * Stage clean
 * @param {string} cwd
 * @param {PeonBuild.PeonRc.Results.QueueItem} queueItem
 * @param {PeonBuild.Peon.Tools.RuntimeStage} stage
 * @return {Promise<PeonBuild.PeonRc.Results.ProcessedStage>}
 */
function stageClean(cwd, queueItem, stage) {
	let processedStage = /** @type {PeonBuild.PeonRc.Results.ProcessedStage}*/{};

	//promise
	return new promise(function (fulfill, reject) {

		//TODO: Make clean

		//processed stage
		fulfill(processedStage);
	});
}

//export
module.exports = stageClean;