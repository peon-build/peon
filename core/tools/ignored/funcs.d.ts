namespace PeonBuild.Peon.Tools {

	type IgnoredFuncs = {
		normalizeLines(lines: Array<string>): Array<string>;
		normalizePatterns(lines: Array<string>): Array<string>;
		retrieveLines(data: ArrayBuffer | string): Array<string>;
	}

}