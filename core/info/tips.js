const tips = {
	"MULTIPLE_NAMES_POSSIBLE_FOUND": [
		`You can define name only in one config file.`,
		`Rename module in all loaded files on same name.`
	],
	"MULTIPLE_VERSIONS_POSSIBLE_FOUND": [
		`You can define version only in one config file.`,
		`Use same version for module in all loaded files.`
	],
	"NO_VERSION_FOUND": [
		`Define version info in .peonrc config file. Use 'version' property to define it.`,
		`Define version in one of loaded supported file, for example in package.json file.`
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
	],
	"NO_STAGES": [
		`If there is no stages, Peon is basically not work. Define stages to successful run build. You can use default stages names.`
	],
	"NON_EXISTING_STAGE": [
		`Rename stage and use one of defined in 'stages' array.`,
		`Add stage into 'stages' array.`
	],
	"UNUSED_STAGE": [
		`You can remove this stage from your configuration file.`
	],
	"NO_VERSION_CALCULATED": [
		`There must be at lest one version specified exactly in modules. You can not use '*' everywhere.`
	],
	"MULTIPLE_VERSIONS_FOUND": [
		`You must specified version range that is intersected. For example ^2.0.0 and ^3.0.0 are ok, 1.0.0 and 2.0.0 is wrong.`
	]
};

module.exports = tips;