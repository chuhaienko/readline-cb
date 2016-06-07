'use strict';

var os     = require('os');
var fs     = require('fs');
var extend = require('util')._extend;

/**
 * Read file. Send line by line to lineCallback. On end or on error call endCallback
 * @param {String|Object} opts
 * @param {Function} lineCallback
 * @param {Function} endCallback
 */
exports.readLines = function (opts, lineCallback, endCallback) {
	if (typeof opts === 'string') {
		opts = {path: opts};
	}
	
	if (typeof lineCallback !== 'function') {
		throw new Error('Second argument must be function');
	}

	if (typeof endCallback !== 'function') {
		endCallback = function () {};
	}

	var defaults = {
		EOL      : os.EOL,
		encoding : 'utf8'
	};
	var options = extend(defaults, opts);

	var isEOF = false;
	var isFinished = false;
	var linesArr = []; // Array of lines
	var curLine; // Index of current line
	var lastPart;
	var chunkString;

	var rStream = fs.createReadStream(options.path);

	rStream.on('data', function (chunk) {
		curLine = 0;

		if (lastPart) {
			chunkString = lastPart + chunk.toString(options.encoding);
		} else {
			chunkString = chunk.toString(options.encoding);
		}

		linesArr = chunkString.split(options.EOL);
		lastPart = linesArr.pop();

		rStream.pause();

		processLines();
	});
	rStream.on('end', function () {
		isEOF = true;
		curLine = 0;

		if (typeof lastPart === 'string') {
			linesArr = [lastPart];
		}

		processLines();
	});
	rStream.on('close', function () {
		finish();
	});
	rStream.on('error', function (err) {
		finish(err);
	});

	function processLines(err) {
		if (err || isFinished) {
			return finish(err);
		}

		if (linesArr.length <= curLine) {
			if (isEOF) {
				endCallback();
			} else {
				rStream.resume();
			}
		} else {
			lineCallback(linesArr[curLine++], processLines);
		}
	}

	function finish(err) {
		if (!isFinished) {
			if (err) {
				rStream.close();
				isFinished = true;
				endCallback(err);
			}
		}
	}
};
