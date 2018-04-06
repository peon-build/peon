const promise = global.Promise;
const prettier = require("prettier");

const ret = "return ";

/**
 * Stringify object
 * @param {object} object
 * @return {string}
 */
function stringifyObject(object) {
	let keys = Object.keys(object),
		evaluated,
		string = "",
		value,
		key,
		i;

	//number or boolean
	if (typeof object === "number" || typeof object === "boolean") {
		return stringifyAnything("", object);
	}

	//start
	string +="{";
	//props
	for (i = 0; i < keys.length; i++) {
		key = keys[i];
		value = object[key];
		//stringify anything
		evaluated = stringifyAnything(key, value);
		//is not undefined
		if (evaluated !== undefined) {
			//add if defined
			string += evaluated;
			if (i < keys.length - 1) {
				string += ", ";
			}
		}
	}
	//end
	string +="}";

	//return
	return string;
}

/**
 * Stringify array
 * @param {Array} array
 * @return {string}
 */
function stringifyArray(array) {
	let string = "",
		value,
		i;

	//start
	string +="[";
	//props
	for (i = 0; i < array.length; i++) {
		value = array[i];
		//stringify anything
		string += stringifyAnything(null, value);
		if (i < array.length - 1) {
			string += ", ";
		}
	}
	//end
	string +="]";

	//return
	return string;
}

/**
 * Stringify function
 * @param {function} fn
 * @return {string}
 */
function stringifyFunction(fn) {
	let string = "";

	//start
	string += fn.toString();
	//return
	return string;
}

/**
 * Stringify anything
 * @param {string|null} key
 * @param {*} value
 * @return {string|undefined}
 */
function stringifyAnything(key, value) {
	let keyString = key ? `${key}: ` : ``;

	//not defined
	if (value === undefined) {
		return undefined;
	}
	//null
	if (value === null) {
		return `${keyString}null`;
	}
	//array
	if (value instanceof Array) {
		return `${keyString}${stringifyArray(value)}`;
	}
	//function
	if (typeof value === "function") {
		return `${keyString}${stringifyFunction(value)}`;
	}
	//regex
	if (value instanceof RegExp) {
		return `${keyString}RegExp(${value.toString()})`;
	}
	//function
	if (value && value.constructor === {}.constructor) {
		return `${keyString}${stringifyObject(value)}`;
	}
	//number, boolean
	if (typeof value === "number" || typeof value === "boolean") {
		return `${keyString}${value}`;
	}
	//string
	return `${keyString}"${value}"`;
}

/**
 * stringify
 * @param {PeonBuild.PeonRc.Config|*} config
 * @return {Promise.<string>}
 */
function stringify(config) {
	//promise
	return new promise(function (fulfill, reject){
		let string = stringifyObject(config),
			formatted;

		try {
			formatted = prettier.format(ret + string);
		} catch (err) {
			//error
			reject(err);
			return;
		}
		//ok
		fulfill(formatted.replace(ret, "").split('\n'));
	});
}

//export
module.exports = stringify;