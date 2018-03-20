const path = require('path');
const os = require('os');

/**
 * Normalize lines
 * @param lines
 * @return {Array.<string>}
 */
function normalizeLines(lines) {
	//filter unwanted
	return lines.filter((line) => {
		let valid = Boolean(line);

		//check for comment
		valid = valid && line[0] !== "#";

		return valid;
	});
}

/**
 * Normalize patterns
 * @param {Array.<string>} lines
 * @return {Array.<string>}
 */
function normalizePatterns(lines) {
	let files = [];

	lines.forEach((line) => {
		line = line.trim();

		let basename = path.basename(line);

		//is file
		if (basename[0] === "." || path.extname(basename)) {
			files.push(path.normalize(line));
			return;
		}
		//filter
		if (!line.endsWith("**") || !line.endsWith("*")) {
			files.push(path.join(line, "/**"));
			return;
		}
		//others
		files.push(path.normalize(line));
	});

	return files;
}

/**
 * Retrieve lines
 * @param {Buffer|string} data
 * @return {Array}
 */
function retrieveLines(data) {
	return data.toString().split(os.EOL);
}

function helper() {
	//interface
	return {

		normalizeLines: normalizeLines,
		normalizePatterns: normalizePatterns,
		retrieveLines: retrieveLines

	}
}
//export
module.exports = helper;