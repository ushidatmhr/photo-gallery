import * as React from 'react'
import { File } from './api/Files'
import style from '../style/explorer.scss'

export interface ExplorerProps {
    dirList: File[],
    fileSelect: (dir: File) => void
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

        var ulElement = event.currentTarget.parentElement.parentElement.lastElementChild as HTMLUListElement;

        switch (ulElement.style.display) {
            case 'block':
                ulElement.style.display = 'none';
                break;
            case 'none':
                ulElement.style.display = 'block';
                break;
        }
    }


    selectDir(dir: File) {
        this.props.fileSelect(dir);
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
                    <li key={item.name}>
                        <section className={style.itemRow}>
                            <span onClick={this.openTree}>▼</span>
                            <span onClick={this.selectDir.bind(this, item)} className={style.dirName}>{item.name}</span>
                        </section>
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