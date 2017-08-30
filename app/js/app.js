'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _electron = require('electron');

var _electron2 = _interopRequireDefault(_electron);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var PhotoGalleryApp = function (_React$Component) {
    _inherits(PhotoGalleryApp, _React$Component);

    function PhotoGalleryApp(props) {
        _classCallCheck(this, PhotoGalleryApp);

        var _this = _possibleConstructorReturn(this, (PhotoGalleryApp.__proto__ || Object.getPrototypeOf(PhotoGalleryApp)).call(this, props));

        _this.imgTypes = ['jpg', 'jpeg', 'png', 'gif', 'bmp'];

        _this.state = {
            fileList: [],
            viewStyle: 'list',
            display: 'none'
        };

        _this.changeViewMode = _this.changeViewMode.bind(_this);
        _this.changePrevireMode = _this.changePrevireMode.bind(_this);

        _this.openDirectory();
        return _this;
    }

    /**
     * フォルダーを選択して、画像を一覧表示する
     */


    _createClass(PhotoGalleryApp, [{
        key: 'openDirectory',
        value: function openDirectory() {
            var _this2 = this;

            var focusedWindow = _electron2.default.remote.BrowserWindow.getFocusedWindow();
            // フォルダ選択ダイアログを開く
            _electron2.default.remote.dialog.showOpenDialog(focusedWindow, {
                properties: ['openDirectory']
            }, function (directories) {

                // ディレクトリ以外は無視
                if (!directories) {
                    return;
                }

                // ディレクトリを順次処理
                directories.forEach(function (directory) {

                    _fs2.default.readdir(directory, function (error, files) {
                        if (error != null) {
                            alert('error : ' + error);
                            return;
                        }

                        files.sort(_this2.compareFileNames);

                        var fList = [];

                        // ファイルを順次処理
                        files.forEach(function (file, index) {

                            if (!_this2.checkImageFile(file)) {
                                return;
                            }

                            fList.push({
                                path: 'file:///' + directory + '/' + encodeURI(file),
                                preview: false
                            });
                        });

                        _this2.setState(function (prevState) {
                            return {
                                fileList: fList
                            };
                        });
                    });
                });
            });
        }

        /**
         * ファイル名のソート
         * @param file1 
         * @param file2 
         */

    }, {
        key: 'compareFileNames',
        value: function compareFileNames(file1, file2) {
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
                    while ((aa = file1.charAt(++i)) && isFinite(aa) || ~(fwn = fullWidthNums.indexOf(aa)) && (aa = '' + fwn)) {
                        A += aa;
                    }while ((bb = file2.charAt(++j)) && isFinite(bb) || ~(fwn = fullWidthNums.indexOf(bb)) && (bb = '' + fwn)) {
                        B += bb;
                    }if (+A === +B) {
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

    }, {
        key: 'checkImageFile',
        value: function checkImageFile(file) {

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

        /**
         * 画像一覧の表示モードを切り替える  
         * list形式 ⇔ grid形式
         * 
         * @param {*} e 
         */

    }, {
        key: 'changeViewMode',
        value: function changeViewMode(e) {

            var style = this.state.viewStyle == 'list' ? 'grid' : 'list';

            this.setState(function (prevState) {
                return {
                    viewStyle: style
                };
            });
        }

        /**
         * 画像のクリックイベント  
         * プレビューモードを切り替える
         * 
         * @param {*} e 
         */

    }, {
        key: 'changePrevireMode',
        value: function changePrevireMode(e) {

            // IDが数値以外の場合は終了
            if (!Number.isInteger(parseInt(e.target.id))) {
                return;
            }

            var newList = this.state.fileList;

            // IDから対象のファイルオブジェクトを取得
            var targetFile = newList[e.target.id];
            targetFile.preview = !targetFile.preview;

            this.setState(function (prevState) {
                return {
                    fileList: newList,
                    backdrop: targetFile.preview
                };
            });

            if (targetFile.preview) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = '';
            }
        }
    }, {
        key: 'render',
        value: function render() {
            var _this3 = this;

            var backdropStyles = this.state.backdrop ? {} : { display: 'none' };
            return _react2.default.createElement(
                'section',
                { id: 'photo-gallery' },
                _react2.default.createElement(
                    'button',
                    { onClick: this.changeViewMode },
                    'Mode'
                ),
                _react2.default.createElement(
                    'ul',
                    { className: 'img-list ' + this.state.viewStyle },
                    this.state.fileList.map(function (file, index) {
                        return _react2.default.createElement(
                            'li',
                            { key: index, onClick: _this3.changePrevireMode, className: file.preview ? 'preview' : '' },
                            _react2.default.createElement('img', { id: index, src: file.path })
                        );
                    })
                ),
                _react2.default.createElement('div', { className: 'img-backdrop', style: backdropStyles })
            );
        }
    }]);

    return PhotoGalleryApp;
}(_react2.default.Component);

_reactDom2.default.render(_react2.default.createElement(PhotoGalleryApp, null), document.getElementById('container'));