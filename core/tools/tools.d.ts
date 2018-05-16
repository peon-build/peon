namespace PeonBuild.Peon {

	type PeonTools = {
		normalize: PeonBuild.Peon.Tools.Normalize;
		asTree(where: string, files: Array<string>): Map;
		files(where: string, items: PeonBuild.PeonRc.File): Promise<Array<PeonBuild.Peon.Tools.Files>>;
		ignores(where: string, setting: PeonBuild.Peon.Tools.IgnoreSettings): Promise<Array<PeonBuild.Peon.Tools.Ignore>>;
		dependencies(where: string, configs: Map<string, PeonBuild.PeonRc.ConfigResult>): Promise<PeonBuild.Peon.Tools.DependenciesGraph>;
	}

	namespace Tools {

		type Files = {
			source?: Array<string>;
			destination?: Array<string>;
			ignorePattern?: Array<string>;
			error?: FilesError;
		}

		type FilesError = {
			error?: Error;
			original?: PeonBuild.PeonRc.File;
		}

		type Entry = {
			file?: string;
			error?: EntryError;
		}

		type EntryError = {
			error?: Error;
			original?: PeonBuild.PeonRc.Entry;
		}

		type Ignore = {
			file: string;
			ignored: Array;
			type: string;
			error?: Error;
			warning?: Error;
			info?: Array<Error>;
		}

		type IgnoreSettings = {
			deep?: boolean;
		}

		type Step = {
			name?: string;
			stage?: string;
			handler?();
			error?: StepError;
		}

		type StepError = {
			error?: Error;
			original?: PeonBuild.PeonRc.Step;
		}

		type Stage = {
			name: string;
			when?: PeonBuild.PeonRc.WhenType;
			error?: StageError;
		}

		type StageError = {
			error?: Error;
			original?: PeonBuild.PeonRc.Stage;
		}

	}
}