namespace PeonBuild {

	type Peon = {
		info: PeonInfoData,
		tools: PeonBuild.Peon.PeonTools;
		config: PeonBuild.PeonRc.ConfigManipulator;
	}

	type PeonInfoData = {
		errors: Map<string, string>,
		tips: Map<string, Array<string>>
	}

}