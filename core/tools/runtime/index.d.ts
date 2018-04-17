namespace PeonBuild.Peon.Tools {

	type RuntimeGraph = {
		stages: Map<string, RuntimeStage>;
		errors: Array<RuntimeError>;
		sorted: Array<string>;
	}

	type RuntimeError = {
		error?: Error;
		tips: Array<string>;
		args: Array<any>;
	}

	type RuntimeStage = {
		name: string;
		stage: PeonBuild.Peon.Tools.Stage;
		steps: Array<PeonBuild.Peon.Tools.Step>;
	}

}