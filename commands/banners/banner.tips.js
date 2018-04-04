const log = /** @type {PeonBuild.Log}*/require('../../log');

/**
 * Banner tips
 * @param {Array.<string>} tips
 */
function bannerTips(tips) {
	tips.forEach((tip) => {
		log.tip(tip);
	});
}

//export
module.exports = bannerTips;