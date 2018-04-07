namespace PeonBuild.PeonRc {

	type ConfigManipulator = {
		name: string;
		stringify(config: Object): Promise<Array<string>>;
		all(where: string, settings: FromSettings): Promise<Map<string, PeonBuild.PeonRc.ConfigResult>>;
		one(where: string, config: string, settings: FromSettings): Promise<Map<string, PeonBuild.PeonRc.ConfigResult>>;
	}

	type FromSettings = {
		ignorePattern?: string | Array | RegExp;
		configFile?: string;
	}

	//Merger

	type ConfigResult = {
		config: PeonBuild.PeonRc.Config;
		messages?: Array<ConfigError>;
		warnings?:  Array<ConfigError>;
		errors?: Array<ConfigError>;
		sources?: Array<string>;

		stages?: Array<PeonBuild.Peon.Tools.Stage>;
		steps?: Array<PeonBuild.Peon.Tools.Step>;
	};

	type ConfigError = {
		error?: Error;
		tips: Array<string>;
		args: Array<any>;
	}

	//ExternalFile

	type ExternalFile = {
		file?: string;
		error?: Error;

		name?: string;
		version?: string;
		description?: string;
		entryPoint?: string;
		keywords?: Array<string>;
		author?: string;
		license?: string;
		dependencies?: Array<DependencyInfo>;
	}

	type DependencyInfo = {
		module: string;
		version: string;
	}


}