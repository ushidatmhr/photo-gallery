import * as React from 'react'
import { File } from './api/Files'
import style from '../style/preview.scss'

export interface PreviewProps {
    image: File,
    cancel: () => void
}

export default class Preview extends React.Component<PreviewProps, {}> {

    constructor(props) {
        super(props);
    }

    render() {

        if (!this.props.image) {
            return (<div />);
        }

        return (
            <div className={style.preview}>
                <img src={this.props.image.path} onClick={this.props.cancel} />
            </div>
        );
    }

}