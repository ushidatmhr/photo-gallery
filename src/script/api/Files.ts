import electron from "electron";
import fs from "fs";
import path from "path";

export default class Files {

    public static readonly FileType = {
        img: ['.jpg', '.jpeg', '.png', '.gif', '.bmp']
    }


    /**
     * 
     * @param callback 
     */
    public static selectDir(callback: (list: any[]) => void) {

        var fileList: File[] = [];

        var focusedWindow = electron.remote.BrowserWindow.getFocusedWindow();

        electron.remote.dialog.showOpenDialog(
            focusedWindow,
            { properties: ['openDirectory'] },
            (directories) => {

                // ディレクトリ以外は終了
                if (!directories) {
                    return;
                }

                this.addDirectory(fileList, directories[0]);

                callback(fileList);

            }
        );

        return fileList;
    }


    /**
     * 
     * @param list 
     * @param target 
     */
    private static addDirectory(list: File[], target): void {

        var files = fs.readdirSync(target);

        files.forEach((file, index) => {

            var p = path.join(target, file);

            if (fs.statSync(p).isDirectory()) {
                var f: File = {
                    name: file,
                    path: p,
                    dir: []
                };
                this.addDirectory(f.dir, p);
                list.push(f);
            }
        });
    }


    /**
     * ディレクトリ内のファイル一覧を取得する。
     * @param dirPath ディレクトリパス
     * @param types ファイルタイプ
     */
    public static openDirectory(dirPath: string, types: string[]): File[] {

        var fileList: File[] = [];

        var files = fs.readdirSync(dirPath);

        files.forEach((file, index) => {

            var p = path.join(dirPath, file);

            if (fs.statSync(p).isFile
                && this.isEnableFile(file)
                && this.isFileType(file, types)) {

                fileList.push({
                    name: file,
                    path: p,
                    dir: []
                });
            }
        });

        return fileList;
    }


    /**
     * 有効なファイル化判定する。
     * @param file ファイル名
     */
    private static isEnableFile(file: string): boolean {
        if (file.substr(0, 1) == '.') {
            return false;
        } else {
            return true;
        }
    }


    /**
     * ファイルが指定の拡張しかを判定する
     * @param file ファイル
     * @param types 判定する拡張子
     */
    private static isFileType(file: string, types: string[]): boolean {

        var extname = path.extname(file).toLowerCase();

        if (types.indexOf(extname) == -1) {
            return false;
        } else {
            return true;
        }
    }


    /**
     * 
     * @param dir 
     * @param file 
     */
    private static convertLocalPath(dir: string, file: string): string {
        return 'file:///' + dir + '/' + encodeURI(file);
    }
}

export class File {

    /** ファイル名 */
    public name: string;

    /**　パス */
    public path: string;

    /** サブディレクトリ */
    public dir: File[];
}