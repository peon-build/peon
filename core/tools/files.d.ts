namespace PeonBuild.Peon.Tools {

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

	type Ignore = {
		file: string;
		ignored: Array;
		type: string;
		error?: Error;
		warning?: Error;
	}

	type IgnoreSettings = {
		deep?: boolean;
	}

}