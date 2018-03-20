const reg = /\\/g;

/**
 * As glob
 * @param {string} path
 */
function asGlob(path) {
	//normalize for patterns
	return path.replace(reg, "/");
}
//exports
module.exports = asGlob;