import * as React from 'react'
import * as ReactDom from 'react-dom'
import Files, { File } from './api/Files';
import style from '../style/app.scss'
import Explorer from './Explorer';
import Preview from './Preview';
import * as FontAwesome from 'react-icons/lib/fa'

export interface AppState {
    dirList: File[],
    fileList: File[],
    preview: File,
    viewMode: string
}

export default class PhotoGalleryApp extends React.Component<{}, AppState> {

    constructor(props) {
        super(props);
        this.state = {
            dirList: [],
            fileList: [],
            preview: null,
            viewMode: style.list
        }

        this.openFileDialog = this.openFileDialog.bind(this);
        this.selectFile = this.selectFile.bind(this);
        this.changeViewMode = this.changeViewMode.bind(this);
        this.galleryRender = this.galleryRender.bind(this);
        this.cancelPreview = this.cancelPreview.bind(this);
        this.randomSelectFile = this.randomSelectFile.bind(this);
        this.viewModeIcon = this.viewModeIcon.bind(this);
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

        var element = ReactDom.findDOMNode(this.refs.gallery) as HTMLElement;
        element.scrollTop = 0;

        document.title = dir.name;
    }


    changeViewMode() {

        var view = '';

        switch (this.state.viewMode) {
            case style.grid:
                view = style.list;
                break;
            case style.list:
                view = style.grid;
                break;
        }

        this.setState({
            viewMode: view
        });
    }


    setPreview(file: File, event: React.MouseEvent<HTMLLIElement>) {
        this.setState({
            preview: file
        });
    }


    cancelPreview() {
        this.setState({
            preview: null
        });
    }


    randomSelectFile(): void {
        var random = this.state.fileList[Math.floor(Math.random() * this.state.fileList.length)];
        this.setState({
            preview: random
        });
    }


    galleryRender() {
        return (
            <ul className={`${style.galleryContents} ${this.state.viewMode}`}>
                {this.state.fileList.map((file) => (
                    <li key={file.name} className={style.itemWrap} onClick={this.setPreview.bind(this, file)}>
                        <img src={file.path} className={style.img} />
                    </li>
                ))}
            </ul>
        )
    }


    viewModeIcon(): JSX.Element {
        switch (this.state.viewMode) {
            case style.grid:
                return (
                    <FontAwesome.FaListUl size={30} color={'#616161'} />
                )
            case style.list:
                return (
                    <FontAwesome.FaTh size={30} color={'#616161'} />
                )
            default:
                return (<div />)
        }
    }


    render() {
        return (
            <div className={style.main}>

                    <section className={style.headerMenu}>
                        <button onClick={this.openFileDialog} className={style.menuBtn}>
                            <FontAwesome.FaFolderO size={30} color={'#616161'} />
                        </button>
                        <button onClick={this.changeViewMode} className={style.menuBtn}>
                            {this.viewModeIcon()}
                        </button>
                    </section>

                <section className={style.mainContents}>
                    <div className={style.galleryContainer} ref="gallery">
                        {this.galleryRender()}
                    </div>

                    <section className={style.sideMenu}>
                        <Explorer dirList={this.state.dirList} fileSelect={this.selectFile} />
                    </section>

                </section>
                <Preview image={this.state.preview} cancel={this.cancelPreview} random={this.randomSelectFile} />
            </div>
        )
    }

}