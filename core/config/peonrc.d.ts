namespace PeonBuild.PeonRc {

	type Config = {

		name?: string;
		version?: string;

		output?: File;
		vendors?: File;
		package?: Package;

		src?: Sources;
		entry?: Entry;

		tests?: Tests;

		dependencies?: Array<Dependency>;
		steps?: Array<Step>;
		stages?: Array<Stage>;
	}

	//Tests

	type Tests = {
		runner?: string;
		framework?: string;
	}

	//Sources

	type Sources = {
		files?: File;
		libraryTarget?: LibraryTargetType;
	}

	//Dependencies

	type Dependency = {
		module: string;
		version: string;
	}

	//Package

    type Package = PackageDef | Array<PackageDef>;

	type PackageDef = {
		type: PackageType | Array<PackageType>;
		files: File;
	}

	//Steps

	type Step = {
		name?: string;
		stage?: string;
		handler?();
	}

	//Stages

	type Stage = Array<string | StageDef | PredefinedStages>;

	type StageDef = {
		name: string | PredefinedStages;
		when?: WhenType;
	}

	//Entry

	type Entry = string | EntryDef | Array<string | EntryDef>;

	type EntryDef = {
		file?: string;
		libraryTarget?: LibraryTargetType;
	}

	//Files

	type File = string | FileDef | Array<string | FileDef>;

	type FileDef = {
		src?: string | Array;
		dest?: string | Array;
		ignorePattern?: string | Array;
	}

	//enums

	enum WhenType {
		manual = "manual"
	}

	enum PredefinedStages {
		clean = "clean",
		tests = "tests",
		build = "build",
		pack = "pack",
		deploy = "deploy"
	}

    enum PackageType {
        zip = "zip",
		npm = "npm"
    }

	enum LibraryTargetType {
		commonjs2 = "commonjs2",
		amd = "amd",
		umd = "umd"
	}

}