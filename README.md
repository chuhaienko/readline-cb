# readline-cb
Node.js module for reading file line by line

# Installation via npm
```bash
npm install readline-cb
```

# Usage
```javascript
var readline = require('readline-cb');

var filePath = 'path/to/file';
var i = 0;
readline.readLines(filePath, function (line, cb) {
	console.log(++i, line);
	cb();
}, function (err) {
	console.log('END');
});
```

Or more options
```javascript
var readline = require('readline-cb');
var i = 0;
var options = {
	path     : 'path/to/file',
	EOL      : '\r\n', // Default is require('os').EOL
	encoding : 'ascii' // Default is 'utf8'
};

readline.readLines(options, function (line, cb) {
	console.log(++i, line);

	if (line === 'STOP') {
		// You can break readlines process by sending Error or not-null value to cb
		cb(true);
	} else {
		cb();	
	}
}, function (err) {
	if (err) {
		console.error(err);
	}
	
	console.log('END');
});
```
