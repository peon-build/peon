namespace PeonBuild.PeonRc {

	type ConfigManipulator = {
		name: string;
		from(where: string, settings: FromSettings): Promise<Map<string, PeonBuild.PeonRc.Config>>;
		stringify(config: Object): Promise<Array<string>>;
	}

	type FromSettings = {
		ignorePattern?: string | Array | RegExp;
	}

}