const errors = {
	"CANNOT_LOAD_CONFIG_FILES": `There is problem when loading config files. Try to check enter pattern.`,
	"MULTIPLE_NAMES_POSSIBLE_FOUND": `There can be more names that are possible to use. These names are $1.`,
	"SOURCE_FILE_NOT_EXISTS": `There is no source file $1 that can be used for data load.`,
	"SOURCE_EXISTS_BUT_NO_FILES_PROVIDED": `There is 'src' property but missing 'files' property.`,
	"INVALID_PATTERN_OR_FORMAT": `Invalid file format or pattern. You use pattern that is not compatible with blob or minimatch format.`,
	"NO_OUTPUT_SPECIFIED": `There is no 'output' property. You must specify output for your module!`,
	"NO_SOURCES_SPECIFIED": `There is no 'src' or 'entry' property. You must specify sources for your module!`,
	"MULTIPLE_OUTPUT_FILES_SPECIFIED": `There are multiple files specified as output. This is not possible.`,
	"SOURCES_CLASH": `There is source file clash. You specified 'output' and 'src' property.`,
	"MORE_VERSIONS_OF_LIBRARY": `There are more versions for library $1. These versions are $2.`,
	"INVALID_STEPS_DEFINITION": `Property 'steps' must by array of steps.`,
	"STEP_HAS_NO_NAME": `Step definition has no 'name' defined. That must by set for right identification.`,
	"STEP_HAS_NO_STAGE": `Step definition has no 'stage' defined. That must by set. If not, step will never run.`,
	"INVALID_STAGE_DEFINITION": `Property 'stages' must by array of stages.`,
	"INVALID_STAGE_FORMAT": `Invalid format for stage.`,
	"STAGE_HAS_NO_NAME": `There is stage without name. Name must be specified, because is used in steps for determining when step run.`,
	"NO_STAGES": `There all no stages. Stages must be defined to run all necessary items.`
};

module.exports = errors;