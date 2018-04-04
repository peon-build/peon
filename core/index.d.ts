namespace PeonBuild {

	type Peon = {
		info: PeonInfoData,
		tools: PeonBuild.Peon.PeonTools;
		config: PeonBuild.PeonRc.ConfigManipulator;
		build: PeonBuild.PeonRc.BuildManipulator;
	}

	type PeonInfoData = {
		errors: Map<string, string>,
		tips: Map<string, Array<string>>
	}

}