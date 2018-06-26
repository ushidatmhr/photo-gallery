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

                this.sortByFileName(fileList);
            }
        });

        return fileList;
    }


    /**
     * 有効なファイルか判定する。
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


    public static sortByFileName(files: File[]) {
        files.sort((file1: File, file2: File) => {
            var fullWidthNums, i, j, A, B, aa, bb, fwn;
            fullWidthNums = '０１２３４５６７８９';
            i = j = -1;
            while (true) {
                A = file1.name.charAt(++i).toLowerCase();
                B = file2.name.charAt(++j).toLowerCase();
                if (!A) return -1;
                if (!B) return 1;
                if (~(fwn = fullWidthNums.indexOf(A))) A = '' + fwn;
                if (~(fwn = fullWidthNums.indexOf(B))) B = '' + fwn;
                if (isFinite(A) && isFinite(B)) {
                    while ((aa = file1.name.charAt(++i)) && isFinite(aa)
                        || ~(fwn = fullWidthNums.indexOf(aa)) && (aa = '' + fwn)) A += aa;
                    while ((bb = file2.name.charAt(++j)) && isFinite(bb)
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
        });
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