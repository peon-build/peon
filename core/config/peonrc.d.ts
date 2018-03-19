namespace PeonBuild.PeonRc {

	type Config = {

		name?: string;

		output?: File;
		vendors?: File;
		src?: File;

		tests?: Tests;

		steps?: Array<Step>;

		stages?: Array<Stage>;
	}

	type Tests = {
		runner?: string;
		framework?: string;
	}

	type Step = {

	}

	type Stage = Array<string | StageDef>;

	type StageDef = {
		name: string;
		when?: WhenType;
	}

	type File = string | FileDef | Array<string | FileDef>;

	type FileDef = {
		src?: string | Array;
		dest?: string | Array;
		ignorePattern?: string | Array;
	}

	enum WhenType {
		manual = "manual"
	}

}