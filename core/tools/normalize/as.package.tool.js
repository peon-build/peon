/**
 * Tool package
 * @param {Array.<PeonBuild.PeonRc.PackageType>} type
 * @return {PeonBuild.Peon.Tools.Files}
 */
function toolPackage(type) {
	let pckg = /** @type {PeonBuild.Peon.Tools.Package}*/{};

	//fill data
	pckg.type = type;
	pckg.files = [];

	return pckg;
}
//export
module.exports = toolPackage;