//https://www.npmjs.com/package/commander

const pjson = require('./package.json');

const path = require('path');
const program = /** @type {local.Command}*/require('commander');
//const core = /** @type {PeonBuild.TimeTracking}*/require('./core/index')();
const log = /** @type {PeonBuild.Log}*/require('@peon-build/peon-log')();
const timeTracking = /** @type {PeonBuild.Log}*/require('@peon-build/peon-time-tracking')();


//options
program
	.version(pjson.version);

program
	.command('debug')
	.description(`Run debug watch server designed to developing and debugging modules.`)
	.action((message, env) => {

	});

program
	.command('build')
	.description(`Build modules to desired output path and include all available assets.`)
	.action((message, env) => {

	});

program
	.command('pack')
	.description(`Pack all modules into desired bundles or into one file that contains all.`)
	.action((message, env) => {

	});


//parse data
program.parse(process.argv);