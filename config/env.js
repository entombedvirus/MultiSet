var fs   = require('fs'),
		path = require('path');

var ROOT_DIR   = exports.ROOT_DIR = path.normalize(__dirname + '/..');
var LIB_DIR    = exports.LIB_DIR  = path.join(ROOT_DIR + '/lib');
var SRC_DIR    = exports.SRC_DIR  = path.join(ROOT_DIR + '/src');
var PUBLIC_DIR = exports.PUBLIC_DIR  = path.join(ROOT_DIR + '/public');


// Setup lib paths for easy require's
var libs = fs.readdirSync(LIB_DIR);
libs.forEach(function(libName) {
	require.paths.unshift(path.join(LIB_DIR, libName, 'lib'));
})

// Load the extensions to the stdlib
require('core_ext');

// Setup src path for easy require's
require.paths.unshift(SRC_DIR);

// Automatically require things in the src, so that we don't need to explicitly require them
// var files = fs.readdirSync(SRC_DIR);
// files.forEach(function(f) {
// 	require(f)
// });