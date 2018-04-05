const tips = {
	"MULTIPLE_NAMES_POSSIBLE_FOUND": [
		`You can define name only in one module.`,
		`Rename module in all loaded files on same name.`
	],
	"SOURCES_CLASH": [
		`Specify only one type of sources. 'src' is for old way concat style building, 'entry' is for import like project style.`
	],
	"NO_SOURCES_SPECIFIED": [
		`Specify one type of sources. 'src' is for old way concat style building, 'entry' is for import like project style.`
	],
	"MORE_VERSIONS_OF_LIBRARY": [
		`Check all your configuration files and find this library and unify version.`,
		`Keep dependencies on same module only in one file.`
	]
};

module.exports = tips;