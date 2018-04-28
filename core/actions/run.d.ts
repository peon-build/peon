namespace PeonBuild.PeonRc {

	type QueueManipulator = (cwd: string, prepare: PeonBuild.PeonRc.Results.Prepare, stages?: Array<string>) => Promise<PeonBuild.PeonRc.Results.QueueItem>;
	type ModuleManipulator = (cwd: string, queue: Array<PeonBuild.PeonRc.Results.QueueItem>, stage: string) => Promise<PeonBuild.PeonRc.Results.QueueItem>;

	namespace Results {

		type QueueItem = {
			configPath: string;
			dependency: PeonBuild.Peon.Tools.DependencyInfo;
			stages: Array<PeonBuild.Peon.Tools.RuntimeStage>;
		}

	}

}