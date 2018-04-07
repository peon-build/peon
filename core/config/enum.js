//export
module.exports = {

	/** @enum {PeonBuild.PeonRc.WhenType}*/
	WhenType: {
		manual: "manual",
		automatic: "automatic"
	},

	/** @enum {PeonBuild.PeonRc.PredefinedStages}*/
	PredefinedStages: {
		clean: "clean",
		tests: "tests",
		build: "build",
		pack: "pack",
		deploy: "deploy"
	}

};