const log = /** @type {PeonBuild.Log}*/require('../../log');

/**
 * Banner config info
 * @param {string} config
 */
function bannerConfigInfo(config) {
	log.space();
	log.title(`Configuration file '$1'.`, [
		log.p.path(config)
	]);
}

//export
module.exports = bannerConfigInfo;