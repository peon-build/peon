const loader = require('./loader');
const stringify = require('./stringify');


const name = ".peonrc";
const configLoader = loader(name);

function configPeonRc() {
	//interface
	return {
		//name
		name: name,
		//stringify
		stringify: stringify,
		//loaders

		/**
		 * All configs in dir
		 * @param {string} directory
		 * @param {PeonBuild.PeonRc.FromSettings} settings
		 * @return {Promise<Map<string, PeonBuild.PeonRc.Config>>}
		 */
		all(directory, settings) {
			return configLoader(directory, settings);
		},

		/**
		 * One config
		 * @param {string} directory
		 * @param config
		 * @param {PeonBuild.PeonRc.FromSettings} settings
		 * @return {Promise<Map<string, PeonBuild.PeonRc.Config>>}
		 */
		one(directory, config, settings) {
			//update setting
			settings = settings || /** @type {PeonBuild.PeonRc.FromSettings}*/{};
			settings.configFile = config;

			return configLoader(directory, settings);
		}

	}
}
//export
module.exports = configPeonRc;