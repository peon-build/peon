namespace PeonBuild {

	type PeonCommands = {
		config(cwd: string, setting: PeonSetting);
		build(cwd: string, setting: PeonSetting);
	}

	type PeonSetting = {
		logLevel?: PeonBuild.LogLogLevel;
		configFile?: string;
		module?: string;
	}
}