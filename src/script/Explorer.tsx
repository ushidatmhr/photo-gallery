import * as React from 'react'
import Files, { File } from './api/Files'
import style from '../style/explorer.css'

export interface ExplorerProps {
    dirList: File[]
}

export interface ExplorerState {

}

export default class Explorer extends React.Component<ExplorerProps, ExplorerState> {

    constructor(props) {
        super(props);

        this.state = {
        }

        this.childNode = this.childNode.bind(this);
    }



    componentWillMount(): boolean {

        var displayList = this.initDisplayFlag(this.props.dirList, [], false);

        this.setState({
            display: displayList
        });

        return true;
    }



    private initDisplayFlag(files: File[], displayList: boolean[], isChild: boolean) {

        files.forEach((file) => {
            displayList[file.name] = !isChild;
            this.initDisplayFlag(file.dir, displayList, true);
        })

        return displayList;
    }


    openTree(event: React.MouseEvent<HTMLLIElement>) {

        event.stopPropagation();

        var ulElement = event.currentTarget.firstElementChild as HTMLUListElement;

        switch (ulElement.style.display) {
            case 'block':
                ulElement.style.display = 'none';
                break;
            case 'none':
                ulElement.style.display = 'block';
                break;
        }
    }


    childNode(list: File[], parent: string): JSX.Element {

        if (!list) {
            return;
        }

        return (
            <ul className={style.dirList} style={{ display: (!parent) ? '' : 'none' }}>
                {list.map((item) => (
                    <li key={item.name} onClick={this.openTree} data-name={parent}>
                        {item.name}
                        {this.childNode(item.dir, item.name)}
                    </li>
                ))}
                {/* parent:{parent}{this.state.display[parent].toString()} */}
            </ul>
        )
    }


    render() {
        return (
            <div>
                {this.childNode(this.props.dirList, '')}
            </div>
        )
    }
}