namespace PeonBuild.PeonRc {

	type PrepareManipulator = (cwd: string, configs: Map<string, PeonBuild.PeonRc.ConfigResult>) => Promise<PeonBuild.PeonRc.Results.Prepare>;

	namespace Results {

		type Prepare = {
			dependencies: PeonBuild.Peon.Tools.DependenciesGraph;
		}

	}

}