const log = /** @type {PeonBuild.Log}*/require('../../log');


/**
 * Banner queue list
 * @param {Array.<PeonBuild.PeonRc.Results.QueueItem>} queue
 */
function bannerQueueList(queue) {
	//log queue info
	log.log(`There are $1 modules in queue that will be run.`, [
		log.p.number(queue.length)
	]);
	//iterate all
	queue.forEach((item, index) => {
		//modules order
		log.log(` $1. Module $2 ($3) and there stages will be run: $4.`, [
			log.p.number(index + 1),
			log.p.underline(item.dependency.name),
			log.p.path(item.configPath),
			log.p.underline(item.stages.map(stage => stage.name))
		]);
	});
}

//export
module.exports = bannerQueueList;