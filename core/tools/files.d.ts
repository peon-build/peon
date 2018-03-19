namespace PeonBuild.Peon.Tools {

	type Files = {
		source?: Array<string>;
		destination?: Array<string>;
		ignorePattern?: Array<string>;
		error?: FilesError
	}

	type FilesError = {
		error?: Error
		original?: PeonBuild.PeonRc.File
	}

}