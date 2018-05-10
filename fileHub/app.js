'use strict';

const fileSystem = require('./fileSystem');
const userInterface = require('./userInterface');
const search = require ('./search');


function main() {
	let folderPath = fileSystem.getHomeFolder();
	userInterface.loadDirectory(folderPath)(window);
	userInterface.bindSearchField((event) => {
		const query = event.target.value;
		console.log(`This is the query ${query}`);

		if(query == '') {
			userInterface.resetFilter();
		}
		else {
			console.log("Calling search.find from main");
			search.find(query, userInterface.filterResults);
		}
	});
}


window.onload = main;