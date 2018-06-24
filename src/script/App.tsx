import * as React from 'react'
import Files, { File } from './api/Files';
import style from '../style/app.scss'
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
    }


    galleryRender() {
        return (
            <ul className={style.galleryContents}>
                {this.state.fileList.map((file) => (
                    <li key={file.name} className={style.itemWrap}>
                        <img src={file.path} className={style.img} />
                    </li>
                ))}
            </ul>
        )
    }


    render() {
        return (
            <div className={style.main}>
                <section className={style.mainContents}>
                    <section className={style.headerMenu}>
                        <button onClick={this.openFileDialog}>open</button>
                    </section>
                    <div className={style.galleryContainer}>
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