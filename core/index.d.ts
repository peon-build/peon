namespace PeonBuild {

	type Peon = {
		tree(where: string, files: Array<string>): Map<string, Map>;
		files(where: string, files: Array<string>): Promise<Array<PeonBuild.Peon.Tools.Files>>;
		config: PeonBuild.PeonRc.ConfigManipulator;

		commands: PeonCommands;
	}

	type PeonCommands = {
		config(cwd: string, setting: PeonSetting);
	}

	type PeonSetting = {
		logLevel?: PeonBuild.LogLogLevel;
	}

}