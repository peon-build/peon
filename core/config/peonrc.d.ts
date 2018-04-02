namespace PeonBuild.PeonRc {

	type Config = {

		name?: string;

		output?: File;
		vendors?: File;
		src?: File;
		entry?: Entry;

		tests?: Tests;

		package?: File;

		steps?: Array<Step>;

		stages?: Array<Stage>;
	}

	//Tests

	type Tests = {
		runner?: string;
		framework?: string;
	}

	//Steps

	type Step = {

	}

	//Stages

	type Stage = Array<string | StageDef>;

	type StageDef = {
		name: string;
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

    enum LibraryTargetType {
        commonjs2 = "commonjs2",
        amd = "amd",
		umd = "umd"
    }

}