'use strict';

let document;

const fileSystem = require('./fileSystem');
//const search = require('./search');
const path = require('path');

// Vis mappeadressen
function displayFolderPath(folderPath) {
	document.getElementById('current-folder')
		.innerHTML = convertFolderPathIntoLinks(folderPath);
	bindCurrentFolderPath(); //attach event listener to folders
}



// gjoer main-area diven blank igjen
function clearView() {
	const mainArea = document.getElementById('main-area');
	let firstChild = mainArea.firstChild;
	
	while(firstChild) {
		mainArea.removeChild(firstChild);
		firstChild = mainArea.firstChild;
	}
}


function loadDirectory(folderPath) {
	return function(window) {
		if(!document) {
			document = window.document;
		}

		search.resetIndex();
		// vis mappeadresen
		displayFolderPath(folderPath);
		//console.log("Gonna display folderpath");
		// vis alle mapper og filer 
		fileSystem.getFilesInFolder(folderPath, (err, files) => {
			clearView();
			if(err) {
				return alert('Kunne ikke hente mappe');
			}
			//console.log("Gonna inspect and describe files");
			fileSystem.inspectAndDescribeFiles(folderPath, files, displayFiles);
			//console.log("Line 49 in loadDirectory");
		});
	};
}



function displayFile(file) {
	//console.log("Inside displayFile");
	const mainArea = document.getElementById('main-area');
	const template = document.querySelector('#item-template');
	let clone = document.importNode(template.content, true);

	clone.querySelector('img').src = `images/${file.type}.svg`;
	clone.querySelector('img').setAttribute('data-filePath', file.path);
	if(file.type === 'directory') {
		//console.log("Found directory");
		clone.querySelector('img')
			.addEventListener('dblclick', () => {
				loadDirectory(file.path)();
			}, false);
	}
	else {
		//console.log("Found file");
		clone.querySelector('img')
			.addEventListener('dblclick', () => {
				fileSystem.openFile(file.path);
			}, false);
	}
	clone.querySelector('.card-body').innerText = file.file;
	mainArea.appendChild(clone);
}

// attach event listener to each folder path
function bindCurrentFolderPath() {
	const load = (event) => {
		const folderPath = event.target.getAttribute('data-path');
		loadDirectory(folderPath)();
	};

	// all folders and their paths
	const paths = document.getElementsByClassName('path');
	// attach click event to each folder
	for(let i = 0; i < paths.length; i++) {
		paths[i].addEventListener('click', load, false);
	}
}


//
function displayFiles(err, files) {
	console.log("displayFiles");
	search.resetIndex();
	if(err) {
		return alert('Kan ikke vise filer');
	}
	console.log("Adding files to searchindex");
	search.addToIndex(files);
	files.forEach(displayFile);
}

function bindSearchField(cb) {
	let el = document.getElementById('search');
	if(el != null) {
		document.getElementById('search').addEventListener('keyup', cb, false);
	}
}

function filterResults(results) {
	const validFilePaths = results.map((result) => {
		return result.ref;
	});
	const items = document.getElementsByClassName('card');
	
	for(let i = 0; i < items.length; i++) {
		let item = items[i];
		let filePath = item.getElementsByTagName('img')[0]
			.getAttribute('data-filepath');

		if(validFilePaths.indexOf(filePath) !== -1) {
			item.style = null;
		}
		else {
			item.style = 'display:none;';
		}
	}
}


function resetFilter() {
	const items = document.getElementsByClassName('item');
	for(let i = 0; i < items.length; i++) {
		items[i].style = null;
	}
}


function convertFolderPathIntoLinks(folderPath) {
	const folders = folderPath.split(path.sep);
	const contents = [];
	let pathAtFolder = '';

	folders.forEach((folder) => {
		pathAtFolder += folder + path.sep;
		contents.push(`<span class="path" data-path="${pathAtFolder.slice(0, -1)}">${folder}</span>`);
	});

	return contents.join(path.sep).toString();
}


function bindCurrentFolderPath() {
	const load = (event) => {
		const folderPath = event.target.getAttribute('data-path');
		loadDirectory(folderPath)();
	};

	const paths = document.getElementsByClassName('path');
	for(let i = 0; i < paths.length; i++) {
		paths[i].addEventListener('click', load, false);
	}
}

module.exports = { displayFiles, loadDirectory, bindSearchField, filterResults, resetFilter};