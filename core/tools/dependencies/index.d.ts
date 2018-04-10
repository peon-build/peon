namespace PeonBuild.Peon.Tools {

	type DependenciesGraph = {
		modules: Map<string, DependencyInfo>;
		errors: Array<DependencyError>;
		sorted: Array<DependencyInfo>;
	}

	type DependencyError = {
		error?: Error;
		tips: Array<string>;
		args: Array<any>;
	}

	type DependencyInfo = {
		name?: string;
		version?: Array<string>;
		externals: Array<DependencyInfo>;
		internals: Array<DependencyInfo>;
		config?: PeonBuild.PeonRc.Config;
	}

}