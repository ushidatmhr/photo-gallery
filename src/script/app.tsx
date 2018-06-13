import * as ReactDOM from 'react-dom';
import * as React from 'react'
import fs from 'fs';
import electron from 'electron';

export interface Props {
    content: string;
}

export default class PhotoGalleryApp extends React.Component<Props, {}> {

    render() {
        return <h1>Hello from</h1>;
    }

}