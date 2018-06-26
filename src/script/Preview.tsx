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

    private basePoint: {
        x: number,
        y: number
    }

    constructor(props) {
        super(props);

        this.randomChange = this.randomChange.bind(this);
        this.setBasePoint = this.setBasePoint.bind(this);
        this.dragScroll = this.dragScroll.bind(this);
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


    setBasePoint(e: React.DragEvent<HTMLElement>) {

        this.basePoint = {
            x: e.clientX,
            y: e.clientY
        }
    }


    dragScroll(e: React.DragEvent<HTMLElement>) {

        e.preventDefault();

        console.log(e);
        console.log(e.clientX);

        var content = e.currentTarget as HTMLElement;
        content.scrollLeft += this.basePoint.x - e.clientX;
        content.scrollTop += this.basePoint.y - e.clientY;

        this.basePoint = {
            x: e.clientX,
            y: e.clientY
        }
    }


    render() {

        if (!this.props.image) {
            return (<div />);
        }

        return (
            <div className={style.preview} ref="preview" onDragStart={this.setBasePoint} onDragOver={this.dragScroll}>
                <img src={this.props.image.path} onClick={this.props.cancel} onContextMenu={this.randomChange} />
            </div>
        );
    }

}