'use strict';

const async = require('async');
const fs = require('fs');
const osenv = require('osenv');
const path = require('path');

let shell = require('electron').shell;

function getHomeFolder() {
	return osenv.home();
}


function getFilesInFolder(folderPath, cb) {
	fs.readdir(folderPath, cb);
}


function inspectAndDescribeFile(filePath, cb) {
	let result = {
		file: path.basename(filePath),
		path: filePath,
		type: ''
	};

	//console.log(result);
	fs.stat(filePath, (err, stat) => {
		if(err) {
			cb(err);
		}
		else {
			if(stat.isFile()) {
				result.type = 'file';
			}
			if(stat.isDirectory()) {
				result.type = 'directory';
			}
			cb(err, result);
		}
	});
}


function inspectAndDescribeFiles(folderPath, files, cb) {
	//console.log("Inspecting and describing files");
	async.map(files, (file, asyncCb) => {
		let resolvedFilePath = path.resolve(folderPath, file);
		inspectAndDescribeFile(resolvedFilePath, asyncCb);
	}, cb);
}


function openFile(filePath) {
	shell.openItem(filePath);
}


module.exports = {
	getHomeFolder,
	getFilesInFolder,
	inspectAndDescribeFiles,
	openFile
};