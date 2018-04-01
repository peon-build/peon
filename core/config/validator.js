const promise = global.Promise;

/**
 * Validator
 * @param {string} where
 * @param {string} configPath
 * @param {PeonBuild.PeonRc.ConfigResult} configResult
 * @return {Promise}
 */
function validator(where, configPath, configResult) {
	return new promise(function (fulfill, reject){
		fulfill();
	});
}

//export
module.exports = validator;