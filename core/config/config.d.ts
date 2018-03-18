namespace PeonBuild.PeonRc {

	type ConfigManipulator = {
		name: string;
		from(where: string): Promise<Map<string, PeonBuild.PeonRc.Config>>;
		stringify(config: Object): Promise<Array<string>>;
	}

}