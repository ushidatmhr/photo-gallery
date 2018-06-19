import * as React from 'react'
import { File } from './api/Files'
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

        this.openTree = this.openTree.bind(this);
        this.childNode = this.childNode.bind(this);
    }


    /**
     * ディレクトリツリーの開閉を行う
     * @param event イベント
     */
    openTree(event: React.MouseEvent<HTMLLIElement>): void {

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


    /**
     * 
     * @param list この階層で表示するディレクトリ
     * @param parent 親要素
     */
    childNode(list: File[], parent: string): JSX.Element {

        if (!list) {
            return;
        }

        return (
            <ul className={style.dirList} style={{ display: (!parent) ? '' : 'none' }}>
                {list.map((item) => (
                    <li key={item.name} onClick={this.openTree}>
                        {item.name}
                        {this.childNode(item.dir, item.name)}
                    </li>
                ))}
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