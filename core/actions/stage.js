const promise = global.Promise;

const stageClean = require('../stages/clean.js');

const enums = require('../config/enum.js');

/**
 * Stage peon rc
 * @param {string} cwd
 * @param {PeonBuild.PeonRc.Results.QueueItem} queueItem
 * @param {PeonBuild.Peon.Tools.RuntimeStage} stage
 * @return {Promise<PeonBuild.PeonRc.Results.ProcessedStage>}
 */
function stagePeonRc(cwd, queueItem, stage) {
	let stagePromise;

	//promise
	return new promise(function (fulfill, reject) {
		switch (stage.name) {
			case enums.PredefinedStages.clean:
				stagePromise = /** @type {Promise}*/stageClean(cwd, queueItem, stage);
				stagePromise.then(fulfill);
				stagePromise.catch(reject);
				break;
			case enums.PredefinedStages.build:
				//TODO: Stage BUILD
				fulfill({});
				break;
			case enums.PredefinedStages.tests:
				//TODO: Stage TESTS
				fulfill({});
				break;
			case enums.PredefinedStages.pack:
				//TODO: Stage PACK
				fulfill({});
				break;
			case enums.PredefinedStages.deploy:
				//TODO: Stage DEPLOY
				fulfill({});
				break;
			default:
				//TODO: Stage CUSTOM
				fulfill({});
				break;
		}
	});
}

//export
module.exports = stagePeonRc;