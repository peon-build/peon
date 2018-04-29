const promise = global.Promise;

/**
 * Stage peon rc
 * @param {string} cwd
 * @param {PeonBuild.PeonRc.Results.QueueItem} queueItem
 * @param {PeonBuild.Peon.Tools.RuntimeStage} stage
 * @return {Promise<PeonBuild.PeonRc.Results.ProcessedStage>}
 */
function stagePeonRc(cwd, queueItem, stage) {
	let processedStage = /** @type {PeonBuild.PeonRc.Results.ProcessedStage}*/{};

	//promise
	return new promise(function (fulfill, reject){
		//TODO: Module process + promise return
		//processed stage
		fulfill(processedStage);
	});
}

//export
module.exports = stagePeonRc;