import * as React from 'react'
import Files, { File } from './api/Files';
import style from '../style/app.css'

export interface AppState {
    dirList: File[],
    fileList: string[],
    list: number[]
}

export default class PhotoGalleryApp extends React.Component<{}, AppState> {

    constructor(props) {
        super(props);
        this.state = {
            dirList: [],
            fileList: ['s'],
            list: []
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
            <div>
                <button onClick={this.openFileDialog}>open</button>
                <ul className={style.section}>
                    {this.state.dirList.map((item) => (
                        <li>{item.name}</li>
                    ))}
                </ul>
            </div>
        )
    }

}