const promise = global.Promise;
const path = require('path');
const fs = require('fs');

const package_json = "package.json";

/**
 * Create external file
 * @param {string} file
 * @param {Error} err
 * @return {PeonBuild.PeonRc.ExternalFile}
 */
function createExternalFile(file, err) {
	let externalFile = /** @type {PeonBuild.PeonRc.ExternalFile}*/{};

	//external file
	externalFile.file = file;
	if (err) {
		externalFile.error = err;
	}
	//return
	return externalFile;
}

/**
 * Fill external file
 * @param {string} file
 * @param {PeonBuild.PeonRc.ExternalFiles.PackageJsonFile} json
 * @return {PeonBuild.PeonRc.ExternalFile}
 */
function fillExternalFile(file, json) {
	let externalFile = createExternalFile(file, null);

	externalFile.name = json.name;
	externalFile.version = json.version;
	externalFile.description = json.description;
	externalFile.entryPoint = json.main;
	externalFile.keywords = json.keywords;
	externalFile.author = json.author;
	externalFile.license = json.license;
	externalFile.dependencies = dependencies(json.dependencies);

	//return
	return externalFile;
}

/**
 * Dependencies
 * @param {PeonBuild.PeonRc.ExternalFiles.PackageJsonFileDependency} dep
 * @return {Array.<PeonBuild.PeonRc.DependencyInfo>}
 */
function dependencies(dep) {
	let i,
		module,
		modules,
		info = [];

	//no dep
	if (!dep) {
		return info;
	}
	//iterate all
	modules = Object.keys(dep);
	for (i = 0; i < modules.length; i++) {
		module = modules[i];
		info.push(/** @type {PeonBuild.PeonRc.DependencyInfo}*/{
			module: module,
			version: dep[module]
		});
	}
	//return array of info
	return info;
}

/**
 * Merger
 * @param {string} configPath
 * @param {Object.<string, PeonBuild.PeonRc.ExternalFile>} files
 * @return {Promise<>}
 */
function packageJson(configPath, files) {
	return new promise(function (fulfill){
		let packageJsonPath = path.join(path.dirname(configPath), package_json);

		fs.stat(packageJsonPath, (err, stat) => {
			//there is error or not file, but why?
			if (err || !stat.isFile()) {
				//set as not used
				files[package_json] = createExternalFile(packageJsonPath, err);
				fulfill();
				return;
			}
			//stat
			fs.readFile(packageJsonPath, (err, data) => {
				let json;

				//there is error or not file, but why?
				if (err) {
					//set as not used
					files[package_json] = createExternalFile(packageJsonPath, err);
					fulfill();
					return;
				}
				//parse json
				try {
					json = JSON.parse(data.toString());
				} catch(e) {
					//set as not used
					files[package_json] = createExternalFile(packageJsonPath, e);
					fulfill();
					return;
				}
				//json is ok
				files[package_json] = fillExternalFile(packageJsonPath, json);
				fulfill();
			})
		});
	});
}

//export
module.exports = packageJson;