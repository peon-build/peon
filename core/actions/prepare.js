const promise = global.Promise;

const tools = /** @type {PeonBuild.Peon.PeonTools}*/require('../tools/tools.js')();

/**
 * Prepare dependencies
 * @param {string} cwd
 * @param {Map.<string, PeonBuild.PeonRc.ConfigResult>} configs
 * @param {PeonBuild.PeonRc.Results.Prepare} results
 */
function prepareDependencies(cwd, configs, results) {
	//promise
	return new promise(function (fulfill, reject){
		//dependencies
		tools.dependencies(cwd, configs)
			.then((dependencies) => {
				results.dependencies = dependencies;
				fulfill();
			})
			.catch(reject);
	});
}

/**
 * Prepare
 * @param {string} cwd
 * @param {Object.<string, PeonBuild.PeonRc.ConfigResult>|Map} configs
 * @return {Promise<PeonBuild.PeonRc.Results.Prepare>}
 */
function preparePeonRc(cwd, configs) {
	let results = /** @type {PeonBuild.PeonRc.Results.Prepare}*/{},
		items = [];

	//promise
	return new promise(function (fulfill, reject){
		//add items
		items.push(prepareDependencies(cwd, configs, results));
		//prepare all
		promise.all(items)
			.then(() => {
				fulfill(results);
			})
			.catch(reject);
	});
}
//export
module.exports = preparePeonRc;