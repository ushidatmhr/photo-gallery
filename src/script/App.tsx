import * as React from 'react'
import Files, { File } from './api/Files';

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
                <section>
                    {this.state.dirList.map((item) => (
                        <a>{item.name}</a>
                    ))}
                </section>
            </div>
        )
    }

}