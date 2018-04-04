const log = /** @type {PeonBuild.Log}*/require('../../log');

/**
 * Banner options
 * @param {Array.<PeonBuild.Peon.Tools.Ignore>} files
 * @param {Array.<string>} ignorePattern
 */
function bannerIgnorePattern(files, ignorePattern) {
	//report options
	log.setting("ignorePattern", "Using this ignore pattern with $1 patterns.", [
		log.p.number(ignorePattern.length.toString())
	]);

	//report
	files.forEach((file) => {
		//log filename
		log.filename(`Loading patterns from $1 where found $2 patterns.`, [
			log.p.path(file.file),
			log.p.number(file.ignored.length.toString())
		]);

		//warning
		if (file.warning) {
			log.warning(`There is [WARNING] from $1 file: '${file.warning.message}'.`, [
				log.p.path(file.file)
			]);
		}
		//err
		if (file.error) {
			//log error
			log.error(`An [ERROR] occurred when in .ignore file. Message from error is '${file.error.message}'.`);
			log.stacktrace(file.error);
		}
	});
}

//export
module.exports = bannerIgnorePattern;