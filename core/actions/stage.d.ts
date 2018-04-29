namespace PeonBuild.PeonRc {

	type StageRunManipulator = (cwd: string, queueItem: PeonBuild.PeonRc.Results.QueueItem, stage: PeonBuild.Peon.Tools.RuntimeStage) => Promise<PeonBuild.PeonRc.Results.ProcessedStage>;

	namespace Results {

		type ProcessedStage = {
			//TODO: ProcessedStage def
		}

	}

}