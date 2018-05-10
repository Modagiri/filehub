'use strict';

const lunr = require('lunr');
let index;

function resetIndex() {
	console.log("resetting index");
	index = lunr(function() {
		this.field('file');
		this.field('type');
		this.ref('path');
	});

}




function addToIndex(files) {
	/////////////////////////
	console.log("adding to index");
	index = lunr(function() {
		this.field('file');
		this.field('type');
		this.ref('path');

		files.forEach(function(file) {
			this.add(file)
		}, this);
	});

	console.log(index);
	/////////////////////////
}


function find(query, cb) {
	const results = index.search(query);
	console.log(query);
	console.log(results);
	console.log(index);
	cb(results);
}

module.exports = {addToIndex, find, resetIndex};