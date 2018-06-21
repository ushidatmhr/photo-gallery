import * as React from 'react'
import Files, { File } from './api/Files';
import style from '../style/app.css'
import Explorer from './Explorer';

export interface AppState {
    dirList: File[],
    fileList: File[],
}

export default class PhotoGalleryApp extends React.Component<{}, AppState> {

    constructor(props) {
        super(props);
        this.state = {
            dirList: [],
            fileList: []
        }

        this.openFileDialog = this.openFileDialog.bind(this);
        this.selectFile = this.selectFile.bind(this);
        this.galleryRender = this.galleryRender.bind(this);
    }


    /**
     * open file dialog
     */
    public openFileDialog(event): void {
        Files.selectDir((list) => {
            this.setState((prevState) => ({
                dirList: list
            }));
        });
    }


    public selectFile(dir: File) {
        var files = Files.openDirectory(dir.path, Files.FileType.img);
        this.setState({
            fileList: files
        });
        console.log(files)
    }


    galleryRender() {
        return (
            <div>
                {this.state.fileList.map((file) => (
                    <div key={file.name}>
                        <img src={file.path} />
                    </div>
                ))}
            </div>
        )
    }


    render() {
        return (
            <div className={style.main}>
                <section className={style.mainContents}>
                    <section>
                        <button onClick={this.openFileDialog}>open</button>
                    </section>
                    <div>
                        {this.galleryRender()}
                    </div>
                </section>
                <section className={style.sideMenu}>
                    <Explorer dirList={this.state.dirList} fileSelect={this.selectFile} />
                </section>
            </div>
        )
    }

}