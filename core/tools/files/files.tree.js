const path = require('path');


/**
 * Dirs
 * @param {Object} tree
 * @param {Array.<string>} array
 * @return {Object}
 */
function dirs(tree, array) {
	let object,
		first = array[0];

	//return self
	if (array.length === 0) {
		return tree;
	}
	//fill
	object = tree[first];
	if (!object || typeof object === "string") {
		tree[first] = {};
	}
	//recursive call
	return dirs(tree[first], array.slice(1));
}

/**
 * Fill path
 * @param {*} tree
 * @param {Array.<string>} array
 */
function fillPath(tree, array) {
	let dir = dirs(tree, array.slice(0, array.length - 1)),
		last = array[array.length - 1];

	//set full path
	dir[last] = array.join(path.sep);
}

/**
 * @param {string} where
 * @param {Array.<string>} items
 * @return {Object}
 */
function filesTree(where, items) {
	let i,
		pth,
		tree,
		array,
		root = {};

	//normalize where
	where = path.normalize(where) + path.sep;
	//init root
	root[where] = tree = {};

	//iterate all files
	for (i = 0; i < items.length; i++) {
		//get path
		pth = path.normalize(items[i]);
		//check if path is in where
		if (pth.indexOf(where) === 0) {
			//data
			array = pth.substr(where.length).split(path.sep);
			//generate tree
			fillPath(tree, array);
		}
	}

	//tree of paths
	return tree;
}
//export
module.exports = filesTree;