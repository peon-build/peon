namespace PeonBuild.PeonRc.ExternalFiles {

	type PackageJsonFile = {
		name?: string;
		version?: string;
		description?: string;
		main?: string;
		keywords?: Array<string>;
		author?: string;
		license?: string;
		dependencies?: PackageJsonFileDependency;
	}

	type PackageJsonFileDependency = {
		[key: string]: string;
	}


}