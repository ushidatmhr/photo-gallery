import * as React from 'react'
import Files, { File } from './api/Files';
import style from '../style/app.css'
import Explorer from './Explorer';

export interface AppState {
    dirList: File[],
    fileList: string[],
}

export default class PhotoGalleryApp extends React.Component<{}, AppState> {

    constructor(props) {
        super(props);
        this.state = {
            dirList: [],
            fileList: []
        }

        this.openFileDialog = this.openFileDialog.bind(this);
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


    render() {
        return (
            <div className={style.main}>
                <section className={style.mainContents}>
                    <section>
                        <button onClick={this.openFileDialog}>open</button>
                    </section>
                </section>
                <section className={style.sideMenu}>
                    <Explorer dirList={this.state.dirList} />
                </section>
            </div>
        )
    }

}