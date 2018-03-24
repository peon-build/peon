//https://www.npmjs.com/package/glob
//https://www.npmjs.com/package/commander

const pjson = require('./package.json');

const program = /** @type {local.Command}*/require('commander');
const log = /** @type {PeonBuild.Log}*/require('./log');
const commands = /** @type {PeonBuild.PeonCommands}*/require('./commands')();
//const timeTracking = /** @type {PeonBuild.Log}*/require('@peon-build/peon-time-tracking')();

const logLevelDefault = log.LogLevel.Info;

/**
 * Fill settings
 * @param {local.Command=} env
 * @param {PeonBuild.PeonSetting=} settings
 * @returns {PeonBuild.PeonSetting}
 */
function fillSetting(env, settings) {
	let options,
		option,
		value,
		name,
		i;

	//no provided
	if (!env) {
		return settings;
	}

	//normalize
	options = /** @type {Array.<local.Option>}*/env.options || [];
	settings = settings || {
		logLevel: logLevelDefault,
		configFile: null
	};
	//iterate options and try to read data
	for (i = 0; i < options.length; i++) {
		option = options[i].long;
		name = option.replace("--", "");

		switch (name) {
		case "log-level":
			value = env["logLevel"];
			settings.logLevel = value || settings.logLevel;
			break;
		case "config-file":
			value = env["configFile"];
			settings.configFile = value || settings.configFile;
			break;
		default:
			break;
		}
	}
	//parent
	fillSetting(env.parent, settings);
	//return settings
	return settings;
}


//options
program
	.version(pjson.version)
	.option('-l, --log-level <level>', `Set log level for log messages. Current default is '${logLevelDefault}'.`);

program
	.command('init')
	.description(`Run init command when you can create new definition for your app.`)
	.action((env) => {

	});

program
	.command('debug')
	.description(`Run debug watch server designed to developing and debugging modules.`)
	.action((env) => {

	});

program
	.command('build')
	.description(`Build modules to desired output path and include all available assets.`)
	.action((env) => {

	});

program
	.command('pack')
	.description(`Pack all modules into desired bundles or into one file that contains all.`)
	.action((env) => {

	});

program
	.command('config')
	.option('-c, --config-file <file-path>', `Set exactly configuration file to view. Default is prompt that allowed select from found config files.`)
	.description(`Show all information about config file.`)
	.action((env) => {
		let setting = fillSetting(env),
			directory = process.cwd();

		//config run from commands
		commands.config(directory, setting);
	});


//parse data
program.parse(process.argv);