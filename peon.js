//https://www.npmjs.com/package/commander

const path = require('path');
const program = /** @type {local.Command}*/require('commander');
const core = /** @type {PeonBuild.TimeTracking}*/require('./core/index')();
const log = /** @type {PeonBuild.Log}*/require('@peon-build/peon-log')();
const timeTracking = /** @type {PeonBuild.Log}*/require('@peon-build/peon-time-tracking')();