namespace PeonBuild.PeonRc {

	type RunManipulator = {
		startAll(cwd: string, configs: Map<string, PeonBuild.PeonRc.ConfigResult>): Promise;
		prepare(cwd: string, configs: Map<string, PeonBuild.PeonRc.ConfigResult>): Promise<PeonBuild.PeonRc.Results.RunPrepare>;
	}

	namespace Results {

		type RunPrepare = {
			dependencies: PeonBuild.Peon.Tools.DependenciesGraph;
		}

	}

}