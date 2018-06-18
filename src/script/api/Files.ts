import electron from "electron";
import fs from "fs";
import path from "path";

export default class Files {

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