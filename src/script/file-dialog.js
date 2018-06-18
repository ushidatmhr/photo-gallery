// import fs from 'fs';
// import electron from 'electron';
const electron = window.require('electron');
const fs = window.require('fs');

/** ファイル拡張子 */
fileTypes = {
    img: ['jpg', 'jpeg', 'png', 'gif', 'bmp'],
    audio: ['mp3', 'mp4', 'm4a', 'aac', 'wav']
}

/**
 * 対象がディレクトリか判定する
 * 
 * @param {*} filepath 
 * @returns {boolean} ディレクトリのときにtrueを返す
 */
function _isDirectory(filepath) {
    return fs.existsSync(filepath) && fs.statSync(filepath).isDirectory();
}


/**
 * ファイル名比較
 * 
 * @param {string} file1 比較対象ファイル名
 * @param {string} file2 比較対象ファイル名
 * @returns {number} 
 *      file1 < file2なら-1,
 *      file1 = file2なら0,
 *      file1 > file2なら1
 */
function _compareFileNames(file1, file2) {
    var fullWidthNums, i, j, A, B, aa, bb, fwn;
    fullWidthNums = '０１２３４５６７８９';
    i = j = -1;
    while (true) {
        A = file1.charAt(++i).toLowerCase();
        B = file2.charAt(++j).toLowerCase();
        if (!A) return -1;
        if (!B) return 1;
        if (~(fwn = fullWidthNums.indexOf(A))) A = '' + fwn;
        if (~(fwn = fullWidthNums.indexOf(B))) B = '' + fwn;
        if (isFinite(A) && isFinite(B)) {
            while ((aa = file1.charAt(++i)) && isFinite(aa)
                || ~(fwn = fullWidthNums.indexOf(aa)) && (aa = '' + fwn)) A += aa;
            while ((bb = file2.charAt(++j)) && isFinite(bb)
                || ~(fwn = fullWidthNums.indexOf(bb)) && (bb = '' + fwn)) B += bb;
            if (+A === +B) {
                if (A.length === B.length) continue;
                return B.length - A.length;
            } else {
                return +A - +B;
            }
        }
        if (A < B) return -1;
        if (A > B) return 1;
    }
}


/**
 * 
 * @param {*} file 
 * @param {*} types 
 * @returns {boolean}
 */
function _filterFileType(file, types) {
    // ファイル名がドット始まりはNG
    if (file.substr(0, 1) == '.') {
        return false;
    } else {
        // 拡張子から画像ファイルか確認
        var type = file.split('.');
        var typeToLow = type[type.length - 1].toLowerCase();
        if (types.indexOf(typeToLow) == -1) {
            return false;
        }
    }

    return true;
}


function _removeFileTypeName(fileName) {
    var arr = fileName.split('.');
    arr.pop();
    return arr.join('.');
}

var fileDialog = {

    /**
     * ディレクトリ選択ダイアログを表示
     * @returns {} 選択したディレクトリ
     */
    openDirectoryDialog() {

        var focusedWindow = electron.remote.BrowserWindow.getFocusedWindow();

        var directories = electron.remote.dialog.showOpenDialog(focusedWindow, {
            properties: ['openDirectory']
        });

        return directories ? directories[0] : undefined;
    },


    /**
     * 指定ディレクトリ配下のディレクトリ階層を取得する
     */
    openDirectoryHierarchy(directory) {

        var thisDir = directory.split('\\');
        var dirHierarchy = {
            name: thisDir[thisDir.length - 1],
            path: directory,
            dirList: []
        }

        fileDialog._openDirectoryHierarchy(directory, dirHierarchy);

        return dirHierarchy;
    },


    _openDirectoryHierarchy(directory, dirHierarchy) {

        fs.readdir(directory, (error, files) => {
            if (error != null) {
                alert('error : ' + error);
                return;
            }

            files.forEach((file, index) => {

                // ディレクトリ以外は無視
                if (!_idDirectory(directory + '/' + file)) {
                    return;
                }

                var dir = {
                    name: file,
                    path: directory + '/' + file,
                    dirList: []
                };

                dirHierarchy.dirList.push(dir);

                fileDialog._openDirectoryHierarchy(dir.path, dir);

            });

        });
    },


    /**
     * 指定ディレクトリ内のファイルをリストにして返却する
     */
    openDirectory(directory, type) {

        var fList = [];

        var filter;
        switch (type) {
            case 'img':
                filter = fileTypes.img;
                break;
            case 'audio':
                filter = fileTypes.audio;
                break;
            default:
                console.error('typeの指定が無効です');
                return;
        }


        var files = fs.readdirSync(directory);
        files.sort(fileDialog.compareFileNames);

        // ファイルを順次処理
        files.forEach((file, index) => {

            if (!fileDialog._filterFileType(file, filter)) {
                return;
            }

            fList.push({
                name: this._removeFileTypeName(file),
                path: directory + '/' + file
            });
        });

        return fList;
    },






}



module.exports = fileDialog;