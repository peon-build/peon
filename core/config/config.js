const loader = require('./loader');
const stringify = require('./stringify');


const name = ".peonrc";

function configPeonRc() {
	//interface
	return {
		//name
		name: name,
		//from
		from: loader(name),
		//stringify
		stringify: stringify

	}
}
//export
module.exports = configPeonRc;