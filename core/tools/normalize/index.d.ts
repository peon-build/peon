namespace PeonBuild.Peon.Tools {

	type Normalize = {
		asGlob(pattern: string | Array<string>): string | Array<string>;
		asToolFile(dest: Array<string>, src: Array<string>): PeonBuild.Peon.Tools.Files;
		asFileError(rawError: Error, original: PeonBuild.PeonRc.File): PeonBuild.Peon.Tools.FilesError;
		normalizePeonRcFile(items: PeonBuild.PeonRc.File): Array<PeonBuild.Peon.Tools.Files>;
		normalizePeonRcEntry(items: PeonBuild.PeonRc.Entry): Array<PeonBuild.Peon.Tools.Entry>;
		normalizePeonRcStages(items: Array<PeonBuild.PeonRc.Stage>): Array<PeonBuild.Peon.Tools.Stage>;
		normalizePeonRcSteps(items: Array<PeonBuild.PeonRc.Step>): Array<PeonBuild.Peon.Tools.Step>;
		normalizePeonRcPackages(items: PeonBuild.PeonRc.Package): Array<PeonBuild.Peon.Tools.Package>;
	}

}