namespace PeonBuild {

	type PeonCommands = {
		config(cwd: string, setting: PeonSetting);
		run(cwd: string, setting: PeonSetting);
	}

	type PeonSetting = {
		logLevel?: PeonBuild.LogLogLevel;
		configFile?: string;
		module?: string;
		stages?: Array<string>;
	}
}