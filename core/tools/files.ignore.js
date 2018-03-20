const asGlob = require('./as.glob');

const path = require('path');

const promise = global.Promise;
const gitignore = require('./ignored/.gitignore');
const hgignore = require('./ignored/.hgignore');

/**
 * @param {string} where
 * @param {PeonBuild.Peon.Tools.IgnoreSettings=} settings
 * @return {Promise<Array.<PeonBuild.Peon.Tools.Ignore>>}
 */
function ignored(where, settings) {
	//promise
	return new promise(function (fulfill, reject){
		let waiters = [];

		//add all known ignore files
		waiters.push(gitignore(where, settings));
		waiters.push(hgignore(where, settings));

		//wait for all
		promise.all(waiters)
			.then((res) => {
				let results = Array.prototype.concat(...res);

				//iterate all
				results.forEach((result) => {
					let basename = path.dirname(result.file);

					//set ignore
					result.ignored = result.ignored.map((file) => {
						return asGlob(path.join(basename, file));
					});
				});
				//done
				fulfill(results);
			})
			.catch((err) => {
				reject(err)
			});
	});
}
//export
module.exports = ignored;