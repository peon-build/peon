namespace PeonBuild.PeonRc {

	type ConfigManipulator = {
		name: string;
		from(where: string, settings: FromSettings): Promise<Map<string, PeonBuild.PeonRc.Config>>;
		stringify(config: Object): Promise<Array<string>>;
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
		sources?: Array<>;
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