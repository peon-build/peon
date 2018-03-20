namespace PeonBuild {

	type Peon = {
		tree(where: string, files: Array<string>): Map<string, Map>;
		files(where: string, files: Array<string>): Promise<Array<PeonBuild.Peon.Tools.Files>>;
		ignored(where: string, settings?: PeonBuild.Peon.Tools.IgnoreSettings): Promise<Array<PeonBuild.Peon.Tools.Files>>;
		config: PeonBuild.PeonRc.ConfigManipulator;
	}

}