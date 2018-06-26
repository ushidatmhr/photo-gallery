import * as React from 'react'
import * as ReactDom from 'react-dom'
import { File } from './api/Files'
import style from '../style/preview.scss'

export interface PreviewProps {
    image: File,
    cancel: () => void,
    random: () => void
}

export default class Preview extends React.Component<PreviewProps, {}> {

    constructor(props) {
        super(props);

        this.randomChange = this.randomChange.bind(this);
    }

    componentDidUpdate(prevProps, prevState) {
        var element = ReactDom.findDOMNode(this.refs.preview) as HTMLElement;
        if (element) {
            element.scrollTop = 0;
            element.scrollLeft = 0;
        }
    }


    randomChange() {
        this.props.random();
    }


    render() {

        if (!this.props.image) {
            return (<div />);
        }

        return (
            <div className={style.preview} ref="preview">
                <img src={this.props.image.path} onClick={this.props.cancel} onContextMenu={this.randomChange} />
            </div>
        );
    }

}