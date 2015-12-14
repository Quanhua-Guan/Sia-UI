'use strict';

function download(nickname) {
	var savePath = IPCRenderer.sendSync('dialog', 'save', {
		defaultPath: nickname,
	});
	if (!savePath) {
		return;
	}
	notify('Downloading ' + nickname + ' to '+ savePath +' folder', 'download');
	IPCRenderer.sendToHost('api-call', {
		url: '/renter/files/download',
		qs: {
			nickname: nickname,
			destination: savePath,
		},
	}, 'downloaded');
}
addResultListener('downloaded', function(result) {
	update();
});

function share(nickname) {
	// Make a request to get the ascii share string
	IPCRenderer.sendToHost('api-call', {
		url: '/renter/files/shareascii',
		qs: {
			nickname: nickname,
		}
	}, 'shared');
	// Set popup title
	eID('show-ascii').querySelector('.title').innerHTML = nickname;
}
addResultListener('shared', function(result) {
	var popup = eID('show-ascii');
	show(popup);

	popup.querySelector('.ascii').innerHTML = result.File;

	update();
});

function upload(filePath, nickname) {
	IPCRenderer.sendToHost('api-call', {
		url: '/renter/files/upload',
		qs: {
			source: filePath,
			nickname: nickname,
		},
	}, 'uploaded');
	notify('Uploading ' + nickname + ' to Sia Network', 'upload');
}
addResultListener('uploaded', function(result) {
	exitFileAdder();
	update();
});

function loadDotSia(filePath) {
	IPCRenderer.sendToHost('api-call', {
		url: '/renter/files/load',
		qs: {
			filename: filePath,
		}
	}, 'file-loaded');
	notify('Adding ' + nameFromPath(filePath) + ' to library', 'siafile');
}
addResultListener('file-loaded', function(result) {
	exitFileAdder();
	update();
});

// Checks whether a path starts with or contains a hidden file or a folder.
function isUnixHiddenPath(path) {
	return (/(^|\/)\.[^\/\.]/g).test(path);
}
// Non-recursively upload all files in a directory
function uploadDir(dirPath, nickname) {
	// Upload files one at a time
	Fs.readdir(dirPath, function(err, files) {
		if (err) {
			notify('Failed retrieving directory contents', 'error');
			return;
		}
		files.forEach( function(file) {
			var filePath = Path.join(dirPath, file);

			// Skip hidden files and directories
			Fs.stat(filePath, function(err, stats) {
				if (err) {
					notify('Cannot read ' + file, 'error');
					return;
				}
				if (!isUnixHiddenPath(filePath) && stats.isFile()) {
					upload(filePath, nickname + file);
				}
			});
		});
	});
}

function loadAscii(ascii) {
	IPCRenderer.sendToHost('api-call', {
		url: '/renter/files/loadascii',
		qs: {
			file: ascii,
		}
	}, 'ascii-loaded');
	notify('Adding file(s) to library', 'asciifile');
}
addResultListener('ascii-loaded', function(result) {
	exitFileAdder();
	update();
});

function deleteFile(nickname) {
	// Make the request to delete the file.
	IPCRenderer.sendToHost('api-call', {
		url: '/renter/files/delete',
		qs: {
			nickname: nickname,
		}
	}, 'deleted');
}
addResultListener('deleted', function(result) {
	update();
});
