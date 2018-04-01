const reg = /\\/g;

/**
 * As glob
 * @param {string|Array|T} path
 * @return {string|Array|T}
 */
function asGlob(path) {
	//array
	if (path &&path.constructor === [].constructor) {
		return path.map((item) => {
			return item.replace(reg, "/");
		});
	}
	//normalize for patterns
	return path.replace(reg, "/");
}
//exports
module.exports = asGlob;