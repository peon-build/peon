namespace PeonBuild {

	type Peon = {
		info: PeonInfoData,
		tools: PeonBuild.Peon.PeonTools;
		config: PeonBuild.PeonRc.ConfigManipulator;
		prepare: PeonBuild.PeonRc.PrepareManipulator;
		run: {
			queue: PeonBuild.PeonRc.QueueManipulator,
			module: PeonBuild.PeonRc.ModuleManipulator
		}
	}

	type PeonInfoData = {
		errors: Map<string, string>,
		tips: Map<string, Array<string>>
	}

}