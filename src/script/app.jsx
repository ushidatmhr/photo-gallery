import ReactDOM from 'react-dom';
import React from 'react';
import fs from 'fs';
import electron from 'electron';

class PhotoGalleryApp extends React.Component {


    constructor(props) {
        super(props);

        this.imgTypes = ['jpg', 'jpeg', 'png', 'gif', 'bmp'];

        this.state = {
            fileList: [],
            viewStyle: 'list',
            display: 'none',
            fileMenuStyle: 'open'
        };

        this.changeViewMode = this.changeViewMode.bind(this);
        this.changePrevireMode = this.changePrevireMode.bind(this);
        this.oprnFileHandler = this.oprnFileHandler.bind(this);
        this.dropFileHandler = this.dropFileHandler.bind(this);

        // document.getElementById('photo-gallery').addEventListener('drop', function(e){
        //     alert();
        // });
        // this.openDirectory();

        document.ondrop = function (e) {
            e.preventDefault();
            return false;
        }
    }


    /**
     * フォルダーを選択して、画像を一覧表示する
     */
    openDirectory() {

        var focusedWindow = electron.remote.BrowserWindow.getFocusedWindow();
        // フォルダ選択ダイアログを開く
        electron.remote.dialog.showOpenDialog(focusedWindow, {
            properties: ['openDirectory']
        }, ((directories) => {

            // ディレクトリ以外は無視
            if (!directories) {
                return;
            }

            // ディレクトリを順次処理
            directories.forEach((directory) => {

                fs.readdir(directory, (error, files) => {
                    if (error != null) {
                        alert('error : ' + error);
                        return;
                    }

                    files.sort(this.compareFileNames);

                    var fList = [];

                    // ファイルを順次処理
                    files.forEach((file, index) => {

                        if (!this.checkImageFile(file)) {
                            return;
                        }

                        fList.push({
                            path: 'file:///' + directory + '/' + encodeURI(file),
                            preview: false
                        });
                    });

                    this.setState((prevState) => ({
                        fileList: fList
                    }));

                });
            });

        }));
    }


    dirView(directory) {
        fs.readdir(directory, (error, files) => {
            if (error != null) {
                alert('error : ' + error);
                return;
            }

            files.sort(this.compareFileNames);

            var fList = [];

            // ファイルを順次処理
            files.forEach((file, index) => {

                if (!this.checkImageFile(file)) {
                    return;
                }

                fList.push({
                    path: 'file:///' + directory + '/' + encodeURI(file),
                    preview: false
                });
            });

            this.setState((prevState) => ({
                fileList: fList,
                backdrop: false
            }));

            document.body.style.overflow = '';

        });
    }


    /**
     * ファイル名のソート
     * @param file1 
     * @param file2 
     */
    compareFileNames(file1, file2) {
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
     * 引数のファイルが画像かどうか判定する
     * 
     * @param {string} file 判定するファイル名 
     */
    checkImageFile(file) {

        // ファイル名がドット始まりはNG
        if (file.substr(0, 1) == '.') {
            return false;
        } else {
            // 拡張子から画像ファイルか確認
            var type = file.split('.');
            var typeToLow = type[type.length - 1].toLowerCase();
            if (this.imgTypes.indexOf(typeToLow) == -1) {
                return false;
            }
        }

        return true;
    }

    oprnFileHandler(e) {
        e.preventDefault();
        this.openDirectory();
    }


    dropFileHandler(e) {
        event.preventDefault();
        event.stopPropagation();

        var targetFile = e.dataTransfer.files[0];
        this.dirView(targetFile.path);

        return false;
    }


    /**
     * 画像一覧の表示モードを切り替える  
     * list形式 ⇔ grid形式
     * 
     * @param {*} e 
     */
    changeViewMode(e) {

        var style = this.state.viewStyle == 'list' ? 'grid' : 'list';

        this.setState((prevState) => ({
            viewStyle: style
        }));
    }


    /**
     * 画像のクリックイベント  
     * プレビューモードを切り替える
     * 
     * @param {*} e 
     */
    changePrevireMode(e) {

        // IDが数値以外の場合は終了
        if (!Number.isInteger(parseInt(e.target.id))) {
            return;
        }

        var newList = this.state.fileList;

        // IDから対象のファイルオブジェクトを取得
        var targetFile = newList[e.target.id];
        targetFile.preview = !targetFile.preview;

        this.setState((prevState) => ({
            fileList: newList,
            backdrop: targetFile.preview
        }));

        if (targetFile.preview) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    }


    toggleFileMenu(e) {

        var style = this.state.fileMenuStyle == 'open' ? 'close' : 'open';

        this.setState((prevState) => ({
            fileMenuStyle: style
        }));
    }


    render() {
        var backdropStyles = this.state.backdrop ? {} : { display: 'none' };
        return (
            <div id="photo-gallery" onDrop={this.dropFileHandler}>
                <header>
                    <button onClick={this.changeViewMode}>Mode</button>
                    <button onClick={this.oprnFileHandler}>Open</button>
                    <button onClick={() => this.toggleFileMenu()}>三</button>
                </header>
                <section className="main-content">
                    <section className="gallery-container">
                        <ul className={`img-list ${this.state.viewStyle}`}>
                            {this.state.fileList.map((file, index) => (
                                <li key={index} onClick={this.changePrevireMode} className={file.preview ? 'preview' : ''}>
                                    <img id={index} src={file.path} />
                                </li>
                            ))}
                        </ul>
                    </section>
                    <nav className={`file-list-menu ${this.state.fileMenuStyle}`}>

                    </nav>
                </section>
                <div className="img-backdrop" style={backdropStyles}></div>
            </div>
        )
    }


}

ReactDOM.render(<PhotoGalleryApp />, document.getElementById('container'));