const promise = global.Promise;

const core = /** @type {PeonBuild.Peon}*/require('../../index')();
const log = /** @type {PeonBuild.Log}*/require('../../log');

const defaultsIgnores = [
	"**/node_modules/**"
];


/**
 * Load from setting
 * @param {string} where
 * @param {PeonBuild.PeonSetting} setting
 * @return {Promise<PeonBuild.PeonRc.FromSettings>}
 */
function loadFromSettings(where, setting) {
	let wait = [],
		settings = /** @type {PeonBuild.PeonRc.FromSettings}*/{};

	//promise
	return new promise(function (fulfill, reject){
		//add
		wait.push(loadIgnorePattern(where, settings));
		//wait for all
		promise.all(wait)
			.then(() => {
				//add props
				settings.configFile = setting.configFile;
				//send
				fulfill(settings);
			})
			.catch((err) => {
				reject(err);
			});
	});
}

/**
 * Load ignore patterns
 * @param {string} where
 * @param {PeonBuild.PeonRc.FromSettings} settings
 * @return {Promise}
 */
function loadIgnorePattern(where, settings) {
	//promise
	return new promise(function (fulfill, reject){
		core.tools.ignores(where, {
			deep: true
		})
			.then((fls) => {
				//ignore pattern
				settings.ignorePattern = flattenIgnoreFiles(fls);
				//fulfill
				fulfill();
			})
			.catch((err) => {
				reject(err);
			});
	});
}


/**
 * Flatten ignore files
 * @param {Array.<PeonBuild.Peon.Tools.Ignore>} files
 * @return {Array.<string>}
 */
function flattenIgnoreFiles(files) {
	let array = [];

	//ignore
	files.forEach((file) => {
		//add to array
		array.push(...file.ignored);
	});
	//no files, use defaults
	if (files.length === 0) {
		array.push(...defaultsIgnores);
	}
	//banner ignore pattern
	bannerIgnorePattern(files, array);
	//array
	return array;
}

//#: Banners

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
module.exports = loadFromSettings;